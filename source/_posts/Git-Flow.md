---
title: Git Flow
date: 2019-04-25
tags:
categories: project
---

Git 工作流（Work Flow）是一种代码管理方案（版本管理、分支管理...）。在开发人员较少，项目不复杂时，可以采用简单的工作流，比如，只有一个 Master 分支，但当项目庞大，迭代周期长，开发人员多时，就需要更加严格的 Work Flow 了。在 Git 中常见的工作流有 Git Flow、GitHub Flow、GitLab Flow。一个完整的 Git Work Flow 应该满足以下需求：

```
* 多人协作和多功能并行的开发、测试、发布、热修复 -- 分支管理（develop、feature、release）
* 版本追溯 -- 标签管理（tag）
```

<!-- more -->

2010 年 5 月，Vincent Driessen 在 “[A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)” 中介绍了一种构建在 Git 之上的软件开发模型。通过利用 Git 创建和管理分支的能力，为每个分支设定具有特定的含义名称，并将软件生命周期中的各类活动归并到不同的分支上，实现了软件开发过程不同阶段的相互隔离。这种软件开发的活动模型被 Vincent 称为 “Git Flow”。

## Git Flow 基本流程

![Git Flow 流程图](/images/project/git/git-flow.jpg)

从 Git Flow 流程图可以看出，Git Flow 的核心是 Branch，通过在项目的不同阶段对 Branch 的不同操作（create、merge、rebase...）来实现一个完整的高效率的工作流程。Git Flow Branches 主要分为两大类，Main Branchs（主分支） 和 Supporting Branches（辅助分支），其中 Main Branchs 包含了 Master 和 Develop，而 Supporting Branches 包含了 Feature、Release、Hotfix 以及其他自定义分支。Main Branchs 是长期分支，存活在项目的整个生命周期中，而 Supporting branches 分支是短期分支，短期分支合并后需要删除。

```
* master -- 主分支
* develop -- 开发分支
* feature/* -- 功能分支
* release/* -- 预发布分支
* hotfix/* -- 热修复分支
```

在实践中，需求的创建、提测、发布应由项目负责人完成，普通的开发人员只需要开发功能和改 Bug。也就是说，对于 Master、Develop 这两个公共分支，只有项目负责人有操作权限，普通开发人员只有 Feature、Release、Hotfix 三个辅助分支的操作权限，这样既保证了 Master 和 Develop 的整洁，而且普通开发人员也不需掌握 Git Flow。

### Master

主分支用于发布，存放的是最稳定的正式版本。禁止在此分支上修改代码，只接受其他分支合并（Release、Hotfix）。另外，不管是用来发布 Release 还是 Hotfix，都需要打 Tag。

注：初始化时，可使用 `--allow-empty` 参数来 commit 一个空分支（`git flow init` 就是如此），`git commit --allow-empty -m "initial commit"`。

### Develop

开发分支用于日常开发，是 Feature 和 Release 分支的基础分支，存放最新的开发版（隔夜版 Nightly，是要发布到下一个 Release 的代码）。这个分支可能包含一定的 Bug（Release 还未合并的情况下），但不影响创建新的 Feature 进行新功能的开发（但是需要注意的是，假如 feature/b 基于 feature/a 的 Develop 创建，这时候的 feature/b 不能比 feature/a 早发布，如果想早发布只能将这个 feature/b 当作一个 Hotfix 了）。

跟 Master 一样，Develop 的变动也只能是合并（Feature、Release），不能是直接修改。

### Feature

功能分支用于开发新功能、代码重构、优化...，基于 Develop 创建，一般命名为 feature/xxx。新功能开发完成，会合并回 Develop 分支进入下一个 Release。

Feature 分支命名规则是，分支类型/分支发布时间-分支功能。比如：feature/20170401-fairy-flower，时间使用年月日命名，不足 2 位补 0。

### Release

预发布分支用于预发布（测试和测试阶段的 Bug 修复）。当需要发布一个新 Release 时，可以基于 Develop 分支创建一个 Release 分支，一般命名为 release/v1.0.0（关于版本号的命名规则参考相关章节），完成 Release 后，需要合并到 Master 和 Develop。

版本就是在这个阶段确定的，所以这个分支的命名会加版本后缀。版本正式发布前可生成 Changelog 文档，然后再发布上线。

### Hotfix

热修复分支，用于修改线上 Bug（比如回归时的 Bug，或者用户反馈的 Bug）。基于 Master 创建，一般命名为 hotfix/v1.0.0，测试通过后合并到 Master 分支和 Develop 分支。

## Git Flow 工具

一旦使用 Git Flow 模型，那么对分支的操作必然是频繁且重复的，这个时候可通过 [Git flow script 工具](https://github.com/nvie/gitflow)来简单化复杂的 Git 命令。

### 安装

```
# OS X
brew install git-flow

# Linux
apt-get install git-flow

# Windows
wget -q -O - --no-check-certificate https://github.com/nvie/gitflow/raw/develop/contrib/gitflow-installer.sh | bash
# Windows 上或者
curl -L -O https://raw.github.com/nvie/gitflow/develop/contrib/gitflow-installer.sh
bash gitflow-installer.sh
```

### 使用

```
git flow help          # 查看帮助
git flow feature help  # 查看 feature 帮助
```

```
# init
git flow init                           # 初始化。会询问分支的命名，初始化完成后自动切换到了 develop 分支。支持 -f -d 参数

# feature
git flow feature start MYFEATURE        # 开始一个 feature。相当于 git checkout -b feature/MYFEATURE
git flow feature publish MYFEATURE      # publish 一个 feature。相当于 git push
git flow feature pull origin MYFEATURE  # 获取 publish 的 feature
git flow feature finish MYFEATURE       # 完成一个 feature。该命令将 feature 分支合并入 develop 分支，并切换到 develop 删除 feature

# release
git flow release start MYRELEASE        # 开始一个 release。git flow release start v1.0.0，分支全称是 release/v1.0.0
git flow release publish MYRELEASE      # publish 一个 release
git flow release finish MYRELEASE       # 发布一个 release。该命令将 release 合并入 master 和 develop 并切换到 master，删除该 release，创建 tag

# hotfix
git flow hotfix start MYVERSION         # 开始一个 hotfix
git flow hotfix finish MYVERSION        # 发布一个 hotfix
```

`git flow init` 会询问分支的命名，发布和预发布这两个分支名称采用默认的 master 和 develop 即可，而其他的分支需要填写前缀，比如 `feature/`。

```
git flow init

Initialized empty Git repository in /Users/tracy-xu/Desktop/test/.git/
No branches exist yet. Base branches must be created now.
Branch name for production releases: [master] 
Branch name for "next release" development: [develop] 

How to name your supporting branch prefixes?
Feature branches? [feature/] 
Release branches? [release/] 
Hotfix branches? [hotfix/] 
Support branches? [support/] 
Version tag prefix? [] version/
```

注：Release 和 Hotfix 命令使用和 Feature 一样，只是有些细微区别，比如 `git flow release finish` 命令将会将 Release 分支合并入 Master 和 Develop 两个分支，且会打上版本号（tag 需要有 message，要不然会创建失败）。

![git-flow-commands](/images/project/git/git-flow-commands.png)

附：[Git-Flow 备忘清单](http://danielkummer.github.io/git-flow-cheatsheet/index.zh_CN.html)
