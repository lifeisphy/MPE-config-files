一些常用的东西也定义成了类，可以直接拿来用：
\center[]{
居中
}
# 居中 {.center}
\bold[]{
加粗文字
}

如果你精通css styles，想暂时实现一些效果，可以直接这样写：
\suibiantian[font-size=40px][background-color=blue][color=red]{
test
}
但只有`style_attributes`中存在的属性才能这么写。一般的还是得这么写：
\suibianxie[style="font-size:40px;background-color:blue;color:red;padding-left:10px;""]{
test
}
总之你应该可以看到，这套排版本质上还是基于HTML进行的，只不过把它变得latex-like了一点点。
在MPE中你可以直接插入HTML元素：
<button style="width:50px;height:50px" onclick="alert('你戳俺干啥?');"></button>
不过在VSCode MPE预览界面下，有些网页上能用的功能似乎是不能生效的，不太清楚为啥。
基本上所有markdown语法都能够支持。以及，除了用`![]()`来引用图片，你还可以这样引用本地或网络图片：
\img["bloch.png"]
而且可以随意调整大小：
\img["bloch.png"][width=100px][height=200px]

