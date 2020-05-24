import React from "react";
import {Row, Input, Form, Card, Button, Modal, Table, Divider, Checkbox} from "antd";
import Axios from "../../axios";
import {exportInfo} from "../../redux/action";
import {connect} from "react-redux"

const {Search} = Input;
const FormItem = Form.Item;

class SensorManage extends React.Component {
    state = {
        industries: [],
        data: [],
        search: "model",
        product: 1,
        exh_product: 1,
    }

    constructor(props) {
        super(props);
        this.getExhibitionData();
        this.getParam();
    }

    getParam = () => {
        new Promise((resolve, reject) => {
            Axios.requestList("/param", {}, false, "post").then((value) => {
                this.setState({
                    temperature: value.result.temperature,
                    level: value.result.level,
                    type: value.result.type,
                })
                resolve({
                    temperature: value.result.temperature,
                    level: value.result.level,
                    type: value.result.type,
                })
            })
        }).then((value) => {
            const {dispatch} = this.props;      //使用connect后props中存在dispatch方法
            dispatch(exportInfo({
                type: value.type,
                level: value.level,
                temperature: value.temperature
            }, 'SENSOR_PARAM'));
        })

    }

    handleDetail = (link) => {
        window.open(`/#/management/detail/sensor/${link}`)
    }

    getExhibitionData = () => {
        Axios.requestList("/solution/exhibition", {}, false, "post").then((value) => {
            let industries = [];
            let data = value.list;
            data.forEach((item,i)=>{
                let industry = item[0].industry;
                let ob = {
                    key:industry,
                    title:industry,
                    children: [
                        {
                            title: "传感器",
                            key: `/equipment/sensor/${industry}`
                        },
                        {
                            title: "IOT方案",
                            key: `/solution/${industry}`
                        }
                    ]}
                industries.push(ob);
            })
            this.setState({
                data,
                industries
            });
        })
    }

    handleClick1 = () => {
        document.getElementById("button1").style.backgroundColor = "#9cb3c5";
        document.getElementById("button1").style.color = "white";
        document.getElementById("button2").style.backgroundColor = "transparent";
        document.getElementById("button2").style.color = "#6A6AFF";
        this.setState({
            search: "model",
        })
    }

    handleClick2 = () => {
        document.getElementById("button2").style.backgroundColor = "#9cb3c5";
        document.getElementById("button2").style.color = "white";
        document.getElementById("button1").style.backgroundColor = "transparent";
        document.getElementById("button1").style.color = "#6A6AFF";
        this.setState({
            search: "company",
        })
    }

    handleSearch = (value) => {
        if (!value) {
            Modal.error({
                title: "提示",
                content: "请输入查询内容！"
            })
            this.setState({
                search_res: true,
            })
        } else {
            Axios.requestList("/search/precise", {
                search: this.state.search,
                value: value,
                product: this.state.product,
            }, true, "post").then((res) => {
                this.setState({
                    dataSource: res.list,
                    search_res: false,
                    exh_product: this.state.product,
                })
                if (!res.list) {
                    this.setState({
                        search_res: true,
                    })
                }
            })
        }
    }

    onChange1 = () => {
        this.setState({
            product: 1,
        })
    }
    onChange2 = () => {
        this.setState({
            product: 2,
        })
    }
    onChange3 = () => {
        this.setState({
            product: 3,
        })
    }
    getColumn = () => {
        const sensor = [
            {
                title: "品牌",
                dataIndex: "brand"
            },
            {
                title: "型号",
                dataIndex: "model"
            },
            {
                title: "传感器类型",
                dataIndex: "type",
                render: (text) => {
                    let type = this.state.type;
                    if (type[text - 1]) {
                        return type[text - 1].name;
                    }
                    return text;
                }
            }, {
                title: "等级",
                dataIndex: "level",
                render: (text) => {
                    let level = this.state.level;
                    if (level[text - 1]) {
                        return level[text - 1].name;
                    }
                    return text;
                }
            }, {
                title: "适用环境",
                dataIndex: "temperature",
                render: (text) => {
                    let temp = this.state.temperature;
                    if (temp[text - 1]) {
                        return temp[text - 1].low + " ~ " + temp[text - 1].high + "℃";
                    }
                    return text;
                }
            }, {
                title: "应用",
                width: "450px",
                dataIndex: "detail",
            }, {
                title: '操作',
                width: "80px",
                dataIndex: 'active',
                render: (text, record) =>
                    (
                        <span>
                            <Button type="link" onClick={this.handleDetail.bind(null, record.id)}>详情</Button>
                            <Button type="link" style={{color: "#f9c700"}}>删除</Button>
                        </span>
                    )

            }
        ];
        const gatherer = [
            {
                title: "品牌",
                dataIndex: "brand"
            },
            {
                title: "型号",
                dataIndex: "model"
            },
            {
                title: "类型",
                dataIndex: "type",
            },
            {
                title: "适用环境",
                dataIndex: "temperature",
                render: (text) => {
                    let temp = this.state.temperature;
                    if (temp[text - 1]) {
                        return temp[text - 1].low + " ~ " + temp[text - 1].high + "℃";
                    }
                    return text;
                }
            }, {
                title: "总线协议",
                dataIndex: "bus_protocol",
                width: "380px",
            }, {
                title: '操作',
                dataIndex: 'active',
                render: (text, record) =>
                    (
                        <span>
                            <Button type="link" onClick={this.handleDetail.bind(null, record.id)}>详情</Button>
                            <Divider type="vertical"/>
                            <Button type="link" style={{color: "#f9c700"}}>删除</Button>
                        </span>
                    )

            }
        ];
        const gateway = [
            {
                title: "品牌",
                dataIndex: "brand"
            },
            {
                title: "型号",
                dataIndex: "model"
            },
            {
                title: "等级",
                dataIndex: "level",
                render: (text) => {
                    let level = this.state.level;
                    if (level[text - 1]) {
                        return level[text - 1].name;
                    }
                    return text;
                }
            }, {
                title: "适用环境",
                dataIndex: "temperature",
                width: "160px",
                render: (text) => {
                    let temp = this.state.temperature;
                    if (temp[text - 1]) {
                        return temp[text - 1].low + " ~ " + temp[text - 1].high + "℃";
                    }
                    return text;
                }
            }, {
                title: "相关协议",
                width: "420px",
                dataIndex: "protocol",
            }, {
                title: '操作',
                dataIndex: 'active',
                render: (text, record) =>
                    (
                        <span>
                            <Button type="link" onClick={this.handleDetail.bind(null, record.id)}>详情</Button>
                            <Divider type="vertical"/>
                            <Button type="link" style={{color: "#f9c700"}}>删除</Button>
                        </span>
                    )

            }
        ];
        if (this.state.exh_product == 1) {
            return sensor;
        } else if (this.state.exh_product == 2) {
            return gatherer;
        } else {
            return gateway;
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="home">
                <Row className="home-search">
                    <div className="home-top">
                        <Button className="search-top" id="button1" size="small"
                                onClick={this.handleClick1}>产品型号</Button>
                        <Button className="search-top" id="button2" size="small"
                                onClick={this.handleClick2}>企业名称</Button>
                        <Form style={{width: 1200}}>
                            <FormItem>
                                {
                                    getFieldDecorator('userName', {
                                        initialValue: '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入搜索内容'
                                            },
                                            {
                                                max: 30,
                                                message: '输入字符长度不超过30'
                                            },
                                        ]
                                    })(
                                        <Search className="search-input" placeholder="请输入搜索内容"
                                                size="large"
                                                onSearch={value => this.handleSearch(value)} enterButton/>
                                    )
                                }
                            </FormItem>
                        </Form>
                        <div className="checkbox">
                            <Checkbox onChange={this.onChange1}
                                      checked={this.state.product == 1 ? true : false}>传感器</Checkbox>
                            <Checkbox onChange={this.onChange2}
                                      checked={this.state.product == 2 ? true : false}>数据采集器</Checkbox>
                            <Checkbox onChange={this.onChange3}
                                      checked={this.state.product == 3 ? true : false}>网关</Checkbox>
                        </div>
                    </div>
                </Row>
                <Row className="exhibition">
                    <Card title=">> 查询结果 <<" >
                        <Table
                            columns={this.getColumn()}
                            dataSource={this.state.dataSource}
                        />
                    </Card>
                </Row>
            </div>
        )
    }
}

SensorManage = Form.create()(SensorManage);
export default connect()(SensorManage);