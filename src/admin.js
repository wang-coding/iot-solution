import React from "react";
import {Col, Row} from "antd";
import NavTop from "./components/NavTop";
import './style/common.less'
import NavLeft from "./components/NavLeft";
import {Redirect} from 'react-router-dom'
import memoryUtils from './uitils/memoryUtils'


export default class Admin extends React.Component{


    render() {
        const user = memoryUtils.user;
        if (!user || !user.id) {
            return <Redirect to='/login'/>
        }
        return(
            <Row>
                <Row>
                    <NavTop/>
                </Row>
                <Row>
                    <Col >
                        <Row className="container">
                            {this.props.children}
                        </Row>
                    </Col>
                </Row>



            </Row>

        )
    }
}