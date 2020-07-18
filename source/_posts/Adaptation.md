---
title: 移动端适配方案
date: 2016-6-10
categories: css
---

## VW + REM

在移动端开发中，我们曾使用过“流体布局”、“Viewport Scale”、“Media Query/JS + REM 流体”，等适配方案，但由于各种缺陷，这些适配方案都一一被淘汰。一个优秀的适配方案，应做到以下两点：

```
* UI 的精确还原与适配
* 兼容第三方组件和跨端数据
```

vw + rem 就是这样的一个方案。

vw + rem 下不用手动断点设置 html font-size，也不需要考虑 dpr，其原理是，html font-size 联动 rem（ html font-size value = 1 rem），屏幕联动 html font-size vw。

### 使用方法

* 约束规范

```
* 设计规范：规定设计稿分辨率。比如，Pad 选择 1920px，手机选择 750px
* 基准值：规定屏幕分成 10 等分（100vw/10），html font-size 为 10vw，所以 1rem = 10vm
```

将基准值的定义为 100vw/10 = 10vw，而不是 100px（除以 19.2、12.8），这仅仅是规范，10vw 体现适配原则，容易理解，而 100px 在没有转换工具的条件下，方便了口算。

在没有转换工具的情况下，为了方便口算，我们会将 html faont-size 定义如下：

```
font-size: calc(100vw/19.2);   # 1920 的设计规范下还原的，base 为 1920px/19.2 = 100px，px 转 rem 除以 100 即可
```

直接在源码里面进行转换不利于源码的维护，在现代前端开发中推荐使用工程化工具转换。

* 使用步骤

```
* 步骤一：定义 html font-size 基准值（一般会定为 10vw）
* 步骤二：开发页面。页面在物理像素下开发（平板 1920、手机 750），开发单位为 px
* 步骤三：px 转 rem。这一步请用工具完成，转换方法为 px/基准值（1920 设计规范下是 192，750 设计稿是 75），一般会忽略 border，因为可能变成 0px
```

### 兼容处理

vw 不支持 Android 4.4 以下设备，这时候就需要对 vw 做兼容处理了。这里不想通过 JS 来解决此问题，本着逐渐增强，平稳退化的原则，选一个默认分辨率处理，比如手机就选 750 的分辨率：

```CSS
html {
  font-size: 37.5px;
  font-size: 10vw;
}
```

注：[flexible](https://github.com/amfe/lib-flexible) 就是手淘团队在 Android 4.4- 设备不支持 vw 时的一个 JS 解决方案。
