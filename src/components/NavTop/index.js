import React from "react";
import {Col, Menu, Row, Button, Icon, Badge, Modal} from "antd";
import "./index.less";
import storageUtils from "./../../uitils/storageUtils"
import memoryUtils from "./../../uitils/memoryUtils"
import MenuConfig from "./../../config/menuConfig"
import {NavLink} from "react-router-dom";
const {confirm} = Modal;
const { SubMenu } = Menu;
export default class NavTop extends React.Component{
    state={
        currentKey:'',
        list:[]
    }
    componentWillMount() {
        this.getMenu();

    }

    handleClick=({item,key})=>{
        //const {dispatch} = this.props;      //使用connect后props中存在dispatch方法
        //dispatch(switchMenu(item.props.title,'SWITCH_MENU'));  //将所需要的值发送给Reducer存储起来
        this.setState({
            currentKey:key
        })
    }

    getMenu=()=>{
            const menuTreeNode = this.renderMenu(MenuConfig);
            let currentKey = window.location.hash.replace(/#|\?.*$/g,'');
            this.setState({
                menuTreeNode,
                currentKey
            })

    }

    handleLogin=()=>{
        window.location.href='/#/login'
    }

    handleRegister=()=>{
        window.location.href='/#/register'
    }
    handleLogOut = () => {
        confirm({
            title: '确定要删除用户数据并退出登录吗？',
            //content: 'Some descriptions',
            onOk: () => {
                storageUtils.removeUser();
                memoryUtils.user = {};
                window.location.href = '/#/login';
            },
            onCancel: () => {

            },
        });
    };

    //菜单渲染
    renderMenu=(data)=>{
        return data.map((item)=>{
            if(item.children){
                return <SubMenu title={item.title} key={item.key}>
                    {this.renderMenu(item.children)}
                </SubMenu>

            }
            return <Menu.Item title={item.title} key={item.key}>
                <NavLink to={item.key}>{item.title}</NavLink>
            </Menu.Item>
        })
    }

    openBookmarks=()=>{
        window.open("/#/bookmarks");
    }

    render() {
        return(
            <div className="navTop">
                <Row>
                    <Col span="4">
                        <img src="/assets/logo-v1.png" alt=""/>
                    </Col>
                    <Col span="12">
                        <Menu theme="light"
                              selectedKeys={this.state.currentKey}
                              onClick={this.handleClick}
                              mode="horizontal"
                        >
                            {this.state.menuTreeNode}
                        </Menu>
                    </Col>
                    <Col span="8" className="individual">
                        <Button  type="link" ghost icon="book" style={{marginRight:"10px"}} onClick={this.openBookmarks}>
                            收藏夹
                        </Button>
                        <Icon className="icon" type="user" />
                        <Button  type="link" onClick={this.handleLogin} ghost >
                            登录
                        </Button>
                        <span style={{fontSize:"20px", margin:"0 -10px"}}>/</span>
                        <Button  type="link" onClick={this.handleRegister} ghost >
                            注册
                        </Button>
                        <Button  type="link" onClick={this.handleLogOut} ghost >
                            退出登录
                        </Button>
                    </Col>
                </Row>

            </div>
        )

    }
}