import React from "react";
import {
    Button,
    Card,
    Col,
    Comment,
    PageHeader,
    Table,
    Icon,
    Divider,
    Skeleton,
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
        industries: [],
    }

    componentDidMount() {
        this.getIndustries();
    }

    getIndustries = () => {
        Axios.requestList("/param/industries", {}, false, "post").then((value) => {
            this.setState({
                industries: value.list,
            })
        })
    }

    extendChildren = () => {
        let industries = this.state.industries.map((value) => {
            return <Col span="3"><Button type="link" onClick={this.selectIndustry.bind(this,1,value.value)} style={{margin: "7px 5px"}}
                                         size="small">{value.name}</Button></Col>
        })
        return <div className="industries-list">
            <Card title="行业分类">
                <Col span="3">
                    <Button type="link" onClick={this.selectIndustry.bind(this,1,"all")} style={{margin: "7px 5px"}}
                            size="small">全部</Button>
                </Col>
                {industries}
            </Card>
        </div>
    }

    selectIndustry = (page,value) => {
        this.props.industryChange(page,value);
    }

    changePage=(page)=>{
        this.props.changePage(page);
    }

    render() {
        return (
            <div>
                {this.extendChildren()}
                <PageHeader
                    style={{
                        border: '1px solid rgb(235, 237, 240)',
                        margin: '5px 15px 20px'
                    }}
                    title={this.props.title}
                    extra={this.props.extra}

                >
                    <List
                        itemLayout="vertical"
                        size="large"
                        pagination={this.props.pagination}
                        loading={this.props.loading}
                        dataSource={this.props.dataSource}
                        renderItem={this.props.renderItem}
                    />
                </PageHeader>
            </div>
        )
    }
}