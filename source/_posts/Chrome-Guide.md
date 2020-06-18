---
title: Chrome 常用使用技巧
date: 2017-12-08
tags:
categories: tools
---

## 快捷键

* 地址栏

```
Ctrl + L                      # 选中网址区域中的内容
```

* 页面

```
Ctrl + P                      # 打印当前页
Ctrl + S                      # 保存当前页
Ctrl + F                      # 搜索
F5                            # 刷新
Ctrl + F5                     # 刷新（忽略缓存内容，强制刷新） 
Ctrl + U                      # 查看源代码 
Ctrl + D                      # 加入书签
Ctrl + + | Ctrl + -           # 放大或缩小网页（或者 Ctrl + 向上向下滚动鼠标滚轮）
Ctrl + 0                      # 恢复缩放
```

<!-- more -->

* 窗口和标签页

```
Alt + Home                       # 打开主页
Ctrl + Shift + T                 # 重新打开上次关闭的标签页
Ctrl + W                         # 关闭当前标签页（或者 Ctrl + F4）
Alt + F4                         # 关闭当前窗口
Ctrl + N                         # 打开新窗口 
Ctrl + T                         # 打开新标签页
Ctrl + Shift + N                 # 隐身模式
Ctrl + Shift + T                 # 打开最近被关闭的网页
Ctrl + Tab | Ctrl + Shift + Tab  # 切换 Tab 页
Ctrl + PgDown | Ctrl + PgUp      # 切换 Tab页
Ctrl + 1 ~ Ctrl + 8              # 切换到指定位置编号的标签页
Ctrl + 9                         # 切换到最后一个标签页
```

* 应用功能

```
Ctrl + Shift + B	# 打开和关闭书签栏 
Ctrl + Shift + O	# 打开书签管理器 
Ctrl + H	        # 查看"历史记录"页 
Ctrl + J	        # 查看"下载"页 
Ctrl + O	        # 在Chrome中打开计算机上的文件
Shift + Esc	        # 任务管理器
```

* DevTools

```
# 菜单
Ctrl + [                # 切换 Tab 菜单
Ctrl + ]                # 切换 Tab 菜单

# 调试
Ctrl + Shift + M        # 切换到手机调试状态
F11                     # 断点：步进。单步进入（step into, 单步执行, 进入函数）
Shift + F11             # 断点：步出。单步退出（step out, 跳出函数）
F10                     # 断点：步过。单步跳过（step over, 单步执行, 不进入函数）
F8                      # 断点：断续（继续执行）

# Element
Enter                   # 添加属性
F2                      # 修改 HTML
Delete                  # 删除元素

# Source（这部分基本跟 Sublime 快捷键一致）
Ctrl + O                # Goto Anything: 打开文件
Ctrl + Shit + O         # Goto Anything: 跳到函数定义位置
Ctrl + G                # Goto Anything: 行跳转
Ctrl + P                # Goto Anything: 搜索或过滤文件名
Ctrl + Shift + P        # Goto Anything: 搜索方法
Ctrl + F                # 搜索
Ctrl + Shift + F        # 所有脚本中搜索
Ctrl + D                # 多光标选择匹配的单词
Alt + Move Mouse        # 多光标编辑
Ctrl + Click Mouse      # 多光标编辑
Ctrl + M                # 跳到括号的另一端
Ctrl + /                # 注释代码
Tab | Shift + Tab       # 缩进。增加或减少缩进
```

## 插件

* 安装

通过 [Chrome 网上应用商店](https://chrome.google.com/webstore/category/extensions)安装所需插件。隐身模式下使用，需要在 chrome://extensions 里勾选。

* 卸载

chrome://extensions（也就是工具 --> 扩展程序）。

* 推荐插件

```
Axure RP Extension for Chrome        # Axure
Web Developer                        # Web
FeHelper                             # WEB 前端助手
JSONView                             # 格式化 JSON
Markdown Reader                      # Markdown
CSSViewer                            # CSS
YSlow                                # 性能
Vue Devtools                         # Vue
React Developer Tools                # React
Charset                              # 修改网站的默认编码
Postman                              # API 管理
LocalStorage Manager                 # LocalStorage
Adblock Plus                         # 阻止广告
```

注：上面都是“Chrome扩展程序”，商店里除了有“扩展程序”外，还有“应用”（通过 chrome://apps 打开）的分类。有些“扩展程序”也有对应的“应用”，这两类都是在同一个地方卸载，同在应用商店里安装。

## Inspect

Chromium 采用 Chrome:// 协议开头的形式, 规定了一系列的内部协议, 有的用来显示数据, 有的用来实现一些功能, 但对普通用户进行了屏蔽。可在 Chrome 浏览器地址栏直接访问。

```
chrome://about              # 查看 chrome 所有的命令
chrome://inspect            # 调试
chrome://bookmarks          # 书签管理器
chrome://dns                # 展示 DNS 状态, 一般用来监控排查排查网络问题
chrome://credits            # 展示所有第三方软件许可证（开放源代码软件）
chrome://downloads          # 用网页的形式展示下载管理器
chrome://chrome-urls        # 内部 URL 列表
chrome://extensions         # 展示所有安装的扩展程序
chrome://flags              # 实验室
chrome://version            # 版本
chrome://flash              # Flash 版本
chrome://history            # 浏览器的历史记录
chrome://appcache-internals # HTML5 离线应用
chrome://cache              # 显示上网过程中, 在本地产生的缓存文件列表，只能看列表, 不能管理
chrome://settings           # 设置，chrome://settings/clearBrowserData 清理浏览器缓存
```

Android 4.4 (KitKat) 开始，使用 Chrome 开发者工具可以帮助我们在原生 Android 应用中远程调试 WebView 网页内容。

* 第一步，设置 WebView 调试模式。WebView 类包含一个公共静态方法，作为 Debug 开关

```Java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    WebView.setWebContentsDebuggingEnabled(true);
}
```

* 第二步，确保 USB 连接的前提下，打开 PC 中的 Chrome 浏览器，输入网址，打开页面（Dev Tools 下的 Remote devices 也是一样）

```
chrome://inspect
```

需要勾选 Discover USB Devices。

DevTools 页面的 Devices 菜单页自动显示当前连接的远程设备名和序列号，以及当前原生 App 打开的 WebView 的网页地址。