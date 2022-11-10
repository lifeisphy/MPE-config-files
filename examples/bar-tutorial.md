# 标签使用教学
\def[佬群]{
定义"佬群"为一商群：
$$
群/\{我\}=佬
$$
}
\prop[性质]{
$佬$群具有性质：
$$
我\notin 佬
$$
}
\thm[第一定律]{
$$
\forall x\in 群,x\ne 我\Rightarrow x\in 佬
$$
\pf[]{
西江月・证明
即得易见平凡，仿照上例显然。留作习题答案略，读者自证不难。
反之亦然同理，推论自然成立。略去过程$Q.E.D.$，由上可知证毕。
}
}

"定义"标签由`\def`产生。这些都属于闭合标签。它们的工作原理是这样的。
```

\def["123"]{
contents
}
转化为:
<div class="def" name="123"  style="">
contents
</div>
```
结合`bars.css`中的样式，它将被渲染成彩色的标签。
这样的标签在`bars.css`中还定义了一些，比如
`pf,proof,p`都会渲染成有伪元素`::before`和`::after`的蓝色标签，会显示“证明”和“得证”;`lemma`,`thm`等同理。
同时，这些标签支持相互嵌套。支持的最大嵌套层数由`parser.js`中的变量`MaxRecursionDepth`决定。
