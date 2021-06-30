
/**
 * 封装的加入购物车动效fly-to-basket.js v1.0.0
 * 使用示例：
 *  new Fly(170,170,e.clientY-200,e.clientX-80,{
 *       zIndex:98,
 *       backgroundImage:"url(https://m.360buyimg.com/babel/jfs/t1/34598/40/2376/100242/5cb5c989E775c5ffd/ddb6b4a7d6b1c05e.jpg!q70.jpg)",
 *       backgroundRepeat:"no-repeat",
 *       backgroundSize:"contain",
 *       backgroundColor:"white",
 *       borderRadius:"85px"
 *   }).scale(40,40,200).drop("90%","30px",300).flush()     
 * 
 * Date:2021/6/29                                           
 * 1.0.0新构建
 * 
 * @param {number} initWidth - 初始宽度（px）
 * @param {number} initHeight - 初始高度（px）
 * @param {number} initTop - 初始上边距（px），类似商品物体出现的位置，类似event.ClientY
 * @param {number} initLeft - 初始左边距（px），类似商品物体出现的位置，类似event.ClientX
 * @param {object} customStyles - 自定义物体Styles，key和value规则符合element.style.key=value
 * @version 1.0.0
 * @author DuanJianbo
 * @copyright https://github.com/duanjianbo
 */
var Fly=(function(){
    function Fly(initWidth,initHeight,initTop,initLeft,customStyles){
        var thing=document.createElement('div');
        var customStylesProps=Object.keys(customStyles);
        for(var prop of customStylesProps){
            thing.style[prop]=customStyles[prop];
        }
        thing.style.width=initWidth+"px";
        thing.style.height=initHeight+"px";
        thing.style.top=initTop+"px";
        thing.style.left=initLeft+"px"
        thing.style.position="fixed";
        document.body.append(thing);  
        this.thing=thing;
        this.actionsQueue=[];
    }
    /**
     * 物体缩放
     * @param {number} width 
     * @param {number} height 
     * @param {number} duration 单位ms
     * @returns 
     */
    Fly.prototype.scale=function(width,height,duration){
        var fn=function(){
            var originWidth=this.thing.style.width.replace("px","")-0,originHeight=this.thing.style.height.replace("px","")-0;
            this.thing.style.transition="all "+duration/1000+"s linear"
            this.thing.style.width=width+"px"
            this.thing.style.height=height+"px"
            var adjustedTop=this.thing.style.top.replace("px","")-0+(originHeight-height)*0.5;
            var adjustedLeft=this.thing.style.left.replace("px","")-0+(originWidth-width)*0.5;
            this.thing.style.top=adjustedTop<0?0:adjustedTop;
            this.thing.style.left=adjustedLeft;
        };
        fn.duration=duration;
        this.actionsQueue.push(fn);
        return this;
    }
    /**
     * 
     * @param {string} top  符合style.top值的规则即可，类似商品物体最终出现的位置，类似event.ClientY
     * @param {string} left 符合style.left值的规则即可，类似商品物体最终出现的位置，类似event.ClientX
     * @param {number} duration 单位ms
     * @returns 
     */
    Fly.prototype.drop=function(top,left,duration){
        var fn=function(){
            this.thing.style.transition="all "+duration/1000+"s ease"
            this.thing.style.top=top;
            this.thing.style.left=left;
        };
        fn.duration=duration;
        this.actionsQueue.push(fn);
        return this;
    }
    Fly.prototype.flush=function(){
        var that=this;
        setTimeout(function(){
            var waitingCursor=null,whileCursor=null;
            whileCursor=setInterval(function(){
                if(!waitingCursor){
                    if(that.actionsQueue.length){
                        var action=that.actionsQueue.shift();
                        acting=true;
                        action.call(that);
                        waitingCursor=setTimeout(function(){
                            clearTimeout(waitingCursor);
                            waitingCursor=null;
                        },action.duration);
                    }else{
                        clearInterval(whileCursor);
                        that.thing.remove();
                    }
                }
            }, 10);
        },100)
    }
    return Fly;
})();
//export default Fly;
