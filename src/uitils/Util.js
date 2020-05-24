import {Select} from "antd";
import React from "react";

const Option = Select.Option;

export default {
    formateDate(time) {
        if (!time) return '';
        let date =  new Date().getTime() - time;
        let days = parseInt(date/(1000*60*60*24));
        let hours = parseInt(date/(1000*60*60));
        let minutes = parseInt(date/(1000*60));
        let formateDate = new Date(parseInt(time));
        let terminal = formateDate.getFullYear() + "." +formateDate.getMonth() + "." + formateDate.getDay() + "  " +
            formateDate.getHours() +":" +formateDate.getMinutes() + ":" + formateDate.getSeconds() ;
        let result = '';
        if(days>30){
            result=terminal;
        }else if(days > 0){
            result = `${days}天前`;
        }else if(hours>0){
            result = `${hours}小时前`;
        }else if (minutes>0){
            result = `${minutes}分钟前`;
        }else {
            result = "刚刚"
        }
        return result;
    },

    pagination(pages, callback) {
        let page = {
            onChange: (current) => {
                callback(current)
            },
            current: pages.currentPage,
            pageSize: pages.data.result.pageSize,
            total: pages.data.result.total,
            showTotal: () => {
                return `共${pages.data.result.total}条`
            },
            showQuickJumper: true
        }
        return page;
    },

    getOptionList(data){
        if(!data){
            return []
        }
        let options = [];
        options.push(<Option value="all" >全部</Option>)
        data.map((item)=>{
            options.push(<Option value={item.value} >{item.name}</Option>)
        })
        return options;
    },
    // 格式化金额,单位:分(eg:430分=4.30元)
    formatFee(fee, suffix = '') {
        if (!fee) {
            return 0;
        }
        return Number(fee).toFixed(2) + suffix;
    },
    // 格式化公里（eg:3000 = 3公里）
    formatMileage(mileage, text) {
        if (!mileage) {
            return 0;
        }
        if (mileage >= 1000) {
            text = text || " km";
            return Math.floor(mileage / 100) / 10 + text;
        } else {
            text = text || " m";
            return mileage + text;
        }
    },
    // 隐藏手机号中间4位
    formatPhone(phone) {
        phone += '';
        return phone.replace(/(\d{3})\d*(\d{4})/g, '$1***$2')
    },
    // 隐藏身份证号中11位
    formatIdentity(number) {
        number += '';
        return number.replace(/(\d{3})\d*(\d{4})/g, '$1***********$2')
    },

    /**
     * ETable 行点击通用函数
     * @param {*选中行的索引} selectedRowKeys
     * @param {*选中行对象} selectedItem
     */
    updateSelectedItem(selectedRowKeys, selectedRows, selectedIds) {
        if (selectedIds) {
            this.setState({
                selectedRowKeys,
                selectedIds: selectedIds,
                selectedItem: selectedRows
            })
        } else {
            this.setState({
                selectedRowKeys,
                selectedItem: selectedRows
            })
        }
    },
}