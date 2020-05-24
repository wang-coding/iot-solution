import React from "react";
import {Button, Divider, Form, Rate, Table, Tag} from "antd";
import colors from "../../config/colors";
import {connect} from "react-redux";
import Axios from "../../axios";
import {exportInfo} from "../../redux/action";

class SolutionTable extends React.Component {

    state = {
        sensor: {},
        gatherer: {},
        gateway: {},
        expandedRowKeys: []
    }

    constructor(props) {
        super(props);
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


    getData = (expanded, record) => {
        if (this.state.expandedRowKeys[0] == record.key) {
            this.setState({
                expandedRowKeys: [],
            })
        } else {
            this.setState({
                expandedRowKeys: [record.key],
            })
            if (record.sensor_id) {
                Axios.requestList("/detail/sensor", {id: record.sensor_id}, true, "post").then((value) => {
                        this.setState({
                            sensor: value.list[0],
                        })
                    }
                )
            }
            if (record.gatherer_id) {
                Axios.requestList("/detail/gatherer", {id: record.gatherer_id}, true, "post").then((value) => {
                        this.setState({
                            gatherer: value.list[0],
                        })
                    }
                )
            }
            if (record.gateway_id) {
                Axios.requestList("/detail/gateway", {id: record.gateway_id}, true, "post").then((value) => {
                        this.setState({
                            gateway: value.list[0],
                        })
                    }
                )
            }
        }
    }

    expandTable = () => {
        const columns = [
            {
                title: '产品',
                dataIndex: 'product',
            },
            {
                title: '品牌',
                dataIndex: 'brand',
            },
            {
                title: '级别',
                dataIndex: 'level',
                render: (text) => {
                    let level = this.props.level;
                    if (level[text - 1]) {
                        return level[text - 1].name;
                    }
                    return text;
                }
            },
            {
                title: '适用环境',
                dataIndex: 'temperature',
                render: (text) => {
                    let temp = this.props.temperature;
                    if (temp[text - 1]) {
                        return temp[text - 1].low + " ~ " + temp[text - 1].high + "℃";
                    }
                    return text;
                }
            },
            {
                title: '说明(总线协议)',
                dataIndex: 'desc',
                width: "200px",
                ellipsis: true,
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <Button type="link" style={{color:"#f9c700"}}>详情</Button>
                ),
            },
        ];
        let dataSource = [];
        let sensor = this.state.sensor;
        let gatherer = this.state.gatherer;
        let gateway = this.state.gateway;
        if (Object.keys(this.state.sensor).length > 0) {
            let sen = {
                product: "传感器",
                brand: sensor.brand,
                level: sensor.level,
                temperature: sensor.temperature,
                desc: sensor.detail,
            }
            dataSource.push(sen);
        }
        if (Object.keys(this.state.gatherer).length > 0) {
            let sen = {
                product: "数据采集器",
                brand: gatherer.brand,
                level: "——",
                temperature: gatherer.temperature,
                desc: gatherer.bus_protocol,
            }
            dataSource.push(sen);
        }
        if (Object.keys(this.state.gateway).length > 0) {
            let sen = {
                product: "网关",
                brand: gateway.brand,
                level: gateway.level,
                temperature: gateway.temperature,
                desc: gateway.desc,
            }
            dataSource.push(sen);
        }
        return <Table
                style={{margin:"2px 0"}}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                size="small"
            />

    }

    renderColumn=(type)=>{
        const columns = [
            {
                title: '传感器',
                dataIndex: 'sensor_model',
            },
            {
                title: '传感器类型',
                dataIndex: 'sensor_type',
                render: tags => {
                    let color = colors[Math.floor(Math.random() * 10)];
                    return <Tag color={color} key={tags}>
                        {this.props.type.length>0?this.props.type[tags - 1].name:''}
                    </Tag>
                },
            },
            {
                title: '采集器',
                dataIndex: 'gatherer_model',
            },
            {
                title: '采集器类型',
                dataIndex: 'gatherer_type',
            },
            {
                title: '网关',
                dataIndex: 'gateway_model',
            },
            {
                title: '主要应用',
                dataIndex: 'detail',
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
                    <Button type="link">收藏</Button>
                ),
            },
        ];
        const noBookmarks = [
            {
                title: '传感器',
                dataIndex: 'sensor_model',
            },
            {
                title: '传感器类型',
                dataIndex: 'sensor_type',
                render: tags => {
                    let color = colors[Math.floor(Math.random() * 10)];
                    return <Tag color={color} key={tags}>
                        {this.props.type.length>0?this.props.type[tags - 1].name:''}
                    </Tag>
                },
            },
            {
                title: '采集器',
                dataIndex: 'gatherer_model',
            },
            {
                title: '采集器类型',
                dataIndex: 'gatherer_type',
            },
            {
                title: '网关',
                dataIndex: 'gateway_model',
            },
            {
                title: '主要应用',
                dataIndex: 'detail',
                width:300
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
                    <Button type="link">取消收藏</Button>
                ),
            },
        ];
        const simpleColumns = [
            {
                title: '采集器',
                dataIndex: 'gatherer_model',
            },
            {
                title: '采集器类型',
                dataIndex: 'gatherer_type',
            },
            {
                title: '网关',
                dataIndex: 'gateway_model',
            },
            {
                title: '应用行业',
                dataIndex: 'industry',
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
                    <Button type="link">收藏</Button>
                ),
            },
        ];
        const noScore = [
            {
                title: '传感器',
                dataIndex: 'sensor_model',
            },
            {
                title: '传感器类型',
                dataIndex: 'sensor_type',
                render: tags => {
                    let color = colors[Math.floor(Math.random() * 10)];
                    return <Tag color={color} key={tags}>
                        {this.props.type.length>0?this.props.type[tags - 1].name:''}
                    </Tag>
                },
            },
            {
                title: '采集器',
                dataIndex: 'gatherer_model',
            },
            {
                title: '采集器类型',
                dataIndex: 'gatherer_type',
            },
            {
                title: '网关',
                dataIndex: 'gateway_model',
            },
            {
                title: '主要应用',
                dataIndex: 'detail',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <Button type="link">收藏</Button>
                ),
            },
        ];
        if(type ===false){
            return columns;
        }else if (type === true){
            return simpleColumns;
        }else if(type == "noScore"){
            return noScore;
        }else if(type == "noBook"){
            return noBookmarks;
        }
    }

    render() {

        return (
            <div>
                <Table
                    columns={this.renderColumn(this.props.simple)}
                    dataSource={this.props.dataSource}
                    expandedRowRender={this.props.expandedRow == "table" ? this.expandTable : ''}
                    expandRowByClick={this.props.expandClick}
                    onExpand={this.getData}
                    pagination={this.props.pagination ? this.props.pagination : false}
                    expandedRowKeys={this.props.expandClick ? this.state.expandedRowKeys : []}
                />
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
export default connect(mapStateToProps)(SolutionTable);
