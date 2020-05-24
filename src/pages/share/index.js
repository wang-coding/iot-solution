import React from "react";
import {Button, Col, Icon, Input, List, Row, Tag, Comment, Avatar, Alert} from "antd";
import "./index.less"
import RightCommunity from "../../components/RightCommunity";
import Industry from "../../components/Industry"
import Axios from "../../axios";
import colors from "../../config/colors";
import Util from "../../uitils/Util";
import Desc from "../../components/Desc";

const {Search} = Input;
const IconText = ({type, text}) => (
    <span>
    <Icon type={type} style={{marginRight: 8}}/>
        {text}
  </span>
);
export default class Share extends React.Component {

    state = {
        data: [],
        currentPage: 0,
        totalPages: 0,
        pageSize: 0,
        industry: "all",
        search: false,
        unfold: 0,
        initLoading: true,
    }

    componentDidMount() {
        this.initQuestion();
    }

    initQuestion = (page, industry) => {
        Axios.requestList("/community/share", {page: page, industry: industry}, false, "post").then((value) => {
            this.setState({
                initLoading: false,
                data: value.list,
                industry: value,
                currentPage: value.result.currentPage,
                totalPages: value.result.total,
                pageSize: value.result.pageSize
            });
        })
    }

    handleSearch = (value) => {
        if (value == "") {
            window.location.reload();
        } else {
            Axios.requestList("/community/question", {title: value}, false, "post").then((value) => {
                this.setState({
                    data: value.list,
                    search: true,
                });
            })
        }
    }

    selectIndustry = (page, value) => {
        this.setState({
            initLoading: true,
            search: false
        })
        if (value == "all") {
            window.location.reload();
        } else {
            Axios.requestList("/community/question", {page: page, industry: value}, false, "post").then((value) => {
                this.setState({
                    initLoading: false,
                    data: value.list,
                    industry: value,
                    currentPage: value.result.currentPage,
                    totalPages: value.result.total,
                    pageSize: value.result.pageSize
                });
            })
        }

    }

    unfold = (value) => {
        this.setState({
            unfold: value
        })
    }

    question = () => {

    }

    like = () => {

    }

    unfoldAnswer = (value) => {
        let result = [];

        value.map((item) => {
            let descList = [
                {label: "传感器品牌", content: item.sensor_brand, span: 1},
                {label: "传感器型号", content: item.sensor_model, span: 2},
                {label: "采集器品牌", content: item.gatherer_brand, span: 1},
                {label: "采集器型号", content: item.gatherer_model, span: 2},
                {label: "网关品牌", content: item.gateway_brand, span: 1},
                {label: "网关型号", content: item.gateway_model, span: 2},
                {label: "说明", content: item.instruction, span: 3}
            ];
            let date = Util.formateDate(item.time);
            let it = <Comment
                actions={

                    [
                        <span key="comment-basic-like">
                              <Icon
                                  type="like"
                                  onClick={this.like}
                              />
                        </span>,
                        <span style={{paddingLeft: 8, cursor: 'auto'}}>{item.endorse}</span>,
                        item.accept ? <div><Icon type="check-circle" theme="twoTone" style={{margin: "0 10px 0 20px"}}/>已采纳
                        </div> : ""
                    ]
                }
                author={<a>{item.user_name}</a>}
                avatar={
                    <Avatar
                        src={item.icon}
                    />
                }
                content={
                    <Desc
                        descList={descList}
                    />
                }
                datetime={
                    <span>{date}</span>
                }
            />;
            result.push(it)
        })
        return result;
    }

    render() {
        let renderItem = (item, index) => {
            let question = item.question;
            let color = colors[Math.floor(Math.random() * 10)];
            return (
                <List.Item
                    key={question.id}
                    actions={[
                        <span>提问于{Util.formateDate(question.time)}</span>,
                        <IconText type="message" text={item.answer.length} key="list-message"/>,
                    ]}
                    extra={
                        <Button type="link" onClick={this.unfold.bind(this, index + 1)}>展开回答<Icon type="down"/>
                        </Button>
                    }
                >
                    <List.Item.Meta
                        title={<div>
                            <div style={{display: "inline"}}>{index + 1}</div>
                            、
                            <Tag color={color} key={question.industry}>
                                {question.industry}
                            </Tag>
                            <Button type="link" size="large"
                                    style={{display: "inline", color: "#002140"}}> {question.title}</Button></div>}
                        description={<span>问题:{question.question}</span>}
                    />
                    {(index + 1) == this.state.unfold ? <div style={{margin: "10px -30px 10px 20px"}}>
                        {this.unfoldAnswer(item.answer)}
                    </div> : ''}
                </List.Item>
            )
        }
        return (
            <div>
                <Row gutter={16}>
                    <Col span="18" className="share-left">
                        <Search
                            className="search"
                            placeholder="请输入你的问题"
                            enterButton="Search"
                            size="large"
                            onSearch={this.handleSearch}
                        />
                        <Industry
                            title="你问我答"
                            dataSource={this.state.data}
                            renderItem={renderItem}
                            industryChange={this.selectIndustry}
                            extra={[
                                <Button type="primary" onClick={this.question}>提问</Button>,
                            ]}
                            changePage={this.changePage}
                            pagination={this.state.search ? true : {
                                showQuickJumper: true,
                                defaultCurrent: 1,
                                total: this.state.totalPages,
                                pageSize: this.state.pageSize,
                                current: this.state.currentPage,
                                onChange: this.changePage
                            }}
                            loading={this.state.initLoading}
                        />
                    </Col>
                    <RightCommunity/>
                </Row>

            </div>
        )
    }
}