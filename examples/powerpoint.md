---

mode: powerpoint
header : true
footer : true
date: xx年xx月xx日
author: life is physics
title: MPE PPT writing
presentation:
    width: "100%"
    height: "100%"

---

# 1
这个功能是这一堆配置文件的核心。`parser.js`魔改了很多原本`revealjs`的功能，可以用定义`header:true`和`footer:true`的方式来产生第一页的标题和每一页下方的脚注。
## 2
\title3[]{
也可以通过这种方式加入子标题
}
同时，为了和文章type兼容，这里不再使用原本的`<!-- slides -->`的方式产生新的一页，只要产生了标题它就会帮你自动产生新的一页。目前是只有四级标题以上的才会产生新页。这个标题分页的最大级数是由`parser.js`中的level参数确定的。
### 3级标题
test
#### 4级标题
123
额 好像有bug，5级标题没有在content的内部，不显示了。。。那先不用就是了（x
##### 5级标题
test

###### 123

## 结构
每页PPT对应一个HTML的section
内部一般结构如下：
1. 脚注对应的元素，浮动到底部
2. title对应元素
3. content，即本页PPT的内容
1和2都视情况，可能存在也可能没有。同时content会包含其他的subnode。

## 字体自动调节
做这堆配置文件实现了个超tm重要的功能，就是根据每页内容的多少，自动调节字体的大小（不信可以在一页PPT中塞很多内容，它会随着内容一直缩小字体哦）！这个功能在`font.js`中实现，并在文档被`parser.js`编译处理的时期加入到最终的HTML中。它通过二分法调节实现这个功能，会在点击右箭头时/在敲击键盘右键时触发（也就是在ppt向后翻页的时候起作用），修改字体（注意，这是个DOM上的操作）

## 导出
PPT可以很容易地导出HTML版本，但不能像passage类型那样，直接通过右键`Chrome(Puppeteer)/PDF`导出（否则全是乱码）。这时候`decktape`就起作用了。它可以用来导出网络文稿。安装好之后，我比较常用的命令为generic模式下的导出：先导出HTML文档，然后运行命令：
```
decktape generic <你的html文档> <输出pdf> [--size {长(pixel)x宽(pixel)}] [--max-slides 最大导出页数]
```
具体使用请参考[decktape](https://github.com/astefanutti/decktape)的官方文档

## 比较舒服的功能
有一个比较舒服的功能：尝试把原本是一篇passage/powerpoint的文章的mode改成powerpoint/passage，会发现可能不用作太多改动排版也还不赖（x

## 分页
然而目前这个配置依然不能支持自动分页，也就是当一个标题对应内容过多时，由程序自动为其分成多页来展示。这是我一直想实现的一个功能，但似乎不太好实现。。。