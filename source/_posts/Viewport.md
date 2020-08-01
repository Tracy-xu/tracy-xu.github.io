---
title: 两个像素三个视口 -- 视口
date: 2016-6-10
categories: css
---



视口（viewport）代表当前可见的计算机图形区域。在 Web 浏览器术语中，通常与浏览器窗口相同，但不包括浏览器的 UI（菜单栏等）。一般我们所说的视口共包括三种：布局视口、视觉视口和理想视口，它们在屏幕适配中起着非常重要的作用。

<!--more-->

## 布局视口

桌面浏览器中，视口的宽度与浏览器窗口的宽度一致，浏览器窗口就是约束 CSS 布局的视口，它是所有 CSS 百分比宽度推算的根源，给 CSS 布局限制了一个最大宽度（超出部分将出现滚动条）。但是在移动端，情况就很复杂了。

在移动设备上，视口与屏幕宽度不再相关联，是完全独立的，浏览器厂商为了让传统的 PC 网页能够尽可能在移动设备上更多的展示，会把视口的宽度设置地很大（一般在 768px ~ 1024px 之间，Apple 是 980px），并且将其缩放在了屏幕内。这个浏览器厂商定义的视口被称为“布局视口（Layout Viewport）”，网页的最大宽度是默认的 Layout Viewport 宽度，超出部分会出现滚动条。

![layout viewport](/images/css/layout-viewport.png)

可通过 Meta Viewport 来设置布局视口，能设置的属性如下所示。

Name | Value | Description
---|---|---
width | 正整数或 device-width | 定义视口的宽度，单位为像素
height | 正整数或 device-height | 定义视口的高度，单位为像素
initial-scale | [0.0-10.0] | 定义初始缩放值
minimum-scale | [0.0-10.0] | 定义缩小最小比例，它必须小于或等于 maximum-scale 设置
maximum-scale | [0.0-10.0] | 定义放大最大比例，它必须大于或等于 minimum-scale 设置
user-scalable | yes/no | 定义是否允许用户手动缩放页面，默认值 yes

```HTML
<meta name="viewport" content="width=640">
```

JS 中可通过 `document.documentElement.clientWidth / clientHeight` 获取布局视口的尺寸，CSS 中可设置 `html, body {width: 100%}`，通过测量 `body` 的宽度来验证默认布局视口大小。另外，CSS 中的媒体查询，查询的是布局视口的宽度。

```HTML
@media (min-width: 700px) {
    ...
}
```

## 视觉视口

用户在屏幕上能看到的网页区域被称为“视觉视口（Visual Viewport）” 。

视觉视口用于承载布局视口，其大小是视觉视口内 CSS 像素的总量，受浏览器缩放影响。用户可以在视觉视口中拖动或者缩放网页，来获得良好的浏览效果，如果用户缩小网站，视觉视口内 CSS 像素数量增多，视觉视口变大，看到的网站区域将变大，同理用户放大网站，视觉视口内 CSS 像素数量减少，视觉视口也变小，能看到的网站区域将缩小。不管用户如何缩放，都不会影响到布局视口的宽度。

![visual viewport](/images/css/visual-viewport.png)

`window.innerWidth/innerHeight` 可以获取视觉视口的尺寸，大小是屏幕中 CSS 像素的数量。

## 理想视口

移动设备中默认 768px ~ 1024px 尺寸的布局视口对用户不友好，忽略了手机本身的尺寸，于是引入理想视口的概念。将布局视口的宽度设为屏幕的宽度，这样的布局视口被称为“理想视口（Idea Viewport）”。理想视口是移动设备上最佳的布局视口，理想视口下开发的页面不需要缩放就能够完美显示。

JS 中可通过 `screen.width/height` 获取理想视口的尺寸（有兼容性问题，可能返回的是设备像素尺寸）。将 Meta Viewport 设置如下就可以将布局视口设为理想视口了。

```HTML
<meta name="viewport" content="width=device-width">
<!-- 实践中，还会设置缩放 -->
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<!-- 推荐的写法 -->
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0,viewport-fit=cover">
```

注：`initial-scale`有一个隐藏的作用，它同时会将布局视口的尺寸设置为缩放后的尺寸，所以`initial-scale=1`与`width=device-width`的效果是一样的（不缩放又要求放进 Visual Layout 里，所以 `initial-scale=1` 与 `width=device-width` 等同）。
