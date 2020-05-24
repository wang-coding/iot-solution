import React from "react";
import {Descriptions} from "antd";

export default class Desc extends React.Component{


    renderDescItem=()=>{
        let list = this.props.descList;
        let bordered = this.props.bordered;
        const descItemList = [];
        if (list && list.length > 0 ){
            list.forEach((item,i)=>{
                let label = item.label;
                let content = item.content;
                let span = item.span || 3;
                const desc = <Descriptions.Item label={label} span={span}>{content}</Descriptions.Item>;
                descItemList.push(desc);
            })
        }
        return <Descriptions bordered={bordered} layout={this.props.layout||""}>{descItemList}</Descriptions>;
    }
    render() {
        return(
            <div>
                    {this.renderDescItem()}
            </div>
        )
    }
}