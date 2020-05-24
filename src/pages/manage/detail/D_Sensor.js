import React from "react";
import Axios from "../../../axios";
import {Button, Card, Col, Row, Tag, Input, Tabs, Modal, Form, Rate, Divider, Table, message, Cascader} from "antd";
import "./D_Sensor.less"
import colors from "../../../config/colors";
import {connect} from "react-redux";
import Desc from "../../../components/Desc";
import {exportInfo} from "../../../redux/action";
import BaseForm from "../../../components/BaseForm"

const {TabPane} = Tabs;

class SensorDetail extends React.Component {
    state = {
        list: [],
        property: [],
        visible: false,
        signal:[],
        visible2:false,
        signal_detail:[],
        visible3:false
    }

    componentDidMount() {
        let sensor = this.props.match.params.id;
        this.getDetail(sensor);
        if (sensor) {
            this.getDetail(sensor);
        } else {
            window.location("/#/");
        }
        this.getSignalList();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {

    }

    getSignalList() {
        let list = [];
        let temp={}
        Axios.requestList("/param/signal", {}, true, "post").then((value) => {
                value.list.map(item=>{
                    if(temp[item.signal_type]==null){
                        temp[item.signal_type]={children:[]}
                    }
                    temp[item.signal_type].children.push(item)
                })
                for(const key in temp){
                    let t = {}
                    temp[key].children.map(it=>{
                        if(t[it.signal]==null){
                            t[it.signal]={children:[]}
                        }
                        t[it.signal].children.push(it)
                    })
                    let c = [];
                    for (const k in t){
                        let m = []
                        t[k].children.map(i=>{
                            m.push({value:i.id,label:i.desc})
                        })
                        c.push({value:k,label:k,children:m})
                    }
                    list.push({value:key,label:key,children:c})
                }
                this.setState({
                    signal: list,
                })
            }
        )
    }

    getDetail = (sensor) => {
        Axios.requestList("/detail/sensor", {id: sensor}, true, "post").then((value) => {
                this.setState({
                    list: value.list[0],
                })
            }
        )
        if (this.props.type.length < 1) {
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

    renderDetail = () => {
        let descList = [];
        let item = [
            {name: 'range', cname: '量程范围'},
            {name: 'precision', cname: '精确度'},
            {name: 'error', cname: '误差'},
            {name: 'res_time', cname: '响应时间'},
            {name: 'structure', cname: '外部结构（包装）'},
            {name: 'application', cname: '应用说明'},
            {name: 'advantage', cname: '优势'},
            {name: 'others', cname: '其他'},
        ];
        item.forEach((item, i) => {
            let name = item.name;
            if (this.state.list[name] && this.state.list[name] != '') {
                let desc = {
                    label: item.cname,
                    content: this.state.list[name]
                }
                descList.push(desc);
            }
        })
        return descList;
    }

    returnBack = () => {
        window.history.back(-1);
    }

    InfoAlter = () => {
        this.setState({
            visible: true,
        })
    }

    handleOk = () => {
        this.setState({
            visible: false
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false
        })
    }

    handleOk2 = () => {
        this.setState({
            visible2: false
        })
    }

    handleCancel2 = () => {
        this.setState({
            visible2: false
        })
    }

    filterSubmit = (fieldsValue)=>{
        Axios.ajax({
            url:"/management/sensor",
            data:{
                params:{id: this.props.match.params.id,all:fieldsValue},
            },
            method:"post",
        }).then(data=>{
            if(data && data.result ){
                message.success("更新成功")
            }else {
                message.error("更新失败")
            }
        })
    }

    SignalManage=()=>{
        this.setState({
            visible2: true
        })
    }

    signalAlter=(value)=> {
        this.setState({
            signal_detail:value
        })
    }

    signalChange=()=>{
        if(this.state.signal_detail.length!=0){
            this.setState({
                visible3: true
            })
        }else {
            message.info("请选择信号")
        }
    }

    changeFinish=(value)=>{

    }

    getAllData=()=>{
        let res = [];
        let properties = [
            {name: 'brand', cname: '品牌'},
            {name: 'model', cname: '型号'},
            {name: 'type', cname: '类型'},
            {name: 'level', cname: '级别'},
            {name: 'temperature', cname: '适用环境'},
            {name: 'detail', cname: '类型说明'},
            {name: 'input', cname: '电源'},
            {name: 'output', cname: '输出信号'},
            {name: 'range', cname: '量程范围'},
            {name: 'precision', cname: '精确度'},
            {name: 'error', cname: '误差'},
            {name: 'res_time', cname: '响应时间'},
            {name: 'structure', cname: '外部结构（包装）'},
            {name: 'application', cname: '应用说明'},
            {name: 'advantage', cname: '优势'},
            {name: 'others', cname: '其他'},
        ];
        properties.map(item=>{
            let i;
            let currentTemp = this.state.list['temperature']
            switch (item.name) {
                case 'type' :
                    i = {
                        label: "类型",
                        initialValue: this.state.list['type'],
                        field: "type",
                        width: 200,
                        type: "SELECT",
                        list: this.props.type
                    }
                    break;
                case 'level':
                    i = {
                        label: "级别",
                        initialValue: this.state.list['level'],
                        field: "level",
                        width: 200,
                        type: "SELECT",
                        list: this.props.level
                    }
                    break;
                case 'temperature':
                    i = {
                        label: "适用环境",
                        initialValue: this.props.temperature[currentTemp - 1] ? this.props.temperature[currentTemp - 1].low + ',' + this.props.temperature[currentTemp - 1].high : '',
                        field: "temperature",
                        width: 300,
                        type: "INPUT",
                        help:"请输入最低温度和最高温度，格式为(low,high)，如-20，50"
                    }
                    break;
                case 'output':
                    i = {
                        label:'输出信号类型',
                        initialValue:this.state.list['output']?[this.state.list['output'].signal_type,this.state.list["output"].signal,this.state.list["output"].id]:[],
                        field:'output',
                        type:"CAS",
                        list:this.state.signal
                    }
                    break;
                default:
                    i = {
                        label:item.cname,
                        initialValue:this.state.list[item.name],
                        field:item.name,
                        type:"INPUT",
                        width:300,
                    }
            }
            res.push(i);
        })
        res.push({type:"BUTTON",label:"修改",field:"modify",param:{type:"primary",style:{marginLeft:"400px"}}} )
        return <BaseForm
            layout = {true}
            formList={res}
            filterSubmit={this.filterSubmit}
        />;
    }

    render() {
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };
        const tailLayout = {
            wrapperCol: { offset: 4 ,span: 16 },
        };
        const descList = [
            {label: "品牌", content: this.state.list.brand},
            {label: "型号", content: this.state.list.model},
            {
                label: "级别",
                content: this.props.level[this.state.list.level - 1] ? this.props.level[this.state.list.level - 1].name : ''
            },
            {
                label: "使用环境", content: this.props.temperature[this.state.list.temperature - 1] ?
                    this.props.temperature[this.state.list.temperature - 1].low + '~' + this.props.temperature[this.state.list.temperature - 1].high + '℃' : ''
            },
            {label: "应用", content: this.state.list.detail},
        ];
        const descList1 = [
            {label: "输入电气特性", content: this.state.list.input},
            {label: "输出电气特性", content: this.state.list.output?"类型："+this.state.list.output.signal+"，信号量："+this.state.list.output.signal+"，其他描述："+this.state.list.output.desc:" "},
        ];
        let type = this.props.type[this.state.list.type];
        return (
            <div>
                <div className="head">
                    <div className="title">传感器</div>
                    <div className="tag">
                        <Tag color={colors[Math.floor(Math.random() * 10)]}>#{type ? type.name : ''}</Tag>
                    </div>
                    <Button className="button" onClick={this.returnBack} size="small">返回上一页</Button>
                </div>

                <Card
                    style={{
                        overflow: 'hidden',
                    }}
                >
                    <Row>
                        <Col span={14}>
                            <Desc
                                descList={descList}
                            />
                        </Col>
                        <Col span={10}>
                            <Button className="recommend" type="primary" icon="" onClick={this.InfoAlter}>
                                信息更改
                            </Button>
                            <Button className="recommend" type="primary" icon="" onClick={this.SignalManage}>
                                信号管理
                            </Button>
                        </Col>
                    </Row>

                    <Tabs defaultActiveKey="1">
                        <TabPane tab="详细介绍" key="1">
                            <Desc
                                descList={this.renderDetail()}
                                bordered={true}
                            />
                        </TabPane>
                        <TabPane tab="输入输出" key="2">
                            <Desc
                                descList={descList1}
                            />
                        </TabPane>
                    </Tabs>
                </Card>
                <Modal
                    title="更改信息"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确认"
                    cancelText="取消"
                    width={1000}
                >
                    {this.getAllData()}
                </Modal>
                <Modal
                    title="信号管理"
                    visible={this.state.visible2}
                    onOk={this.handleOk2}
                    onCancel={this.handleCancel2}
                    okText="确认"
                    cancelText="取消"
                    width={800}
                >
                    <Cascader
                        placeholder="请选择"
                        options={this.state.signal}
                        style={{width:"300px",margin:"0 0 50px 160px"}}
                        onChange={this.signalAlter}

                    />
                    <Button type="primary" style={{margin:"0 20px"}} onClick={this.signalChange}>修改</Button>
                    <Button type="primary">增加</Button>
                    <Form
                        {...layout}
                        onFinish={this.changeFinish}
                        style={this.state.visible3?{}:{display:"none"}}
                    >
                        <Form.Item
                            label="信号类型"
                            name="signal_type"
                        >
                            <Input defaultValue={this.state.signal_detail.length}/>
                        </Form.Item>

                        <Form.Item
                            label="信号量"
                            name="signal"
                            initialValue={this.state.signal_detail[1]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="信号描述"
                            name="desc"
                            initialValue={this.state.signal_detail[2]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
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
export default connect(mapStateToProps)(SensorDetail);