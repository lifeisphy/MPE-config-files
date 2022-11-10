---
    mode:zhihu
---
用这个配置所作文章可以很容易地导出成知乎编辑器下可简单复制粘贴的格式。只需要在yaml中把`mode`改成`zhihu`即可。
这篇全部是`mode:zhihu`下渲染的结果。和普通的模式进行比较，你可以发现公式都变得不一样了，同时彩色的标签和分栏都被parser取消掉了。这些都是为了方便导入zhihu加上的功能。但注意，图片的\img不受影响。导入zhihu时所有图片需要使用网络url才能正常导入，引用本地图片无法正常导入。

导入的方式：在MPE预览界面右键"Save as Markdown"，再上传产生的md；或者直接在预览界面复制，在zhihu编辑器下粘贴。亲测有效~
\img["bloch.png"]
$$
E=mc^2
\left(
\begin{matrix}
1&2\\
2&1
\end{matrix}

\right)
$$
\def[定义]{
123
$$
123
$$
}
twocolumn:
left:
\pf[]{
1
}
right:
2
end.