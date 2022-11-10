// 将被注入到html中，根据窗口大小，自动调整幻灯片字体的大小！
// 该过程使用二分法进行调整
function getAllSubNodes(node,TagName) { //image nodes
    var ret=[];
    len = node.children.length;
    for(var i=0;i<len;i++){
        if(node.children[i].tagname == TagName){
            ret.push(node.children[i]);
        }
        var subnodes = getAllSubNodes(node.children[i],name);
        for(var j=0;j<subnodes.length;j++){
            ret.push(subnodes[j]);
        }
    }
    return ret;
}

function resizeFont(){
    var wholeslide = document.getElementsByClassName("present")[0];
    if(wholeslide.classList.contains("resized")){
        return;
    } else {
        wholeslide.classList.add("resized");
    }

    var minFontSize = 10;
    var maxFontSize = 42;
    d=document.getElementsByClassName("slide present")[0];
    for(var i=0;i<d.childNodes.length;i++){
        if(d.childNodes[i].className=="content"){
            var content=d.childNodes[i];
            break;
        };
        for(var j=1;j<10;j++){
            if(d.childNodes[i].className=="title"+j){
                var title=d.childNodes[i];
                break;
            }
        }
    };
    if(content){
        var imgSubNodes = getAllSubNodes(content,"IMG");
        var widthList = [];
        for(var i=0;i<imgSubNodes.length;i++){
            widthList.push(imgSubNodes[i].naturalWidth);
        }
        var left=minFontSize;
        var right=maxFontSize;
        var re0=maxFontSize;
        var fontSize;
        while(left!=right){
            fontSize = Math.ceil((right + left) / 2);
            content.style.fontSize = fontSize+'px';
            scale = fontSize/re0;
            for(var i=0;i<imgSubNodes.length;i++){
                imgSubNodes[i].style.width = Math.floor(scale*widthList[i])+"px";
            }
            console.log("left:"+left+",right:"+right+",fontsize:"+fontSize+"px");
            console.log("offsetHeight:"+content['offsetHeight']+",scrollHeight:"+content['scrollHeight']);
            // console.log("totalHeight:"+totalHeight);
            if(content['offsetHeight']<content['scrollHeight'])
            // console.log(`totalHeight:${totalHeight},offsetHeight:${content['offsetHeight']},clientHeight:${content['clientHeight']},scrollHeight:${content['scrollHeight']}`);
            // if(content['scrollHeight']>totalHeight)
            {
                right = fontSize-1;
            }
            else
            {
                left = fontSize;
            }
        }
        fontSize = left;
        content.style.fontSize = fontSize+'px';
        scale = fontSize/re0;
        for(var i=0;i<imgSubNodes.length;i++){
            imgSubNodes[i].style.width = Math.floor(scale*widthList[i])+"px";
        }
    } else {
        console.log("content not found!!!");
    }
    
};
f = function (){
    buttonleft = document.getElementsByClassName('navigate-left')[0];
    buttonright = document.getElementsByClassName('navigate-right')[0];
    resizeFont();
    buttonleft.onclick = resizeFont;
    buttonright.onclick = resizeFont;
};
addEventListener("load",f);
// addEventListener('keypress',function (e){
//     console.log(e);
//     if(e.key=='ArrowRight'){
        
//     }
// });
addEventListener('keydown',function(e){
    if(e.key=='ArrowRight'){
        console.log('ArrowRight')
        button = document.getElementsByClassName('navigate-right')[0];
        button.onclick();
    }
});
