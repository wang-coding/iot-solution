import React from "react";
import {Card, Table} from "antd";

export default class MoveTable extends React.Component{

    renderCard=()=>{
        let content = this.props.data;
        let cards = [];
        content.map(item=>{
            let card = <Card style={{width:"100px",textAlign: 'center'}}>{item}</Card>;
            cards.push(card);
        });
        return cards;
    }
    render() {
        return(
            <div>
                {this.props.data?this.renderCard:''}
            </div>
        )
    }
}