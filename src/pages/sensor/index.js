import React from "react";
import {Button, Card, Divider, Form, Modal, Rate, Row, Select, Table} from "antd";
import Axios from "../../axios";
import ETable from "../../components/ETable";
import BaseForm from "../../components/BaseForm";
import {exportInfo} from "../../redux/action";
import {connect} from "react-redux";

class Sensor extends React.Component {

    state = {
        columns: [],
        dataSource: [],
        selectedRowKeys: [],
        selectedItem: [],
        pagination:true,
    }

    componentDidMount() {
        this.getSensorList();
    }


    updateSelectedItem = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    }

    getSensorList = () => {
        Axios.requestList("/equipment/sensor", {page: 1}, true, "post").then((value) => {
            this.setState({
                dataSource: value.list,
                currentPage: value.result.currentPage,
                totalPages: value.result.total,
                pageSize: value.result.pageSize
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

    handleDetail = (link) => {
        let url = `/#/equipment/detail/sensor/${link}`
        window.open(url);

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
            Axios.requestList("/search/sensor",{type_id:type,level:level,others:others,temperature:temp,temp_list:result},true,"post").then((value)=>{
                if(value.list.length > 0){
                    this.setState({
                        dataSource: value.list,
                        pagination:false
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
            window.location.reload();
        }

    }

    onChange = (page) => {
        Axios.requestList("/equipment/sensor", {page: page}, true, "post").then((value) => {
            this.setState({
                dataSource: value.list,
                currentPage: value.result.currentPage,
                totalPages: value.result.total,
                pageSize: value.result.pageSize
            })
        })
    }


    render() {
        const columns = [
            {
                title: "品牌",
                dataIndex: "brand",
            },
            {
                title: "型号",
                dataIndex: "model",
            }, {
                title: "类型",
                dataIndex: "type",
                render: (text) => {
                    let type = this.props.type;
                    if (type[text-1]) {
                        return type[text-1].name;
                    }
                    return text;
                }
            }, {
                title: "等级",
                dataIndex: "level",
                render: (text) => {
                    let level = this.props.level;
                    if (level[text-1]) {
                        return level[text-1].name;
                    }
                    return text;
                }
            }, {
                title: "适用环境",
                dataIndex: "temperature",
                render: (text) => {
                    let temp = this.props.temperature;
                    if (temp[text-1]) {
                        return temp[text-1].low + " ~ " + temp[text-1].high + "℃";
                    }
                    return text;
                }
            }, {
                title: "应用",
                dataIndex: "detail",
            }, {
                title: '操作',
                render: (text, record) =>
                    (
                        <span>
                            <Button type="link" onClick={this.handleDetail.bind(null, record.id)}>详情</Button>
                            <Divider type="vertical"/>
                            <Button type="link" style={{color: "#f9c700"}}>收藏</Button>
                        </span>
                    )

            }
        ]
        const formList = [
            {
                label: "类型",
                initialValue: "all",
                field: "type",
                width: 120,
                type: "SELECT",
                list: this.props.type
            }, {
                label: "级别",
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
                    type: "primary",
                    style : {margin: '0 10px'},
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


        return (
            <div>
                <Card>
                    <BaseForm

                        formList={formList}
                        filterSubmit={this.filterSubmit}
                        extension={extension}
                    />
                </Card>
                <div hidden={!this.state.pagination}>
                <ETable
                    dataSource={this.state.dataSource}
                    columns={columns}
                    selectedRowKeys={this.state.selectedRowKeys}
                    updateSelectedItem={this.updateSelectedItem}
                    selectedItem={this.state.selectedItem}
                    pagination={
                        {
                            showQuickJumper: true,
                            current: this.state.currentPage,
                            total: this.state.totalPages,
                            pageSize: this.state.pageSize,
                            showTotal: (total) => {
                                return `共${total}条数据`
                            },
                            onChange: this.onChange
                        }
                    }
                />
            </div>
                <div hidden={this.state.pagination}>
                    <ETable
                        dataSource={this.state.dataSource}
                        columns={columns}
                        selectedRowKeys={this.state.selectedRowKeys}
                        updateSelectedItem={this.updateSelectedItem}
                        selectedItem={this.state.selectedItem}

                    />
                </div>

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
export default connect(mapStateToProps)(Sensor);