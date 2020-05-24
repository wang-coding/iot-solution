import React from "react";
import {Col, Modal, Row, Table} from "antd";
import RightCommunity from "../../components/RightCommunity";
import Comment from "../../components/Comment"
import "./index.less"
import axios from "axios";

export default class Discussion extends React.Component {
    state={
        dataSource:[]
    }
    componentDidMount() {
        this.initData();
    }
    initData=()=>{
        axios({
                url:"/sensor/alllist",
                method:'get',
                baseURL:"http://175.24.16.234:8080",
                timeout:5000,
                param:''
            }).then((response)=>{
            if(response.status == '200'){
                let res =response.data;
                let dataSource = [];
                res.map((item,index)=>{
                    let temp = item.sensorKey;
                    delete item.sensorKey;
                    item['brand']= temp.brand;
                    item['idNumber']=temp.idNumber;
                    item['key'] = index;
                    dataSource.push(item);
                })
                this.setState({
                    dataSource
                })
            }else {
                Modal.info({
                    title:"提示",
                    content:"获取出错"
                })
            }
        })
    }
    render() {
        let columns =[{
            title: '传感器品牌',
            dataIndex: 'brand',
        },{
            title: '传感器id',
            dataIndex: 'idNumber',
        },{
            title: '传感器类型',
            dataIndex: 'funType',
        },{
            title: '详细',
            dataIndex: 'speType',
        },{
            title: '输入电源',
            dataIndex: 'input',
        },
        ]
        return (
            <div>
                {/*<Row gutter={16}>
                    <Col span="18" className="left">
                        <Comment/>
                    </Col>
                    <RightCommunity/>
                </Row>*/}
                <Table
                    columns={columns}
                    dataSource={this.state.dataSource}
                />
            </div>
        )
    }
}