import React from "react";
import Axios from "../../axios";
import {Button, Card, Col, Row, Tag, Descriptions, Tabs, Modal, Drawer, Rate, Divider, Table} from "antd";
import "./D_Sensor.less"
import colors from "../../config/colors";
import {connect} from "react-redux";
import Desc from "../../components/Desc";
import SolutionTable from "../../components/SolutionTable"
import {exportInfo} from "../../redux/action";
const {TabPane} = Tabs;

class D_Sensor extends React.Component {
    state = {
        list: [],
        property: [],
        dataSource: [],
        visible: false,
    }

    componentDidMount() {
        let sensor = this.props.match.params.id;
        this.getDetail(sensor);
        if (sensor) {
            this.getDetail(sensor);
        } else {
            window.location("/#/");
        }

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

    recommend = () => {
        Axios.requestList("/solution/sensor", {id: this.props.match.params.id}, true, "post").then((value) => {
                this.setState({
                    dataSource: value.list,
                    visible: true,
                })
            }
        )
    }

    onClose = () => {
        this.setState({
            visible: false
        })
    }

    render() {
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
                            <Button className="recommend" type="primary" icon="" onClick={this.recommend}>
                                该传感器组网方案推荐
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
                    <Drawer
                        title="组网方案"
                        placement="right"
                        onClose={this.onClose}
                        visible={this.state.visible}
                        getContainer={false}
                        style={{position: 'absolute'}}
                        width="800px"
                    >
                        <SolutionTable
                            dataSource={this.state.dataSource}
                            simple={true}
                            expandedRow="table"
                            expandClick={true}
                            pagination={{defaultPageSize:"7"}}
                        />
                    </Drawer>
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
export default connect(mapStateToProps)(D_Sensor);