import React from "react";
import './index.less';
import {Form, Icon, Input, Button, Message} from 'antd'
import memoryUtils from '../../uitils/memoryUtils'
import storageUtils from '../../uitils/storageUtils'
import {Redirect} from 'react-router-dom'
import Axios from "../../axios";

class Login extends React.Component {

    handleSubmit = e => {
        //阻止默认提交
        e.preventDefault();
        //点击时校验，对所有表单字段进行校验
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                //alert("校验成功");
                //请求登录
                const {username, password} = values;
                Axios.requestList("/login", {username, password}, true, "post").then((value) => {
                    const user = value.result;
                    memoryUtils.user = user;// 保存在内存中
                    storageUtils.saveUser(user);// 保存到local中
                    Message.success('登录成功！');
                    window.location.href = '/#/';
                })
            } else {
                alert("校验失败");
            }
        });
    }

    handleRegister = () => {
        window.location.href = '/#/register';
    }
    handleTourist = () => {
        //游客id为-1
        const user = {id: -1};
        memoryUtils.user = user;
        storageUtils.saveUser(user);
        window.location.href = '/#/';
    }

    render() {

        const user = memoryUtils.user;
        if (user && user.id > 0) {
            return <Redirect to='/'/>
        }

        const form = this.props.form;
        const {getFieldDecorator} = form;

        return (
            <div className="login">
                <header className="login-header">
                    <img src="/assets/logo-v1.png" alt="logo"/>
                    <h1>物联网解决方案专家</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {
                                getFieldDecorator('username', {
                                    rules: [
                                        {required: true, whitespace: true, message: '用户名不能为空！'},
                                        {min: 4, message: '用户名必须大于等于4位！'},
                                        {max: 12, message: '用户名必须小于等于12位！'},
                                        {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成！'},
                                    ]
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        placeholder="用户名"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password', {
                                    rules: [
                                        {required: true, whitespace: true, message: '密码不能为空！'},
                                        {min: 4, message: '密码必须大于等于4位！'},
                                        {max: 12, message: '密码必须小于等于12位！'},
                                        {pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是英文、数字或下划线组成！'},
                                    ]
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        type="password"
                                        placeholder="密码"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                            <div style={{marginTop: 15}}>没有账号？点击<a onClick={this.handleRegister}>注册</a>
                                ，只想看看？<a onClick={this.handleTourist}>游客登录</a></div>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

const WrapLogin = Form.create()(Login)
export default WrapLogin