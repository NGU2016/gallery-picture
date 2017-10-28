import React from 'react';
import ReactDOM from 'react-dom'

class ControllerUI extends React.Component{
    constructor(props){
        super(props)
    }
    handleclick(e){
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    }

    render (){
        const turnImg=require("../img/turn.JPG");
        return(
                <div className="controller-unit" onClick={this.handleclick.bind(this)}>
                    <img className="turn-img" src={turnImg}/>
                </div>
        )
    }

}
export default ControllerUI;