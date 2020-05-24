import React from "react";
import './index.less';
import {Form, Input, Button, Select, Message} from 'antd'
import Axios from "../../axios";
import storageUtils from "../../uitils/storageUtils";
import memoryUtils from "../../uitils/memoryUtils";

const {Option} = Select;

class Register extends React.Component {

    state = {
        confirmDirty: false,
    };
    handleSubmit = e => {
        //阻止默认提交
        e.preventDefault();
        //点击时校验，对所有表单字段进行校验
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {username, password, email, phone, industry} = values;
                Axios.requestList("/user/add", {username, password, email, phone, industry},
                    true, "post").then((value) => {
                    storageUtils.removeUser();
                    memoryUtils.user = {};
                    window.location.href = '/#/login';
                    Message.success('注册成功！');
                    window.location.href = '/#/login';
                })
            }
        });
    }

    handleConfirmBlur = e => {
        const {value} = e.target;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };

    compareToFirstPassword = (rule, value, callback) => {
        const {form} = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('密码不相等！');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const {form} = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    };

    render() {
        const form = this.props.form;
        const {getFieldDecorator} = form;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 18},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 18,
                    offset: 4,
                },
            },
        };

        return (
            <div className="register">
                <header className="register-header">
                    <img src="/assets/logo-v1.png" alt="logo"/>
                    <h1>物联网解决方案专家</h1>
                </header>
                <section className="register-content">
                    <h2>用户注册</h2>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit} className="register-form">
                        <Form.Item label="用户名">
                            {
                                getFieldDecorator('username', {
                                    rules: [
                                        {required: true, whitespace: true, message: '用户名不能为空！'},
                                        {min: 4, message: '用户名必须大于等于4位！'},
                                        {max: 12, message: '用户名必须小于等于12位！'},
                                        {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成！'},
                                    ]
                                })(
                                    <Input/>
                                )
                            }
                        </Form.Item>
                        <Form.Item label="密码" hasFeedback>
                            {
                                getFieldDecorator('password', {
                                    rules: [
                                        {required: true, whitespace: true, message: '密码不能为空！'},
                                        {min: 4, message: '密码必须大于等于4位！'},
                                        {max: 12, message: '密码必须小于等于12位！'},
                                        {pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是英文、数字或下划线组成！'},
                                        {
                                            validator: this.validateToNextPassword,
                                        },
                                    ]
                                })(
                                    <Input.Password/>
                                )
                            }
                        </Form.Item>

                        <Form.Item label="确认密码" hasFeedback>
                            {getFieldDecorator('confirm', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请确认密码！',
                                    },
                                    {
                                        validator: this.compareToFirstPassword,
                                    },
                                ],
                            })(<Input.Password onBlur={this.handleConfirmBlur}/>)}
                        </Form.Item>
                        <Form.Item label="邮箱">
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: '邮箱格式不正确！',
                                    },
                                    {
                                        required: true,
                                        message: '请输入邮箱！',
                                    },
                                ],
                            })(<Input/>)}
                        </Form.Item>
                        <Form.Item label="手机号码">
                            {getFieldDecorator('phone', {
                                rules: [
                                    {required: true, message: '请输入手机号码！'},
                                    {len: 11, message: '请输入11位手机号码！'},
                                    {pattern: /^[0-9]+$/, message: '请输入正确的手机号码！'},
                                ],
                            })(<Input style={{width: '100%'}}/>)}
                        </Form.Item>
                        <Form.Item label="所属行业">
                            {
                                getFieldDecorator('industry', {
                                    rules: [
                                        {required: true, message: '请选择一个行业！'},
                                    ]
                                })(<Select>
                                    <Option value="工业">工业</Option>
                                    <Option value="农业">农业</Option>
                                    <Option value="医疗">医疗</Option>
                                    <Option value="教育">教育</Option>
                                    <Option value="交通">交通</Option>
                                </Select>)
                            }
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" className="register-form-button">
                                注册
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

const WrapRegister = Form.create()(Register)
export default WrapRegister