import React from "react";
import Axios from "../../axios";
import {Button, Card, Col, Row, Tag, Descriptions, Tabs, Modal, Drawer, Rate, Divider, Table} from "antd";
import "./D_Gatherer.less"
import colors from "../../config/colors";
import {connect} from "react-redux";
import Desc from "../../components/Desc";

const {TabPane} = Tabs;

class D_Gatherer extends React.Component {
    state = {
        list: [],
        property: [],
        dataSource: [],
        visible: false,
    }

    componentDidMount() {
        let gatherer = this.props.match.params.id;
        this.getDetail(gatherer);
    }

    getDetail = (gatherer) => {
        Axios.requestList("/detail/gatherer", {id: gatherer}, true, "post").then((value) => {
                this.setState({
                    property: value.result.property,
                    list: value.result.list[0],
                })
            }
        )
        if (this.props.temperature.length < 1) {
            window.location.href = `/#/`;
        }
    }

    renderDetail = () => {
        let descList = [];
        let item = [
            {name: 'power', cname: '供电'},
            {name: 'structure', cname: '外部结构（包装）'},
            {name: 'd_quantity', cname: '数字量'},
            {name: 'on_off', cname: '开关量'},
            {name: 'other_input', cname: '其他输入'},
            {name: 'off_line', cname: '是否支持离线'},
            {name: 'counter', cname: '计数器'},
            {name: 'encoder', cname: '编码器'},
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
        this.setState({
            visible: true,
        });
    }

    showDrawer = () => {
        this.setState({
            visible: true
        })
    }

    onClose = () => {
        this.setState({
            visible: false
        })
    }

    render() {

        const columns = [
            {
                title: '传感器',
                dataIndex: 'sensor',
            },
            {
                title: '采集器',
                dataIndex: 'collector',
            },
            {
                title: '网关',
                dataIndex: 'gateway',
            },
            {
                title: '应用场景',
                dataIndex: 'scene',
                render: tags => (
                    <span>
        {tags.map(tag => {
            let color = colors[Math.floor(Math.random() * 10)];
            return (
                <Tag color={color} key={tag}>
                    {tag}
                </Tag>
            );
        })}
      </span>
                ),
            },
            {
                title: '评价',
                dataIndex: 'evaluate',
                render: score => (
                    <Rate disabled defaultValue={score}/>
                ),
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
        <a>详情</a>
        <Divider type="vertical"/>
        <Button type="link">收藏</Button>
      </span>
                ),
            },
        ];
        const descList = [
            {label: "品牌", content: this.state.list.brand},
            {label: "型号", content: this.state.list.model},
            {
                label: "使用环境", content: this.props.temperature[this.state.list.temperature - 1] ?
                    this.props.temperature[this.state.list.temperature - 1].low + '~' + this.props.temperature[this.state.list.temperature - 1].high + '℃' : ''
            },
            {label: "应用", content: this.state.list.desc},
        ];
        const descList1 = [
            {label: "输入电气特性", content: this.state.list.input},
            {label: "输出电气特性", content: this.state.list.output},
        ];
        return (
            <div>
                <div className="head">
                    <div className="title">数据采集器</div>
                    {<div className="tag">
                        <Tag color={colors[Math.floor(Math.random() * 10)]}>#{this.state.list.type}</Tag>
                    </div>}
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

                    <Tabs style={{marginTop:'30px'}} defaultActiveKey="1">
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
                        <Table columns={columns} dataSource={this.state.dataSource}/>
                    </Drawer>
                </Card>
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        //type: state.type,
        temperature: state.temperature,
    }
}
export default connect(mapStateToProps)(D_Gatherer);