import React from "react";
import {Input, Select, Form, Button, Checkbox, DatePicker,InputNumber,Cascader} from "antd";
import Util from "../../uitils/Util";
const  FormItem = Form.Item;

/**
 * @param formList [{label,initialValue,placeholder,unit,field,colon,width,type,param,list}]
 * @param filterSubmit(fieldsValue) 获取表单值
 */
class FilterForm extends React.Component{

    state = {
        boxValue:false
    }

    handelFilterSubmit=()=>{
        let fieldsValue = this.props.form.getFieldsValue()
        this.props.filterSubmit(fieldsValue);
    }

    reset = ()=>{
        this.setState({
            boxValue:false
        })
        this.props.form.resetFields();
    }

    extend=()=>{
        let extension = this.props.extension;
        return this.judgeFormFormat(extension);
    }

    checkBoxChange=()=>{
        let checked = this.state.boxValue;
        if(checked){
            this.setState({
                boxValue:false
            })
        }else {
            this.setState({
                boxValue:true
            })
        }
    }

    judgeFormFormat=(formList)=>{
        const {getFieldDecorator}=this.props.form;
        const formItemList = [];
        if (formList && formList.length>0){
            formList.forEach((item,i)=>{
                let label = item.label;
                let initialValue = item.initialValue || '';
                let placeholder = item.placeholder || '';
                let unit = item.unit || '';
                let field = item.field;
                let colon = true;
                if(item.colon == false){
                    colon =false;
                }
                let help = item.help||'';
                let width = item.width || '';
                if(item.type == 'BUTTON'){
                    let onclick = this.handelFilterSubmit.bind(this);
                    if(field == "reset"){
                        onclick = this.reset.bind(this);
                    }
                    const button = <FormItem key={field}>
                        {
                            getFieldDecorator([field],{
                            })(
                                <Button {...item.param} onClick={onclick}>{label}</Button>
                            )
                        }
                    </FormItem>;
                    formItemList.push(button);

                }else if(item.type == 'INPUT'){
                    const INPUT = <FormItem label={label} key={field} style={{marginBottom:"12px"}} help={help}>
                        {
                            getFieldDecorator([field],{
                                initialValue:initialValue,

                            })(
                                <Input
                                    type="text"
                                />
                            )
                        }
                    </FormItem>;
                    formItemList.push(INPUT);
                }else if(item.type == 'SELECT'){
                    const SELECT = <FormItem label={label} key={field} style={{marginBottom:"12px"}}>
                        {
                            getFieldDecorator([field],{
                                initialValue:initialValue
                            })(
                                <Select
                                    style={{width: width}}

                                >
                                    {
                                        Util.getOptionList(item.list)
                                    }
                                </Select>
                            )
                        }
                    </FormItem>;
                    formItemList.push(SELECT);
                }else if(item.type == 'NUMBER'){
                    const NUMBER = <FormItem label={label} key={field} colon={colon} style={{marginTop:"15px"}}>
                        {
                            getFieldDecorator([field],{
                                initialValue:initialValue
                            })(
                                <InputNumber
                                    formatter={value => {return value + unit}}
                                    parser={value => value.replace(unit, '')}

                                />
                            )
                        }
                    </FormItem>;
                    formItemList.push(NUMBER);
                }else if(item.type == 'CHECKBOX'){
                    const CHECKBOX = <FormItem key={field}>
                        {
                            getFieldDecorator([field],{
                                valuePropName:'checked',
                            })(
                                <Checkbox checked={this.state.boxValue} onChange={this.checkBoxChange.bind(this)}>
                                    {label}
                                </Checkbox>
                            )
                        }
                    </FormItem>;
                    formItemList.push(CHECKBOX);
                }else if(item.type == 'DATE'){
                    const DATEPICKER = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field])(
                                <DatePicker showTime={true} format="YYYY-MM-DD HH：mm：ss" placeholder={placeholder}/>
                            )
                        }
                    </FormItem>;
                    formItemList.push(DATEPICKER);
                }else if(item.type == 'CAS'){
                    const cas = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field],{
                                initialValue:initialValue
                            })(
                                <Cascader
                                    defaultValue={initialValue}
                                    options={item.list}
                                />
                            )
                        }
                    </FormItem>;
                    formItemList.push(cas);
                }

            })
        }
        return formItemList;
    }

    initFormList=()=>{
        const formList = this.props.formList;
        return this.judgeFormFormat(formList);
    }

    render() {
        const {getFieldDecorator}=this.props.form;
        const layout = this.props.layout==true?{
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        }:{layout:"inline"};
        return(
            <Form
                {...layout}
            >
                {this.initFormList()}
                {this.state.boxValue?<br/>:""}
                {this.state.boxValue?this.extend():""}
            </Form>
        )
    }
}
export  default Form.create({})(FilterForm);