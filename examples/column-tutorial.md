# 分栏教学
尽管`structs.json`中内置了分2、3、4、5栏的class，但分的太多或许也不实用，所以我只定义了分两栏、分三栏的指令（只在PPT添加底部标签的时候用到了分四栏的操作）。使用起来也很简单：
```
（下面均去掉"_")
t_wocolumn:
l_eft:
xxx
r_ight:
yyy
e_nd.

t_hreecolumn:
l_eft:
xxx
m_iddle:
zzz
r_ight:
yyy
e_nd.
```
而且每一栏可以添加任意的元素，只要你不怕宽度溢出（x
比如：
twocolumn:
left:
左边的东西
\def[左边的定义]{

}
right:
右边的东西
\blue["右边的证明"]{

}
end.
再比如：
threecolumn:
left:
左边
middle:
中间

中间还有个Block Sphere:
\img[height=300px]["./bloch.png"]

right:

右边
end.
或者用它结合bars的功能，来玩点花的：
threecolumn:
left:
\tag[height=100px][background-color=red]{
红的
}
middle:
\tag[height=200px][background-color=green]{
绿的
}
right:
\tag[height=300px][background-color=blue]{
蓝的
}
end.
目前每一栏被定义成等宽，如果想根据内容浮动宽度（尽管这可能不是个好主意），可以修改[structs.less](./../structs.less)