import React from 'react'
import Util from './../../uitils/Util'
import {Table} from 'antd'
import  "./index.less"

/**
 * @param type:默认radio
 */
export default class ETable extends React.Component {

    state = {}
    //处理行点击事件

    onRowClick = (record, index) => {
        let rowSelection = this.props.rowSelection;
        if(rowSelection == 'checkbox'){
            let selectedRowKeys = this.props.selectedRowKeys;
            let selectedItem = this.props.selectedItem || [];
            if (selectedRowKeys) {
                const i = selectedRowKeys.indexOf(index);
                if (i == -1) {//避免重复添加
                    selectedRowKeys.push(index);
                    selectedItem.push(record);
                }else{
                    selectedRowKeys.splice(i,1);
                    selectedItem.splice(i,1);
                }
            } else {
                selectedRowKeys = [index]
                selectedItem = [record];
            }
            this.props.updateSelectedItem(selectedRowKeys,selectedItem || {});
        }else{
            let selectKey = [index];
            const selectedRowKeys = this.props.selectedRowKeys;
            if (selectedRowKeys && selectedRowKeys[0] == index){
                return;
            }
            this.props.updateSelectedItem(selectKey,record || {});
        }
    };

    // 选择框变更
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.props.updateSelectedItem(selectedRowKeys,selectedRows[0]);
    };

    onSelectAll = (selected, selectedRows, changeRows) => {
        let selectKey = [];
        selectedRows.forEach((item,i)=> {
            selectKey.push(i);
        });
        this.props.updateSelectedItem(selectKey,selectedRows[0] || {});
    }

    getOptions = () => {
        const { selectedRowKeys } = this.props;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect:(record, selected, selectedRows)=>{
                console.log('...')
            },
            onSelectAll:this.onSelectAll
        };
        let row_selection = this.props.rowSelection;

        let pagination=this.props.pagination;
        if(pagination===null || pagination === false){
            pagination=true;
        }
        // 当属性未false或者null时，说明没有单选或者复选列
        if(row_selection===false || row_selection === null){
            row_selection = false;
        }else if(row_selection == 'checkbox'){
            //设置类型未复选框
            rowSelection.type = 'checkbox';
        }else{
            //默认未单选
            rowSelection.type = 'radio';
        }
        return <Table
            className="equipment-table"
            bordered
            {...this.props}
            rowSelection={row_selection?rowSelection:null}
            onRow={(record,index) => ({
                onClick: ()=>{
                    if(!row_selection){
                        return;
                    }
                    this.onRowClick(record,index)
                }
            })}
            pagination={pagination}
        />
    };
    render = () => {
        return (
            <div>
                {this.getOptions()}
            </div>
        )
    }
}