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

class ImgFigure extends React.Component{
    render(){
        return (
            <figure className="img-figure">
                <img className="img-style"  src={this.props.data.imgUrl}
                    alt={this.props.title}
                />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                </figcaption>
            </figure>
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
            {
                pos:{
                    left:'0',
                    top:'0'
                }
            }
        ]
        }
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


            imgsArrangeCenterArr[0].pos = centerPos;

            //取出要布局上侧的图片状态信息

            topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangArr.length -topImgNum));
            imgsArrangeTopArr = imgsArrangArr.splice(
                topImgSpliceIndex,topImgNum
            )
            //布局位于上侧的图片
            imgsArrangeTopArr.forEach(function(value,index){
                imgsArrangeTopArr[index].pos={
                    top : getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                    left : getRangeRandom(vPosRangeX[0],vPosRangeX[1])
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

                imgsArrangArr[i].pos={

                    top:getRangeRandom(hPosRangY[0],hPosRangY[1]),
                    left :getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
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
                    }
                }
            }
            imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+
                index} arrange ={this.state.imgsArrangArr[index]}/>)
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