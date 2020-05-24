import React from "react";
import {Col, Modal, Row, Table} from "antd";
import RightCommunity from "../../components/RightCommunity";
import Comment from "../../components/Comment"
import "./index.less"


export default class Discussion extends React.Component {

    render() {
        return (
            <div>
                <Row gutter={16}>
                    <Col span="18" className="left">
                        <Comment/>
                    </Col>
                    <RightCommunity/>
                </Row>
            </div>
        )
    }
}