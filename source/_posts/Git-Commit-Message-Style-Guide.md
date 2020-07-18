---
title: Git Commit Message Style Guide
date: 2019-04-20 16:44:35
tags:
categories: project
---

在 Git 中，我们使用 `git commit -m "xxx"` 来提交代码，参数 `-m` 用来指定 Commit Message（提交说明），直接执行 `git commit` 会进入编辑器模式，可提交多行说明。Commit Message 应规范化，规范化的 Commit Message 能带来很多好处：

<!-- more -->

```
* 提交说明明确，方便快速浏览和查找，比如 git log --pretty=format:%s, git log HEAD --grep feature
* 可以直接从 Commit Message 生成 Change Log
```

目前，社区中有很多 Commit Message 规范，本文介绍 Angular Commit Message 规范，因其合理、系统，且有配套工具，在社区中得到来广泛的应用。

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

type 用于说明 Commit 的类别，只允许使用下面 9 个标识。

```
* build      # 构建过程或辅助工具的变动。影响构建系统或外部依赖关系的更改（比如：Gulp、Broccoli、NPM）
* ci         # 配置文件（对 CI 配置文件和脚本的更改，比如：Travis、Circle、BrowserStack、SauceLabs）
* docs       # 文档（Documentation，比如 Readme、Changelog、Contribute 等等）
* feat       # 新功能（Feature）
* fix        # 修复 Bug
* prerf      # 性能（提高性能的代码更改，比如，提升性能、体验）
* refactor   # 重构（即不是新增功能，也不是修改 bug 的代码变动）
* style      # 格式（不影响代码运行的变动，比如：空白、换行、分号等）
* test       # 测试（增加测试或更正现有测试）
* revert     # 回滚（回滚到某一个版本，带上版本号）
```

如果 type 为 feat 和 fix，则该 Commit 将肯定出现在 Change Log 之中。其他情况（docs、chore、style、refactor、test）建议不要放入 Change Log。

* scope

scope 用于说明 Commit 影响的范围，比如框架中的数据层、控制层、视图层，或业务中某个业务模块，视具体项目的不同而不同，比如：user 用户、pay 支付、product 产品、article 文章、core 核心、router 路由、api 接口、doc 文档...

* subject

subject 是 Commit 目的的简短描述，不超过 50 个字符。

```
* 以动词开头，使用第一人称现在时，比如 change，而不是 changed 或 changes
* 第一个字母小写
* 结尾不加句号（.）
```

常用表述语有：add、change、update、remove、delete。

### Body

Body 部分是对本次 Commit 的详细描述，可以分成多行。有两个注意点：

```
* 使用第一人称现在时，比如使用 change 而不是 changed 或 changes
* 应该说明代码变动的动机，以及与以前行为的对比
```

### Footer

Footer 部分只用于两种情况。

* 不兼容变动

如果当前代码与上一个版本不兼容，则 Footer 部分以 BREAKING CHANGE 开头，后面是对变动的描述、以及变动理由和迁移方法。

```
BREAKING CHANGE: isolate scope bindings definition has changed.
...
```

* 关闭 Issue 或 Pull requests

在开源的项目中，如果当前 commit 针对某个 issue 或 pr，那么可以在 Footer 部分关闭这个 issue 或 pr。例如：

```
Fixes #21388
PR Closes #234
```

常用的表述语有 sclose、fix、resolve。

### Revert

还有一种特殊情况，如果当前 Commit 用于撤销以前的 Commit，则必须以 `revert:` 开头，后面跟着被撤销 Commit 的 Header。

```
revert: feat(pencil): add 'graphiteWidth' option

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
```

Body 部分的格式是固定的，必须写成 This reverts commit <hash>.，其中的 Hash 是被撤销 Commit 的 SHA 标识符。

如果当前 Commit 与被撤销的 Commit 在同一个发布（Release）里面，那么它们都不会出现在 Change Log 里面。如果两者在不同的发布，那么当前 Commit，会出现在 Change Log 的 Reverts 小标题下面。


## 设置 Commit Message Template

通过设置全局 .gitconfig 来指定 Commit Message 模板。

```
git config --global commit.template /d/commit-template
```

TortoiseGit 中可通过依次点击 `settings -> Git -> Edit global .gitconfig`，然后编辑这个全局 .gitconfig 文件，在其末尾加入 commit 字段配置。

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

Change Log 是发布新版本时，用来说明与上一个版本差异的文档。如果所有 Commit Message 都符合 Angular Commit Message 规范，那么发布新版本时，可以用 [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) 这个工具自动生成 [CHANGELOG.md](https://github.com/angular/angular/blob/master/CHANGELOG.md)。

```
npm install -g conventional-changelog-cli
cd my-project
conventional-changelog-cli -p angular -i CHANGELOG.md -s
```

上面命令不会覆盖以前的 Change Log，只会在 CHANGELOG.md 的头部加上自从上次发布以来的变动。如果想要生成所有发布的 Change Log，要运行下面的命令：

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

生成的文档包括以下三个部分：

```
* New features
* Bug fixes
* Breaking changes.
```

每个部分都会罗列相关的 Commit ，并且有指向这些 Commit 的链接。当然，生成的文档允许手动修改，所以发布前，还可以添加其他内容。
