import React from "react";
import {Button, Card, Divider, Form, Modal, Rate, Row, Select, Table} from "antd";
import Axios from "../../axios";
import ETable from "../../components/ETable";
import BaseForm from "../../components/BaseForm"
import {exportInfo} from "../../redux/action"
import {connect} from "react-redux"

class Gateway extends React.Component {
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
            Axios.requestList("/gateway_param", {}, false, "post").then((value) => {
                this.setState({
                    temperature: value.result.temperature,
                    level: value.result.level,
                })
                resolve({
                    temperature: value.result.temperature,
                    level: value.result.level,
                })
            })
        }).then((value) => {
            const {dispatch} = this.props;      //使用connect后props中存在dispatch方法
            dispatch(exportInfo({
                level: value.level,
                temperature: value.temperature
            }, 'GATEWAY_PARAM'));
        })
    }

    getCollectorList = () => {
        Axios.requestList("/equipment/gateway", {page: 1}, true, "post").then((value) => {
            this.setState({
                dataSource: value.result.list,
                currentPage: value.result.currentPage,
                totalPages: value.result.total,
                pageSize: value.result.pageSize
            })
        })
        /*if (this.state.type.length < 1) {
            window.location.href = `/#/`;
        }*/
    }

    updateSelectedItem = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    }

    filterSubmit = (fieldsValue) => {
        let level = fieldsValue.level;
        let device_protocol = fieldsValue.device_protocol;
        let uploading_protocol = fieldsValue.uploading_protocol;
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
        if (level != '全部' || device_protocol != '如：RS485,RS232'
            || uploading_protocol != '如：Modbus TCP' || temp == true) {
            Axios.requestList("/search/gateway", {
                level: level,
                device_protocol: device_protocol,
                uploading_protocol: uploading_protocol,
                temperature: temp,
                temp_list: result
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
        window.location.href = `/#/equipment/detail/gateway/${link}`;
    }

    onChange = (page) => {
        Axios.requestList("/equipment/gateway", {page: page}, true, "post").then((value) => {
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
                title: "设备间协议",
                dataIndex: "device_protocol"
            }, {
                title: "设备上传协议",
                dataIndex: "uploading_protocol"
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
                label: "级别",
                initialValue: "全部",
                field: "level",
                width: 165,
                type: "SELECT",
                list: this.state.level
            }, {
                label: "设备间协议",
                initialValue: "如：RS485,RS232",
                field: "device_protocol",
                width: 165,
                type: "INPUT",
            }, {
                label: "设备上传协议",
                initialValue: "如：Modbus TCP",
                field: "uploading_protocol",
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

Gateway = Form.create()(Gateway);
export default connect()(Gateway);
