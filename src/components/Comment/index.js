import React from "react";
import {
    Button,
    Comment,
    Icon,
    List,
    Avatar,
    Tag,
    Select,
    Input,
    Radio
} from "antd";
import "./index.less"
import Axios from "../../axios";
import colors from "../../config/colors";
import Util from "../../uitils/Util"
import Industry from "../Industry"

const {Search} = Input;
const InputGroup = Input.Group;
const Option = Select.Option;
const IconText = ({type, text}) => (
    <span>
    <Icon type={type} style={{marginRight: 8}}/>
        {text}
  </span>
);
export default class MyComment extends React.Component {

    state = {
        industry: "all",
        initLoading: true,
        data: [],
        currentPage: 0,
        totalPages: 0,
        pageSize: 0,
        comment: [],
        unfold: 0,
        input: 1,       //判断搜索类型，1为该行业下相关产品评论
        search: false,  //判断搜索是否要分页
        defaultText: "请输入相关产品型号",
        product: 1,
    }

    componentDidMount() {
        this.getComment(1);
    }

    getComment = (page) => {
        Axios.requestList("/community/discussion", {
            page: page,
            industry: this.state.industry
        }, false, "post").then((value) => {
            this.setState({
                initLoading: false,
                data: value.list,
                currentPage: value.result.currentPage,
                totalPages: value.result.total,
                pageSize: value.result.pageSize
            });
        })
    }

    selectIndustry = (page, value) => {
        this.setState({
            search:false,
            initLoading: true,
        })
        if (value == "all") {
            window.location.reload();
        } else {
            Axios.requestList("/community/discussion", {page: page, industry: value}, false, "post").then((value) => {
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
    like = () => {

    }

    changePage = (page) => {
        this.setState({
            initLoading: true,
        })
        Axios.requestList("/community/discussion", {
            page: page,
            industry: this.state.industry
        }, false, "post").then((value) => {
            this.setState({
                initLoading: false,
                data: value.list,
                currentPage: value.result.currentPage,
                totalPages: value.result.total,
                pageSize: value.result.pageSize
            });
        })
    }

    changeInput = (value) => {
        if (value == 1) {
            this.setState({
                input: value,
                defaultText: "请输入相关产品型号"
            })
        } else {
            this.setState({
                input: value,
                defaultText: "请输入用户名"
            })
        }

    }

    unfoldComment = (value) => {
        let result = [];

        value.map((item) => {
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
                        <span style={{paddingLeft: 8, cursor: 'auto'}}>{item.endorse}</span>
                    ]
                }
                author={<a>{item.user_name}</a>}
                avatar={
                    <Avatar
                        src={item.icon}
                    />
                }
                content={
                    <p>
                        {item.content}
                    </p>
                }
                datetime={
                    <span>{date}</span>
                }
            />;
            result.push(it)
        })
        return result;
    }

    unfold = (value) => {
        this.setState({
            unfold: value
        })
    }

    handleSearch = (value) => {
        if (value == "") {
            window.location.reload();
        } else {
            if (this.state.input == 1) {
                Axios.requestList("/community/search", {
                    type: 1,
                    product: this.state.product,
                    model: value,
                    industry: this.state.industry
                }, false, "post").then((value) => {
                    this.setState({
                        data: value.list,
                        search: true,
                    });
                })
            } else {
                Axios.requestList("/community/search", {
                    type: 2,
                    name: value
                }, false, "post").then((value) => {
                    this.setState({
                        data: value.list,
                        search: true,
                    });
                })
            }

        }
    }

    changeType = (e) => {
        this.setState({
            product: e.target.value
        })
    }

    render() {
        let renderItem = (item, index) => {
            let solution = item.solution;
            let color = colors[Math.floor(Math.random() * 10)];
            let title = (solution.gatherer_model != '' && solution.gatherer_model != null) ?
                `方案：传感器${solution.sensor_model} >> 采集器${solution.gatherer_model} >> 网关${solution.gateway_model}` :
                `方案：传感器${solution.sensor_model} >> 网关${solution.gateway_model}`
            return (
                <List.Item
                    key={item.solution_id}
                    actions={[
                        <IconText type="message" text={item.comment.length} key="list-message"/>,
                    ]}
                    extra={
                        <Button type="link" onClick={this.unfold.bind(this, index + 1)}>展开评论<Icon type="down"/></Button>
                    }
                >
                    <List.Item.Meta
                        title={<div>
                            <div style={{display: "inline"}}>{index + 1}</div>
                            、
                            <Tag color={color} key={solution.industries}>
                                {solution.industries}
                            </Tag>
                            <Button type="link" size="large"
                                    style={{display: "inline", color: "#002140"}}> {title}</Button></div>}
                        description={<span>应用简介:{solution.detail}</span>}
                    />
                    {(index + 1) == this.state.unfold ? <div style={{margin: "10px -30px 10px 20px"}}>
                        {this.unfoldComment(item.comment)}
                    </div> : ''}
                </List.Item>
            )
        }
        return (
            <div>
                <InputGroup compact className="search">
                    <Select defaultValue="1" className="search-sel" onChange={this.changeInput}>
                        <Option value="1">本行业</Option>
                        <Option value="2">用户名</Option>
                    </Select>
                    <Search
                        className="search-sea"
                        placeholder={this.state.defaultText}
                        enterButton="Search"
                        onSearch={this.handleSearch}
                    />
                </InputGroup>
                <Radio.Group onChange={this.changeType} value={this.state.product} style={{margin: "0 18px"}}
                             disabled={this.state.input == 1 ? false : true}>
                    <Radio value={1}>传感器</Radio>
                    <Radio value={2}>采集器</Radio>
                    <Radio value={3}>网关</Radio>
                </Radio.Group>
                <Industry
                    renderItem={renderItem}
                    dataSource={this.state.data}
                    industryChange={this.selectIndustry}
                    changePage={this.changePage}
                    pagination={this.state.search?true:{
                        showQuickJumper:true,
                        defaultCurrent:1,
                        total:this.state.totalPages,
                        pageSize:this.state.pageSize,
                        current:this.state.currentPage,
                        onChange:this.changePage
                    }}
                    loading={this.state.initLoading}
                    title="讨论区"
                />
            </div>
        )
    }
}