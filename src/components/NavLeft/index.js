import React from "react";
import {Menu, BackTop} from "antd";
import {NavLink} from "react-router-dom";
import Axios from "../../axios";
import "./index.less";

const {SubMenu} = Menu;
export default class NavLeft extends React.Component {

    state = {
        rootSubmenuKeys: [],
        openKeys: [],
    };

    componentDidMount() {
        let currentKey = window.location.hash.replace(/#|\?.*$/g, '');
        this.setState({
            currentKey
        })

    }

    componentWillReceiveProps(nextProps) {
        let industries = this.renderIndustries(nextProps.industries);
        let rootSubmenuKeys = this.getRootSubmenuKeys(nextProps.industries);
        this.setState({
            industries,
            rootSubmenuKeys
        })
    }


    handleClick = ({item, key}) => {
        //const {dispatch} = this.props;      //使用connect后props中存在dispatch方法
        //dispatch(switchMenu(item.props.title,'SWITCH_MENU'));  //将所需要的值发送给Reducer存储起来
        this.setState({
            currentKey: key
        })
    }

    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({openKeys});
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };

    renderIndustries = (data) => {

        return data.map((item) => {

            if (item.children) {
                return <SubMenu title={item.title} key={item.key}>
                    {this.renderIndustries(item.children)}
                </SubMenu>
            }
            return <Menu.Item title={item.title} key={item.key}>
                <NavLink to={item.key}>{item.title}</NavLink>
            </Menu.Item>
        })
    }

    getRootSubmenuKeys=(data)=> {
        let rootSubmenuKeys = [];
        data.map((item) => {
            rootSubmenuKeys.push(""+item.key);
        })
        return rootSubmenuKeys;
    }

    render() {
        return (
            <div className="navLeft">
                <Menu
                    mode="inline"
                    theme="light"
                    selectedKeys={this.state.currentKey}
                    openKeys={this.state.openKeys}
                    onOpenChange={this.onOpenChange}
                    onClick={this.handleClick}
                    style={{width: 120}}
                >
                    {this.state.industries}
                    <Menu.Item title="反馈" key="feedback">
                        <NavLink to="/feedback">反馈</NavLink>
                    </Menu.Item>
                </Menu>
                <BackTop />
            </div>
        )
    }


}