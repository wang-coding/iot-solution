import React from "react";
import {PageHeader, Button, Tag, Icon, Dropdown, Menu, AutoComplete, Tabs, Divider} from "antd";
import colors from "../../config/colors";
import Axios from "../../axios";
import "./index.less";
import SolutionTable from "../../components/SolutionTable";
import ETable from "../../components/ETable";
import {connect} from "react-redux"
import {exportInfo} from "../../redux/action";

const {TabPane} = Tabs;
const { Option } = AutoComplete;
class Bookmarks extends React.Component{
    state={
        industry:"",
        industries:[],
        temp:[],
        sensor:[],
        gatherer:[],
        gateway:[],
        solution:[],
        bookmarks:{},
    }

    constructor(props){
        super(props);
        this.getBookmarksData();
    }

    componentDidMount() {
        this.initIndustries();

    }

    getBookmarksData=()=>{
        Axios.requestList("/bookmarks",{id:1},true,"post").then((one) => {
            if(!one.result||!one.result.bookmarks){
                return;
            }
            let res = one.result.bookmarks;
            let sensor=this.setKey(res.sensor);
            let gatherer=this.setKey(res.gatherer);
            let gateway=this.setKey(res.gateway);
            let solution=this.setKey(res.solution);

            this.setState({
                sensor,
                gatherer,
                gateway,
                solution,
            })
        })
        Axios.requestList("/param", {}, false, "post").then((value) => {
            const {dispatch} = this.props;      //使用connect后props中存在dispatch方法
            dispatch(exportInfo({
                temperature: value.result.temperature,
                level: value.result.level,
                type: value.result.type,
            }, 'SENSOR_PARAM'));
        })
    }

    setKey=(array)=>{
        let list = array.map((item, index) => {
            item.key = index;
            return item
        });
        return list;
    }

    initIndustries=()=>{
        Axios.requestList("/param/industries",{},false,"post").then((value) => {
            this.setState({
                industries: value.list,
                temp: value.list
            })
        })
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

    selectIndustry=(name)=>{
        let industry = this.state.industries[parseInt(name)];
        Axios.requestList("/solution/industry", {industry:name}, true, "post").then((value) => {
            this.setState({
                dataSource: value.list,
                industry:industry?industry.name:""
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

    handleDetail = (link) => {
        let url = `/#/equipment/detail/sensor/${link}`
        window.open(url);

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
        ];
        const children = this.state.temp.map(industry => <Option key={industry.value}>{industry.name}</Option>);
        return(
            <div className="bookmarks">
                <PageHeader
                    title="收藏夹"
                    tags={<Tag color={colors[Math.floor(Math.random() * 10)]}>{this.state.industry}</Tag>}
                    extra={[
                        <Dropdown overlay={this.searchByIndustry(children)}>
                            <Button type="primary"><Icon type="search"/>按行业搜索</Button>
                        </Dropdown>
                    ]}
                >
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="物联网方案" key="1">
                            <SolutionTable
                                dataSource={this.state.solution}
                                simple="noBook"
                                expandedRow="table"
                                expandClick={true}
                            />
                        </TabPane>
                        <TabPane tab="传感器" key="2">
                            <ETable
                                dataSource={this.state.sensor}
                                columns={columns}
                                bordered={false}
                            />
                        </TabPane>
                        <TabPane tab="数据采集器" key="3">
                            Content of Tab Pane 3
                        </TabPane>
                        <TabPane tab="网关" key="4">
                            Content of Tab Pane 4
                        </TabPane>
                    </Tabs>,
                </PageHeader>
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
export default connect(mapStateToProps)(Bookmarks);