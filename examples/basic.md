\logo[]{
\img["../logo.jpg"]
}

这里介绍加入`parser.js`中的基本语法：

```
\! [param1] [param2]...[paramn]{
一些内容
}
```
其中叹号`!`可有可无，有叹号时该标签会加入`display:inline`样式，从而渲染成行间模式；未加入时该元素将独占一行。
`{一些内容}`这个也可有可无，如果大括号存在，该标签是闭合形式，即会被渲染为`<div class="">一些内容</div>`；而不加入时，会变成非闭合形式。比如`<br> <img>`这些标签就是这种形式。

在浏览这些生成的html网页时，你可以打开对应的markdown进行对比。

一些常用的样式也定义成了类，可以直接拿来用：

# 居中标题 {.center}
\bold[]{
加粗文字
}

如果你精通css 样式，想暂时实现一些效果，可以直接这样写：
\suibiantian[font-size=40px][background-color=blue][color=red]{
test
}

但只有`style_attributes`中存在的属性(参见`parser.js`的`transform_labels`函数）才能这么写。一般的还是得这么写：

\suibianxie[style="font-size:40px;background-color:blue;color:red;padding-left:10px;""]{
test
}

如果你不希望每次写起来都这么麻烦，可以在`.less`中把所需样式封装成一个classname，用起来会更加方便：库中`example.less`提供了这样一个例子。
在`styles.less`中引入`@import "./example.less"`后，就可以这样用：
\!exp[]{
我是一个示例
}

总之你应该可以看到，这套排版本质上还是基于HTML进行的，只不过我把它的语法变得latex-like了。
在Markdown中你可以直接插入HTML元素，而MPE渲染时继承了这一特性：
<button style="width:50px;height:50px" onclick="alert('你戳俺干啥?');">click me</button>
不过在VSCode MPE预览界面下，有些网页上能用的功能似乎是不能生效的。比如，在预览界面点上面那个按钮无法弹出提示窗口；控制台的输出同样看不到。
几乎所有markdown的基本语法都能够得到支持。以及，除了用`![]()`来引用图片，你还可以这样引用本地或网络图片：
\img["bloch.png"]\img["bloch.png"][float=right][z-index=10][width=30%]
而且可以利用html的属性，对其随意调整大小，以及让它浮动：
$$
X = \v r\cdot \v \sigma\\ 
\text{tr}(XY ) = \text{tr}(X^aY^b\sigma_a\sigma_b)\\ 
$$

有了这些语法，我们可以对内容样式进行更精细的控制：
\xxx[background-color=red][color=yellow]{

\!xxx[color=rgb(0,255,255)]{青色}字体，行间模式
\bold[color=rgb(255,0,255)][text-align=center]{加粗字体，粉色，行内模式，居中}end
}




