---
title: Git Commit Message Style Guide
date: 2019-04-20 16:44:35
tags:
categories: project
---

Git 每次提交代码，都要写 Commit message（提交说明），否则就不允许提交。

```
git commit -m "hello world"
```

参数 -m，用来指定 commit mesage。如果一行不够，可以只执行 git commit，就会跳出文本编辑器，让你写多行：

```
git commit
```

为防止跳过规范，禁止使用 `git commit -m`，用 `git commit` 代替。

目前，社区有多种 Commit message 的写法规范。本文介绍 Angular 规范，这是目前使用最广的写法，比较合理和系统化，并且有配套的工具。

<!-- more -->

## 格式化的 Commit Message 的作用

* 语义明确，方便快速浏览

比如，下面的命令显示上次发布后的变动，每个 commit 占据一行。你只看行首，就知道某次 commit 的目的。

```
git log --pretty=format:%s
```

* 可以过滤某些 commit，便于快速查找信息

比如，下面的命令仅仅显示本次发布新增加的功能。

```
git log HEAD --grep feature
```

* 可以直接从 commit 生成 Change log。

Change Log 是发布新版本时，用来说明与上一个版本差异的文档，详见后文。

## Angular Commit Message 规范

[Angular commit message guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines) 中将 Commit message 分为三个部分：Header，Body 和 Footer。

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

其中，Header 是必需的，Body 和 Footer 可以省略。`<BLANK LINE>` 指空行，各个部分必须由空行分割。为了避免自动换行影响美观，不管是哪一个部分，任何一行都不得超过 72 个字符（或 100 个字符）。

比如：

```
docs(changelog): update changelog to beta.5
```

```
fix(ivy): prevent templateOverrides from causing infinite loop (#29402)

Previously, the transitive scope calculation could lead into re-compiling
the same module multiple times. This fix ensures we cannot get into this loop.
It should be fixed more completely (e.g. more cases) once FW-1178 is resolved.

PR Close #29402
```

### Header

Header 部分只有一行，包括三个字段：type（必需）、scope（可选）和 subject（必需）。

* type

type 用于说明 commit 的类别，只允许使用下面 9 个标识。

```
build      # 构建过程或辅助工具的变动。影响构建系统或外部依赖关系的更改（比如：Gulp、Broccoli、NPM）
ci         # 配置文件（对 CI 配置文件和脚本的更改，比如：Travis、Circle、BrowserStack、SauceLabs）
docs       # 文档（Documentation，比如 Readme、Changelog、Contribute 等等）
feat       # 新功能（Feature）
fix        # 修复 Bug
prerf      # 性能（提高性能的代码更改，比如，提升性能、体验）
refactor   # 重构（即不是新增功能，也不是修改 bug 的代码变动）
style      # 格式（不影响代码运行的变动，比如：空白、换行、分号等）
test       # 测试（增加测试或更正现有测试）
revert     # 回滚（回滚到某一个版本，带上版本号）
```

如果 type 为 feat 和 fix，则该 commit 将肯定出现在 Change log 之中。其他情况（docs、chore、style、refactor、test）建议不要放入 Change log。

* scope

scope 用于说明 commit 影响的范围，比如框架中的数据层、控制层、视图层，或业务中某个业务模块，视具体项目的不同而不同，比如：user 用户、pay 支付、product 产品、article 文章、core 核心、router 路由、api 接口、doc 文档...

* subject

subject 是 commit 目的的简短描述，不超过 50 个字符。

```
以动词开头，使用第一人称现在时，比如 change，而不是 changed 或 changes
第一个字母小写
结尾不加句号（.）
```

常用表述语有：add、change、update、remove、delete。

### Body

Body 部分是对本次 commit 的详细描述，可以分成多行。有两个注意点：

```
使用第一人称现在时，比如使用 change 而不是 changed 或 changes。
应该说明代码变动的动机，以及与以前行为的对比。
```

### Footer

Footer 部分只用于两种情况。

* 不兼容变动

如果当前代码与上一个版本不兼容，则 Footer 部分以 BREAKING CHANGE 开头，后面是对变动的描述、以及变动理由和迁移方法。

```
BREAKING CHANGE: isolate scope bindings definition has changed.
...略
```

* 关闭 Issue 或 Pull requests

在开源的项目中，如果当前 commit 针对某个 issue 或 pr，那么可以在 Footer 部分关闭这个 issue 或 pr。

例如：

```
Fixes #21388
PR Closes #234
```

常用的表述语有：close、fix、resolve。

### Revert

还有一种特殊情况，如果当前 commit 用于撤销以前的 commit，则必须以 revert: 开头，后面跟着被撤销 Commit 的 Header。

```
revert: feat(pencil): add 'graphiteWidth' option

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
```

Body 部分的格式是固定的，必须写成 This reverts commit <hash>.，其中的 hash 是被撤销 commit 的 SHA 标识符。

如果当前 commit 与被撤销的 commit 在同一个发布（release）里面，那么它们都不会出现在 Change log 里面。如果两者在不同的发布，那么当前 commit，会出现在 Change log 的 Reverts 小标题下面。


## 设置 Commit Message Template

通过设置全局 .gitconfig 来指定 commit message 模板。

* 通过命令行

```
git config --global commit.template /d/commit-template
```

* 通过 TortoiseGit

依次点击：

```
settings -> Git -> Edit global .gitconfig
```

然后编辑这个全局 .gitconfig 文件，在其末尾加入 commit 字段：

```
[user]
    email = 240866271@qq.com
    name = Tracy
[winUpdater]
    recentlySeenVersion = 2.17.0.windows.1
[credential]
    helper = manager
[commit]
  template = d:/commit-template
```

## 生成 Change Log

如果你的所有 Commit 都符合 Angular 格式，那么发布新版本时， Change log 就可以用脚本自动生成 [CHANGELOG.md](https://github.com/angular/angular/blob/master/CHANGELOG.md)。

生成的文档包括以下三个部分：

```
New features
Bug fixes
Breaking changes.
```

每个部分都会罗列相关的 commit ，并且有指向这些 commit 的链接。当然，生成的文档允许手动修改，所以发布前，你还可以添加其他内容。

[conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) 就是生成 Change log 的工具，运行下面的命令即可。

```
npm install -g conventional-changelog-cli
cd my-project
conventional-changelog-cli -p angular -i CHANGELOG.md -s
```

上面命令不会覆盖以前的 Change log，只会在 CHANGELOG.md 的头部加上自从上次发布以来的变动。

如果你想生成所有发布的 Change log，要改为运行下面的命令。

```
conventional-changelog-cli -p angular -i CHANGELOG.md -w -r 0
```

为了方便使用，可以将其写入 package.json 的 scripts 字段。

```
{
  "scripts": {
    "changelog": "conventional-changelog-cli -p angular -i CHANGELOG.md -w -r 0"
  }
}
```

以后，直接运行下面的命令即可。

```
npm run changelog
```
