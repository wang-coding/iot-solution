import React from "react";
import Axios from "../../axios";
import {Button, Card, Col, Row, Tag, Descriptions, Tabs, Modal, Drawer, Rate, Divider, Table} from "antd";
import "./D_Gateway.less"
import colors from "../../config/colors";
import {connect} from "react-redux";
import Desc from "../../components/Desc";

const {TabPane} = Tabs;


class D_Gateway extends React.Component {
    state = {
        list: [],
        property: [],
        dataSource: [],
        visible: false,
    }

    componentDidMount() {
        let gateway = this.props.match.params.id;
        this.getDetail(gateway);
    }

    getDetail = (gateway) => {
        Axios.requestList("/detail/gateway", {id: gateway}, true, "post").then((value) => {
                this.setState({
                    property: value.result.property,
                    list: value.list[0],
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
            {name: 'device_protocol', cname: '设备间协议'},
            {name: 'uploading_protocol', cname: '设备上传协议'},
            {name: 'charge', cname: '是否可充电'},
            {name: 'desc', cname: '描述'},
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
                label: "级别",
                content: this.props.level[this.state.list.level - 1] ? this.props.level[this.state.list.level - 1].name : ''
            },
            {
                label: "使用环境", content: this.props.temperature[this.state.list.temperature - 1] ?
                    this.props.temperature[this.state.list.temperature - 1].low + '~' + this.props.temperature[this.state.list.temperature - 1].high + '℃' : ''
            }
        ];
        const descList1 = [
            {label: "输入电气特性", content: this.state.list.input},
            {label: "输出电气特性", content: this.state.list.output},
        ];
        return (
            <div>
                <div className="head">
                    <div className="title">网关</div>
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
                                该网关组网方案推荐
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
        level: state.level,
        temperature: state.temperature,
    }
}
export default connect(mapStateToProps)(D_Gateway);