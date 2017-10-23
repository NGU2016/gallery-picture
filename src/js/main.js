import React from 'react';
import ReactDOM from 'react-dom';
import HelloWord from "../component/helloConpoment.js";
import "../style/main.css"
var imageData=require('../data/imgData.json');

//将信息转换成图片路径
var imageDatas=(function imgUrl(imgDataArray) {
    for(var i=0,j=imgDataArray.length;i<j;i++){
        var singleImgData=imgDataArray[i];
        singleImgData.imgUrl='./src/img/'+singleImgData.fileName;
        imgDataArray[i] = singleImgData;
    }
    return imgDataArray;
})(imageData);

function getRangeRandom(low,high){
     return Math.ceil(Math.random() *(high-low) +low)
}
/*
* 旋转角度
* */
function get30DegRandom(){
    return (Math.random() > 0.5 ?Math.ceil(Math.random() * 30):'-'+Math.ceil(Math.random() * 30))
}

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
                            <h2> {this.props.data.desc} </h2>
                        </div>
                    </div>
            </div>
        )
    }
}


class Gallary extends React.Component{
    constructor (props) {
        super(props)
        this.Constant = {
            centerPos:{
                left:0,
                right:0
            },
            hPosRange :{ //水平方向取值范围
                leftSecX:[0,0],
                rightSeX:[0,0],
                y:[0,0]
            },
            vPosRange:{//垂直方向的取值范围
                x:[0,0],
                topY:[0,0]
            }
        };
        this.state ={
            imgsArrangArr:[
            /*{
                pos:{
                    left:'0',
                    top:'0'
                },
                rotate 0,
                isInverse : false,
                isCenter:false
            }*/
        ]
        };

    }
    /***
     * 翻转图片
     * **/
    inverse (index){
        return function(){
            var imgsArrangeArr = this.state.imgsArrangArr;

            imgsArrangeArr[index].isInverse =!imgsArrangeArr[index].isInverse;

            this.setState({
                imgsArrangArr : imgsArrangeArr
            })
        }.bind(this)
    }
    /**
     * 利用rearrange函数居中index的图片
     * **/

    center (index) {
        return function(){
            this.rearrange(index);
        }.bind(this)

    }

    /*
    *重新布局所有图片
    * */
    rearrange (centerIndex){
        var imgsArrangArr = this.state.imgsArrangArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecx = hPosRange.rightSeX,
            hPosRangY = hPosRange.y,
            vPosRangeTopY=vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.ceil(Math.random() * 2),
            topImgSpliceIndex = 0,

            imgsArrangeCenterArr = imgsArrangArr.splice(centerIndex,1);

            //居中图片不需要旋转
            imgsArrangeCenterArr[0]={
                pos : centerPos,
                rotate :0,
                isCenter: true
            }

            //取出要布局上侧的图片状态信息

            topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangArr.length -topImgNum));
            imgsArrangeTopArr = imgsArrangArr.splice(
                topImgSpliceIndex,topImgNum
            )
            //布局位于上侧的图片
            imgsArrangeTopArr.forEach(function(value,index){
                imgsArrangeTopArr[index]={
                    pos:{
                        top : getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                        left : getRangeRandom(vPosRangeX[0],vPosRangeX[1])
                    },
                    rotate :get30DegRandom(),
                    isCenter :false
                }


            })

            //布局左右两侧的图片
            for(var i=0,j=imgsArrangArr.length,k=j/2;i<j;i++){

                var hPosRangeLORX =null;
                //前半部分
                if(i<k){
                    hPosRangeLORX = hPosRangeLeftSecX;
                }else{
                    hPosRangeLORX = hPosRangeRightSecx;
                }

                imgsArrangArr[i]={
                    pos :{

                        top:getRangeRandom(hPosRangY[0],hPosRangY[1]),
                        left :getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
                    },
                    rotate: get30DegRandom(),
                    isCenter : false
                }



            }
            if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                imgsArrangArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0])
            }

            imgsArrangArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

            this.setState({
                imgsArrangArr:imgsArrangArr
            })
    }

    //组件加载以后为每张图片计算范围
    componentDidMount (){
        //舞台的大小
        var stageDom=ReactDOM.findDOMNode(this.refs.stage),
            stageW= stageDom.scrollWidth,
            stageH= stageDom.scrollHeight,
            halfStageW = Math.ceil(stageW/2),
            halfStageH = Math.ceil(stageH/2);
        //拿到imgfigure的大小

        var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW=imgFigureDom.scrollWidth,
            imgH=imgFigureDom.scrollHeight,
            halfImgW=Math.ceil(imgW/2),
            halfImgH=Math.ceil(imgH/2);
        //计算中心位置点
        this.Constant.centerPos ={
            left:halfStageW-halfImgW,
            top:halfStageH-halfImgH
        }
        this.Constant.hPosRange.leftSecX[0] = 0-halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW-halfImgW * 3;

        this.Constant.hPosRange.rightSeX[0] = halfStageW+halfImgW;
        this.Constant.hPosRange.rightSeX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = 0-halfImgH;
        this.Constant.hPosRange.y[1] = stageH-halfImgH;


        this.Constant.vPosRange.topY[0] = 0-halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH-halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW -imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0)
    }

    render(){

        var controllerUnits=[],imgFigures=[];

        imageDatas.forEach(function (value,index) {
            if(!this.state.imgsArrangArr[index]){
                this.state.imgsArrangArr[index]={
                    pos:{
                        left:0,
                        top:0
                    },
                    rotate :0,
                    isInverse:false,
                    isCenter : false
                }
            }
            imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+
                index} arrange ={this.state.imgsArrangArr[index]} inverse={this.inverse(index)}
                    center = {this.center(index)}
                />)
        }.bind(this))

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        )
    }

}
ReactDOM.render(
    <Gallary/>,
    document.getElementById('root')
);