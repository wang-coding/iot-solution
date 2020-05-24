import React from "react";
import {Button, Card,  Modal,  Icon, Dropdown, Menu,AutoComplete,message} from "antd";
import Axios from "../../axios";
import BaseForm from "../../components/BaseForm"
import {exportInfo} from "../../redux/action"
import {connect} from "react-redux"
import SolutionTable from "../../components/SolutionTable";

const { Option } = AutoComplete;
class Search extends React.Component {

    state = {
        dataSource: [],
        industries:[],
        temp:[],
        pagination:false,
        page:1,
        searchSource:[],
        hidden:true,
    }

    componentDidMount() {
        this.initSolution();
    }


    initSolution = () => {
        Axios.requestList("/solution/industry", {industry:2}, true, "post").then((value) => {
            this.setState({
                dataSource: value.list
            })
        })
        Axios.requestList("/param/industries",{},false,"post").then((value) => {
            this.setState({
                industries: value.list,
                temp: value.list
            })
        })
        if(this.props.type.length<1){
            Axios.requestList("/param", {}, false, "post").then((value) => {
                const {dispatch} = this.props;      //使用connect后props中存在dispatch方法
                dispatch(exportInfo({
                    temperature: value.result.temperature,
                    level: value.result.level,
                    type: value.result.type,
                }, 'SENSOR_PARAM'));
            })
        }
    }

    filterSubmit = (fieldsValue) => {
        let type = fieldsValue.type;
        let level = fieldsValue.level;
        let others = fieldsValue.others;
        let temp = fieldsValue.temperature;
        let low = fieldsValue.low;
        let high = fieldsValue.high;
        let tempList = this.props.temperature;
        let result = [];
        if(tempList.length > 0 && temp){
            tempList.map((item,index)=>{
                if (item.low <= low && item.high >= high){
                    result.push(index+1);
                }
            })
        }if(type!='all'||level!='all'||others!='请输入传感器特点'||temp==true){
            Axios.requestList("solution/search",{type_id:type,level:level,others:others,temperature:temp,temp_list:result,page:this.state.page},true,"post").then((value)=>{
                if(value.list.length > 0){
                    this.setState({
                        searchSource: value.list,
                        hidden:false
                    });
                    if(value.result.message!=''){
                        Modal.info({
                            title:"提示",
                            content:value.result.message
                        })
                    }

                }else {
                    Modal.info({
                        title:"提示",
                        content:value.result.message
                    })
                }
            })
        }else {
            message.info("请输入查询条件");
        }

    }

    handleSearch=(value)=>{
        let result = [];
        this.state.industries.map(industry => {
            if(industry.name.indexOf(value) >= 0 ){
                result.push(industry);
            }
        });
        if (!value || result.length <= 0) {
            result = this.state.industries;
        }
        this.setState({ temp:result });
    }

    selectIndustry=(value)=>{
        Axios.requestList("/solution/industry", {industry:value}, true, "post").then((value) => {
            this.setState({
                dataSource: value.list,
                pagination:{defaultPageSize:"10"},
            })
        })
    }

    searchByIndustry=(children)=>{
        return <Menu>
            <div style={{ padding: 8 }}>
                <AutoComplete style={{ width: 200 }} onSearch={this.handleSearch} onSelect={this.selectIndustry} placeholder="请输入行业名称">
                    {children}
                </AutoComplete>
            </div>
        </Menu>
    }

    handleHidden=()=>{
        this.setState({
            hidden:true
        })
    }

    handlePage=(value)=>{
        Axios.requestList("solution/search",{page:value+1},true,"post").then((value)=>{
            if(value.list.length > 0){
                this.setState({
                    searchSource: value.list,
                    page:value+1,
                    hidden:false
                });
                if(value.result.message!=''){
                    Modal.info({
                        title:"提示",
                        content:value.result.message
                    })
                }

            }else {
                Modal.info({
                    title:"提示",
                    content:value.result.message
                })
            }
        })
    }

    render() {

        const formList = [
            {
                label: "传感器类型",
                initialValue: "all",
                field: "type",
                width: 120,
                type: "SELECT",
                list: this.props.type
            }, {
                label: "级别要求",
                initialValue: "all",
                field: "level",
                width: 165,
                type: "SELECT",
                list: this.props.level
            }, {
                label: "应用关键字",
                initialValue: "请输入传感器特点",
                field: "others",
                width: 165,
                type: "INPUT",
            }, {
                label: "其他条件(温度)",
                field: "temperature",
                type: "CHECKBOX",
            },
            {
                label: "查询",
                field: "search",
                type: "BUTTON",
                param: {
                    style : {margin: '0 10px'},
                    type: "primary"
                },
            }, {
                label: "重置",
                field: "reset",
                type: "BUTTON",
                param: {
                    style : {margin: '0 10px'},
                },
            },]
        const extension = [
            {
                label: "使用环境",
                initialValue: "0",
                field: "low",
                width: 130,
                unit: "℃",
                type: "NUMBER",
            }, {
                label: "~",
                initialValue: "0",
                field: "high",
                width: 130,
                colon: false,
                unit: "℃",
                type: "NUMBER",
            },]
        const children = this.state.temp.map(industry => <Option key={industry.value}>{industry.name}</Option>);

        return (
            <div>
                <Card>
                    <BaseForm

                        formList={formList}
                        filterSubmit={this.filterSubmit}
                        extension={extension}
                    />
                </Card>
                <Card title="搜索结果" hidden={this.state.hidden} extra={<div><Button type="dashed" onClick={this.handleHidden} style={{marginRight:"10px"}}>隐藏结果</Button><Button type="primary" onClick={this.handlePage.bind(null,this.state.page)}>换一页</Button></div> }>
                    <SolutionTable
                        dataSource={this.state.searchSource}
                        simple="noScore"
                        expandedRow="table"
                        expandClick={true}
                        pagination={false}
                    />
                </Card>
                <Card title="组网方案推荐" extra={ <Dropdown overlay={this.searchByIndustry(children)}>
                    <Button type="primary"><Icon type="search"/>按行业搜索</Button>
                </Dropdown>}>
                    <SolutionTable
                        dataSource={this.state.dataSource}
                        simple={false}
                        expandedRow="table"
                        expandClick={true}
                        pagination={this.state.pagination}
                    />
                </Card>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        type: state.type,
        level: state.level,
        temperature: state.temperature,
    }
}
export default connect(mapStateToProps)(Search);