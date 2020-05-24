import React from "react";
import {connect} from "react-redux";
import {Table, Col, Row, Tabs, Card, Button} from "antd";
import RightCommunity from "../../components/RightCommunity";
import "./index.less"
import Axios from "../../axios";
import {exportInfo} from "../../redux/action";
import Desc from "../../components/Desc";

const {TabPane} = Tabs;
const Table1 = [
    "传感器品牌", "类型", "等级", "适用环境", "应用", "电源", "输出电气特性", "外部结构", "量程范围", "精确度", "误差", "响应时间", "应用详情", "优势", "其他",
];
const Table2 = [
    "采集器品牌", "类型", "适用环境", "输入电气特性", "输出电气特性", "总线协议", "电源", "数字量", "开关量", "其他输入电气特性", "支持离线", "外部结构", "计数器", "编码器","其他描述"
];
const Table3 = [
    "网关品牌", "等级", "适用环境", "设备间协议", "上传协议", "电源", "可充电", "描述其他",
];
const Table4 = [
    "评分", "行业",
];

class Comparision extends React.Component {
    state = {
        solutions:[],
        sensor: [],
        gatherer: [],
        gateway: [],
        solution:[],
    }

    componentDidMount() {
        this.initSensorData();
    }


    initSensorData=()=>{
        this.setState({
            solutions:[{id:1,sensor_id:1,sensor_model:"1234",gatherer_id:1,gatherer_model:"1234",gateway_id:1,gateway_model:"1234",}]
        })
        let solutions = [{id:1,sensor_id:1,sensor_model:"1234",gatherer_id:1,gatherer_model:"1234",gateway_id:1,gateway_model:"1234",}];
        let sensor = [];
        let property = ["brand","type","level","temperature","detail","input","output","structure","range","precision","error","res_time","application","advantage","others"]
        if(solutions.length>0){
            solutions.forEach(item => {
                Axios.requestList("/detail/sensor", {id: item.sensor_id}, true, "post").then((value) => {
                        let oneSensor = [];
                        let list = value.list[0]
                        property.map(item=>{
                            if(list[item]==null){
                                oneSensor.push("");
                            }else {
                                oneSensor.push(list[item])
                            }
                        })
                        sensor[sensor.length]=oneSensor;
                        this.setState({
                            sensor: sensor
                        })
                    }
                )
            })
        }
    }

    getSensorData = () => {
        let solutions = this.state.solutions;
        let sensor = [];
        let property = ["brand","type","level","temperature","detail","input","output","structure","range","precision","error","res_time","application","advantage","others"]
        if(solutions.length>0){
            solutions.forEach(item => {
                Axios.requestList("/detail/sensor", {id: item.sensor_id}, true, "post").then((value) => {
                        let oneSensor = [];
                        let list = value.list[0]
                        property.map(item=>{
                            if(list[item]==null){
                                oneSensor.push("");
                            }else {
                                oneSensor.push(list[item])
                            }
                        })
                        sensor[sensor.length]=oneSensor;
                    this.setState({
                        sensor: sensor
                    })
                    }
                )
            })
        }
    }

    getGathererData=()=>{
        let solutions = this.state.solutions;
        let gatherer = [];
        let property = ["brand","type","temperature","input","output","bus_protocol","structure","power","d_quantity","on_off","other_input","off_line","counter","encoder"]
        if(solutions.length>0){
            solutions.forEach(item => {
                Axios.requestList("/detail/gatherer", {id: item.gatherer_id}, true, "post").then((value) => {
                        let oneGatherer = [];
                        let list = value.list[0]
                        property.map(item=>{
                            if(list[item]==null){
                                oneGatherer.push("");
                            }else {
                                oneGatherer.push(list[item])
                            }
                        })
                        gatherer[gatherer.length]=oneGatherer;
                        this.setState({
                            gatherer: gatherer
                        })
                    }
                )
            })
        }
    }

    getGatewayData=()=>{
        let solutions = this.state.solutions;
        let gateway = [];
        let property = ["brand","level","temperature","device_protocol","uploading_protocol","input","charge","desc","others"]
        if(solutions.length>0){
            solutions.forEach(item => {
                Axios.requestList("/detail/gateway", {id: item.gateway_id}, true, "post").then((value) => {
                        let oneGateway = [];
                        let list = value.list[0]
                        property.map(item=>{
                            if(list[item]==null){
                                oneGateway.push("");
                            }else {
                                oneGateway.push(list[item])
                            }
                        })
                        gateway[gateway.length]=oneGateway;
                        this.setState({
                            gateway: gateway
                        })
                    }
                )
            })
        }
    }

    getSolutionDate=()=>{
        let solutions = this.state.solutions;
        let solution = [];
        let property = ["evaluate","industry"]
        if(solutions.length>0){
            solutions.forEach(item => {
                Axios.requestList("/solution/detail", {id: item.id}, true, "post").then((value) => {
                        let oneSolution = [];
                        let list = value.list[0]
                        property.map(item=>{
                            if(list[item]==null){
                                oneSolution.push("");
                            }else {
                                oneSolution.push(list[item])
                            }
                        })
                        solution[solution.length]=oneSolution;
                        this.setState({
                            solution: solution
                        })
                    }
                )
            })
        }
    }

    changeTab = (value) => {
        if(value==1){
            this.getSensorData()
        }else if(value==2){
            this.getGathererData()
        }else if (value==3){
            this.getGatewayData()
        }else {
            this.getSolutionDate();
        }
    }

    renderTable = (data, table) => {
        const column = [{
            title: '传感器方案',
            dataIndex: 'col',
            width: 100,
        },];
        let solutions = this.state.solutions;
        if(solutions.length>0){

            solutions.map((item, index) => {
                column.push({
                    title: `传感器${item.sensor_model}`,
                    children: [
                        {
                            title: `采集器${item.gatherer_model}`,
                            width: 100,
                            children: [
                                {
                                    title: `网关${item.gateway_model}`,
                                    dataIndex: "col" + index,
                                    width: 100,
                                }
                            ],
                        }
                    ],
                })
            })
        }

        let dataSource = [];

        table.map((item, index) => {
            dataSource.push({col: item});
            data.map((ite, ind) => {
                dataSource[index]["col" + ind] = ite[index];

            })
        })
        let width = 20 *(solutions.length+1);
        return <Table
            columns={column}
            dataSource={dataSource}
            pagination={false}
            bordered={true}
            style={{width:`${width}%`}}
        />;
    }

    getDescList=()=>{
        let solutions = this.state.solutions;
        let descList=[];
        if(solutions.length>0){
            solutions.map((item,index)=>{
                let num = ["一","二","三","四"];
                descList.push({label:`方案${num[index]}（第${index+1}列方案）`,content:`传感器${item.sensor_model}、采集器${item.gatherer_model}、网关${item.gateway_model}`})
            })
        }

        return descList;
    }

    deleteButton=()=>{
        let buttons = [];
        let solutions = this.state.solutions.length;
        for(let i =0;i<solutions;i++){
            buttons.push(<div><Button type="primary" size="small" onClick={this.deleteSolution.bind(this,i)}>移除</Button></div>);
        }
        return buttons;
    }

    deleteSolution=(id)=>{
        let solutions = this.state.solutions;
        solutions.splice(id,1)
        const {dispatch} = this.props;      //使用connect后props中存在dispatch方法
        dispatch(exportInfo(
            solutions
            , 'SOLUTION'));
        this.setState({
            solutions: solutions
        })
    }

    render() {

        return (
            <div>
                <Row gutter={16}>
                    <Col span="18" className="comparision-left">
                        <Card title="方案对比">
                            <Col span={16}>
                                <Desc
                                    descList={this.getDescList()}
                                />
                            </Col>
                            <Col  span={8}>
                                {this.deleteButton()}
                            </Col>

                        </Card>
                        <Tabs onChange={this.changeTab} type="card">
                            <TabPane tab="传感器" key="1">
                                {this.renderTable(this.state.sensor,Table1)}
                            </TabPane>
                            <TabPane tab="数据采集器" key="2">
                                {this.renderTable(this.state.gatherer,Table2)}
                            </TabPane>
                            <TabPane tab="网关" key="3">
                                {this.renderTable(this.state.gateway,Table3)}
                            </TabPane>
                            <TabPane tab="其他" key="4">
                                {this.renderTable(this.state.solution,Table4)}
                            </TabPane>
                        </Tabs>,

                    </Col>
                    <RightCommunity/>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        solution: state.solution,
        type: state.type,
        level: state.level,
        temperature: state.temperature,
    }
}
export default connect(mapStateToProps)(Comparision);