import React from  'react';
import ReactDOM from 'react-dom';

class ImgFigure extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            clicked:false
        }
    }
    /**
     * 点击处理函数
     * ***/
    handleClick (e){
        this.setState({
            clicked : true
        })
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    }
    render(){
        var me=this;
        var styleObj = {};
        if(this.props.arrange){
            styleObj = this.props.arrange.pos;
        }
        /**
         * 添加旋转
         * **/
        if(this.props.arrange.rotate){
            (['Moz','ms','Webkit','']).forEach(function(value){
                if(this.props.arrange.isCenter && styleObj){
                    styleObj.zIndex = 114
                }
                if(!styleObj[value + 'Transform']) {
                    styleObj[value + 'Transform'] = "rotate(" + this.props.arrange.rotate + "deg)";
                }
            }.bind(this));
        }
        var imageFront = "front";
        var imageBack = "back"
        imageFront += this.props.arrange.isInverse ? ' tranform' : ' ';
        imageBack += this.props.arrange.isInverse ? ' ' : ' tranform';
        return (
            <div className="img-figure" style={styleObj} >
                <div className="flipper">
                    <div className={imageFront}>
                        <img className="img-style"  src={me.props.data.imgUrl}
                             alt={this.props.title } onClick={this.handleClick.bind(this)}
                        ></img>
                    </div>
                    <div className={imageBack} onClick= {this.handleClick.bind(this)}>
                        <h2 className="back-text"> {this.props.data.desc} </h2>
                    </div>
                </div>
            </div>
        )
    }
}

export default ImgFigure