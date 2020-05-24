import React from "react";
import {Button, Card, Divider, Form, Modal, Rate, Row, Select, Table} from "antd";
import Axios from "../../axios";
import ETable from "../../components/ETable";
import BaseForm from "../../components/BaseForm"
import {exportInfo} from "../../redux/action"
import {connect} from "react-redux"

class Collector extends React.Component {

    constructor(props) {
        super(props);

    }

    state = {
        columns: [],
        dataSource: [],
        selectedRowKeys: [],
        selectedItem: [],
        pagination: true,
    }

    componentWillMount() {
        this.getParam();
        this.getCollectorList();
    }

    getParam = () => {
        new Promise((resolve, reject) => {
            Axios.requestList("/gatherer_param", {}, false, "post").then((value) => {
                this.setState({
                    temperature: value.result.temperature,
                    //type: value.result.type,
                })
                resolve({
                    temperature: value.result.temperature,
                    //type: value.result.type,
                })
            })
        }).then((value) => {
            const {dispatch} = this.props;      //使用connect后props中存在dispatch方法
            dispatch(exportInfo({
                //type: value.type,
                temperature: value.temperature
            }, 'GATHERER_PARAM'));
        })
    }

    getCollectorList = () => {
        Axios.requestList("/equipment/collector", {page: 1}, true, "post").then((value) => {
            this.setState({
                dataSource: value.result.list,
                currentPage: value.result.currentPage,
                totalPages: value.result.total,
                pageSize: value.result.pageSize
            })
        })
    }

    updateSelectedItem = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    }

    filterSubmit = (fieldsValue) => {
        let type = fieldsValue.type;
        let input = fieldsValue.input;
        let output = fieldsValue.output;
        let bus_protocol = fieldsValue.bus_protocol;
        let others = fieldsValue.others;
        let temp = fieldsValue.temperature;
        let low = fieldsValue.low;
        let high = fieldsValue.high;
        let tempList = this.state.temperature;
        let result = [];
        if (tempList.length > 0 && temp) {
            tempList.map((item, index) => {
                if (item.low <= low && item.high >= high) {
                    result.push(index + 1);
                }
            })
        }
        if (type != '全部' || input != '如：模拟信号，电压0-10V' || output != '如：模拟信号，电压0-10V'
            || bus_protocol != '如：USB' || others != '请输入数据采集器特点' || temp == true) {
            Axios.requestList("/search/gatherer", {
                type: type,
                input: input,
                output: output,
                bus_protocol: bus_protocol,
                temperature: temp,
                temp_list: result,
                others: others
            }, true, "post").then((value) => {
                if (value.list.length > 0) {
                    this.setState({
                        dataSource: value.list,
                        pagination: false
                    });
                    if (value.result.message != '') {
                        Modal.info({
                            title: "提示",
                            content: value.result.message
                        })
                    }

                } else {
                    Modal.info({
                        title: "提示",
                        content: value.result.message
                    })

                }
            })
        }
    }

    handleDetail = (link) => {
        window.location.href = `/#/equipment/detail/gatherer/${link}`;
    }

    onChange = (page) => {
        Axios.requestList("/equipment/collector", {page: page}, true, "post").then((value) => {
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
                dataIndex: "type"
            }, {
                title: "适用环境",
                dataIndex: "temperature",
                render: (text) => {
                    let temp = this.state.temperature;
                    //alert(temp);
                    if (temp[text - 1]) {
                        return temp[text - 1].low + " ~ " + temp[text - 1].high + "℃";
                    }
                    return text;
                }
            }, {
                title: "总线（无线）类型",
                dataIndex: "bus_protocol",
            }, {
                title: "输入",
                dataIndex: "input",
            }, {
                title: "输出",
                dataIndex: "output"
            }, {
                title: "描述",
                dataIndex: "desc"
            }, {
                title: '操作',
                width: 160,
                render: (text, record) =>
                    (
                        <span>
                            <Button type="link" onClick={this.handleDetail.bind(null, record.id)}>详情</Button>
                            <Divider type="vertical"/>
                            <Button type="link">收藏</Button>
                        </span>
                    )
            }
        ]
        const formList = [
            {
                label: "类型",
                initialValue: "全部",
                field: "type",
                width: 100,
                type: "SELECT",
                list: [{
                    "value": 1,
                    "name": "通用型",
                }, {
                    "value": 2,
                    "name": "温度",
                }, {
                    "value": 3,
                    "name": "加速度",
                }, {
                    "value": 4,
                    "name": "开关量",
                }, {
                    "value": 5,
                    "name": "能耗",
                }, {
                    "value": 6,
                    "name": "温度/湿度",
                }]
            }, {
                label: "输入",
                initialValue: "如：模拟信号，电压0-10V",
                field: "input",
                width: 165,
                type: "INPUT"
            }, {
                label: "输出",
                initialValue: "如：模拟信号，电压0-10V",
                field: "output",
                width: 165,
                type: "INPUT"
            }, {
                label: "总线（无线）类型",
                initialValue: "如：USB",
                field: "bus_protocol",
                width: 165,
                type: "INPUT",
            }, {
                label: "应用关键字",
                initialValue: "请输入数据采集器特点",
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
                    type: "primary"
                },
            }, {
                label: "重置",
                field: "reset",
                type: "BUTTON",
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


Collector = Form.create()(Collector);
export default connect()(Collector);
