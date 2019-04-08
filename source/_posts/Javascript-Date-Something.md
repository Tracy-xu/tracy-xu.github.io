---
title: 记录 Date 中的两个坑
date: 2019-04-06 21:23:57
tags:
categories: JavaScript
---

## new Date 参数 dataString 格式问题

new Date(dataString) 中，参数 dataString 必须符合 ISO 8601 标准或者 RFC 2822 标准，现代主流浏览器这两个标准都支持（IE8 只支持 RFC 2822，不支持 ISO 8601）。

```
new Date('2019-01-25T09:14:10.099+00:00').getTime();    // ISO 8601 标准。返回 1548407650099
new Date('2019/01/25 09:14:10+0000').getTime();         // RFC 2822 标准。返回 1548407650000
```

然而，在实际工作中，后台（Java）返回的是格式既不是标准的 ISO 8601 也不是标准的 RFC 2822 格式，而是 ISO 8601 和 RFC 2822 混合格式，时区使用的是 RFC 2822 格式，比如，2019-01-25T09:14:10.099+0000，这个格式只有 Chrome 支持，其他浏览器都不支持（比如 iOS WebView、IE），执行 getTime 操作会返回 NaN：

```
new Date('2019-01-25T09:14:10.099+0000').getTime();     // NaN
```

<!--more-->

对于这个问题，要么要求后端返回标准的日期字符串格式，要么前端将数据纠正（moment、data-fns 就做了处理）。


## setDate 的副作用

setDate 参数如果超出了月份的合理范围，会向上个月或下个月设置，<= 0 时，会设置上个月的日期，0 是最后一天，-1 是倒数第二天，以此类推，超出范围的正整数同理。

```
var d = new Date();
d.setDate(0);
d;                            // 2 月 28
```

我们可以利用这个特性来获取月份的天数和判断是否是闰年：

```
// 获取月份天数
function getMonthDayCount(year, month) {
  return new Date(year, month, 0).getDate();
}

getMonthDayCount(2017, 10);   // 31

// 获取一年中所有月份天数
function getAllMonthDayCount(year) {
  var days = [31, new Date(year, 2, 0).getDate(), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days;
}

getAllMonthDayCount(2016);    // [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
```

```
// 是否是闰年
function isLeapYear(year) {
  return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
}

// 这样是不是更容易理解
function isLeapYear(year) {
  return new Date(year, 2, 0).getDate() === 29;
}

isLeapYear(2000);             // true
```

* 副作用

但是，当在同一个 Date 对象上连续执行 setDate 操作时，不单单会偏移日期，还会连续偏移月份，这会影响后面的计算，导致结果出错。在实现 Calender 组件时发现这个问题。

```
var d = new Date();
d.setDate(0);
d;                    // 2 月 28

d.setDate(-1);
d;                    // 理想希望返回 2 月 27，但是返回的是 1 月 30
```
