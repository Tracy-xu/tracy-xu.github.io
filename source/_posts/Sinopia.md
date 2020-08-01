---
title: npm 私仓
date: 2019-7-1
categories: project
---

npm 私仓可用于提高包的下载速度和保护内部代码，常见的 npm 私仓技术方案有以下几种：

```
* npm on-site。缺点是收费，而且 npm 在国内访问慢
* Git + SSH 直接引用到 GitHub 项目地址。缺点是不能更新（npm update），不能使用 Semver（语义化版本规范），而且 URL 不美观
* cnpm
* Sinopia/Verdaccio
* Nexus
```

<!-- more -->

## Sinopia/Verdaccio

Sinopia 是一个零配置的私有的带缓存功能的 npm 包管理工具。使用 Sinopia，不用安装 CouchDB 或 MYSQL 之类的数据库，Sinopia 有自己的迷你数据库，如果要下载的包不存在，它将自动去你配置的 npm 地址上去下载，而且硬盘中只缓存你现在过的包，以节省空间。

Sinopia 特点：

```
* 不同步拉取 npm 库，占据大量硬盘，没有硬盘被撑爆的问题
* 安装配置极其简单，不需要数据库
* 支持配置上游 Registry 配置，一次拉取即缓存
* 支持 Forever 及 Pm2 守护进程管理
```

注意：由于 Sinopia 已经没人维护了，推荐使用 [Verdaccio](https://github.com/verdaccio/verdaccio)，Verdaccio 是 Sinopia 的 Fork，安装配置基本和 Sinopia 一致。

### 安装

安装 Sinopia 前，首先要确保已经安装 Node，Linux 下安装 Node 参考具体章节。

```
npm install sinopia -g
```

Sinopia 目录结构如下：

```
# 程序安装目录（全局安装目录在不同配置下会不一样）
|-- /usr/sbin/nodejs/lib/node_modules/sinopia/

# 配置和存储目录
|-- /root/.config/sinopia/
    |-- config.yaml  # 配置文件
    |-- htpasswd     # 用户和密码信息
    |-- storage      # 包存储位置（除了 publish 的私包，通过 npm install xx 安装的公共包也会缓存到这个目录，安装过的包再次安装时会直接从这个目录取）
```

### 启动

```
sinopia
```

启动成功后，会有下面两行提示：

```
warn  --- config file  - /root/.config/sinopia/config.yaml
warn  --- http address - http://0.0.0.0:4873/
```

上面一行是 Sinopia 的配置文件所在路径，下面一行是 Sinopia 服务的域名和端口号。然后打开 `http://localhost:4873`（可通过 curl），如果能正常访问，说明安装成功。

* 网络访问

默认情况下只能本机 `localhost:4873` 访问，如果想通过 IP 让其他机器也能访问到，需要在 `/root/.config/sinopia/config.yaml` 最后一行添加：

```
listen: 0.0.0.0:4873
```

好了，再试一次 `192.168.10.14:4873`，成功访问。如果还不行，可能是防火墙导致，默认情况下防火墙没有开放 4873 端口，需要开放相应的端口。CentOS 6 和 CentOS 7 不一样，以 CentOS 6 为例。

```
# 进入编辑防火墙配置文件（修改 OUTPUT ACCEPT 下的内容）
vim /etc/sysconfig/iptables

# 然后加上下面这句（作用是防止防火墙占用80端口）
-A INPUT -p tcp -m tcp --dport 80 -j ACCEPT

# 再加上下面这一句（开放 4873 端口）
-A INPUT -m state --state NEW -m tcp -p tcp --dport 4873 -j ACCEPT

# 最后记得重启一下防火墙
/etc/init.d/iptables restart
```

* PM2 做守护进程

Node 服务非常脆弱，一般在实际中使用都会配合守护进程。这里选用 PM2 做守护进程。

```
# 全局安装 PM2
npm install -g pm2

# 通过 PM2 启动 Sinopia
pm2 start `which sinopia`
```

注：更多 PM2 操作指南参考相关文档。另外，如果想要结束 PM2 守护的 Sinopia 进程，可使用以下方法。

```
pm2 stop sinopia    # 参数也可以是具体的 PM2 id（不是 pid），比如 pm2 stop 0
```

也可以手动结束，操作步骤如下。

```
# 显示所有进程
ps -A

# 查询结果如下
3239 ?         00:00:31 watch
6035 ?         00:00:11 PM2 v2.10.3: Go
27690 ?        00:00:01 sinopia
...

# 杀掉 watch 和 sinopia 这两个进程
kill 3239
kill 27690
```

## 服务端配置

### 配置文件说明

```
#
# This is the default config file. It allows all users to do anything,
# so don't use it on production systems.
#
# Look here for more config file examples:
# https://github.com/rlidwka/sinopia/tree/master/conf
#

# path to a directory with all packages
storage: ./storage                     # npm 包存放的路径（可以将将此目录指向其他目录）

auth:
  htpasswd:
    file: ./htpasswd                   # 用于存储 npm 用户的账号和密码信息
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    #max_users: 1000                   # 最大允许的用户数量，默认值为 1000，-1 则为禁止注册

# a list of other known repositories we can talk to
uplinks:
  npmjs:
    url: https://registry.npmjs.org/   # 上游源，默认为 npm 的官网，可以使用淘宝的 npm 镜像地址

packages:                              # 配置权限管理
  '@*/*':
    # scoped packages
    access: $all                       # 表示哪一类用户可以对匹配的项目进行安装。$all 所有人，$authenticated 通过验证的人，$anonymous 匿名者
    publish: $authenticated            # 表示哪一类用户可以对匹配的项目进行发布
    proxy: npmjs                       # 默认没有这项
    
  '*':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    #
    # you can specify usernames/groupnames (depending on your auth plugin)
    # and three keywords: "$all", "$anonymous", "$authenticated"
    access: $all                       # 表示哪一类用户可以对匹配的项目进行安装

    # allow all known users to publish packages
    # (anyone can register by default, remember?)
    publish: $authenticated            # 表示哪一类用户可以对匹配的项目进行发布

    # if package is not available locally, proxy requests to 'npmjs' registry
    proxy: npmjs                       # 如其名，这里的值是对应于 uplinks

# log settings
logs:
  - {type: stdout, format: pretty, level: http}
  #- {type: file, path: sinopia.log, level: info}

listen: 0.0.0.0:4873                   # 默认没有这项，只能在本机访问，添加后可以通过外网访问
```

部分配置字段意义

```
storage    # 仓库保存的路径
auth       # 验证相关
uplinks    # 配置上游的 npm 服务器，主要是用于请求的仓库不存在时去上游服务器拉取
packages   # 配置模块/包的发布(publish)、下载(access)的权限等
listen     # 配置监听端口与主机名
```

* auth 配置

max_users: -1 表示我们将最大用户数设置为－1，表示禁用 npm adduser 命令来创建用户，不过我们仍然可以通过当前目录下的 htpasswd 文件来初始化用户。

示例：
```
yorkie:{SHA}?????????????????=:autocreated 2016-02-05T15:33:46.238Z
weflex:{SHA}????????????????=:autocreated 2016-02-05T15:39:19.960Z
james:{SHA}????????????????=:autocreated 2016-02-05T17:59:05.041Z
```

上面的加密算法也很简单，就是简单的 SHA1 哈稀之后再转换成 Base64 输出就好，后面跟着的只是表示时间。

* packages 配置

配置大致分为两个部分，一个是以 `@*/*` 为开头的，另一个则是通配符 `*`。

这个当然就是对 package.json 中的 name 字段进行匹配，比如 @webassemblyjs/ast@1.3.1 将匹配第一个配置，而 express 则匹配第二个。这里这么配置的意义在于：一般团队或者公司的私有项目，会采用不同的权限控制，于是这里借用了 npm 的 scoped name 即 @company 的形式，例如 @weflex/app 即表示 WeFlex 下属的 app 项目了。

接下来，每一个命名过滤器（filter）下都有三项基本设置：

```
access    # 表示哪一类用户可以对匹配的项目进行安装(install)
publish   # 表示哪一类用户可以对匹配的项目进行发布(publish)
proxy     # 如其名，这里的值是对应于 uplinks 的
```

对于 1 和 2 的值，我们通常有以下一些可选的配置：

```
$all            # 表示所有人都可以执行对应的操作
$authenticated  # 表示只有通过验证的人可以执行对应操作
$anonymous      # 表示只有匿名者可以进行对应操作（通常无用）
```

或者也可以指定对应于之前我们配置的用户表 htpasswd 中的一个或多个用户，这样就明确地指定哪些用户可以执行匹配的操作。

* 为 packages 中 `@*/*` 字段配置代理源

`'@*/*'` 下添加 `proxy: npmjs` 配置，给 scoped packages（[npm 官方的定义](https://docs.npmjs.com/misc/scope)） 添加代理源，使得能够安装 scoped packages 类型的包（比如 @webassemblyjs/ast@1.3.1）。如果不配置此项，安装基本的包没有问题，但是，安装 scoped packages 包时，比如  webpack，会提示错误：

```
$ npm install webpack

# 出现以下错误
npm ERR! code E404
npm ERR! 404 Not Found: @webassemblyjs/ast@1.3.1

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\Administrator\AppData\Roaming\npm-cache\_logs\2018-05-09T06_26_23_190Z-debug.log
```

这是在安装 @webassemblyjs/ast@1.3.1 这个包时出的问题，sinopia 会提示 404。上面安装的包就是这类的包，常见的有 @angular @type 等。修改配置和代码后，重启 sinopia，这时再次安装就会提示成功。

如果还不成功，可能就是老版本 sinopia 的 bug 导致的（我这版中没出息这个问题），sinopia 每次向 npmjs 请求安装某个包时，请求地址都是转码后再向 npm 请求的，所以会将 @ 转码为 %40，但是 npm 不能识别 %40，所以导致 404 的错误。

这个时候只需要修改 sinopia 中的转码的地方就可以了。转码的文件是 up-storage.js,，修改 up-storage.js 中的 encode 为：

```
var encode = function (url) {
  return encodeURIComponent(url).replace(/^%40/, '@');
};
```

### 用户配置

通过服务器来新建用户。服务器上将 registry 改为 http://localhost:4873：

```
npm set registry http://localhost:4873
```

然后添加用户：

```
npm adduser --registry http://localhost:4873

# 填写如下信息
user: admin
password: admin
email: admin@admin.com
```

这时 htpasswd(config.yaml 同目录) 文件下会生成相应的信息。


## 客户端使用

### 配置

```
npm set registry http://192.168.10.14:4873        # 设置 npm 源
```

```
npm adduser --registry http://192.168.10.14:4873  # 添加用户。如果不发布 npm 包，是不需要注册和登录的，登录 npm 是为了发布包
npm login                                         # 登录 npm。注，npm adduser 成功的后默认就登陆了，所以不需要再 npm login
npm whoami                                        # 检测身份
```

注：推荐用 nrm 来管理 npm 源。具体的 nrm 操作查看 node 的 npm 相关章节。

### 安装包

```
npm install xxx              # 选项有 --save (-S)、--save-dev (-D)、-g
```

### 发布包

切换到私有仓库，登录成功之后，就可以执行 npm publish 发布到这个私有 npm 上面啦，发布包的操作跟 npm 官方发布包无差别。

```
npm login                    # 登录 npm
npm publish                  # 发包
npm unpublish --force test   # 撤销发布。撤销 test 这个包，如果是在当前包的根目录下操作，可以省略包名
```

发布包注意事项：

```
* 包的名称和版本就是你项目里 package.json 里的 name 和 version，author 字段可以显示包的作者，为空则表示匿名
* 不能和已有的包的名字重名，发布前可通过 npm 的查找是否已存在相同名称的包（npm search xxx）
* npm 对包名的限制：不能有大写字母/空格/下滑线（testPublish、test_publish 都会又报错）
```

## 使用 Docker 安装 Verdaccio

参考 Docker 安装 Verdaccio [文档](https://verdaccio.org/docs/en/docker.html)。

### 安装镜像

```
docker pull verdaccio/verdaccio    # 拉取 Verdaccio 的 Docker Image，不指定版本下，拉取的是 latest
```

### 配置镜像

* 新建宿主机目录

```
# 在宿主机上新建需要挂载到的目录（路径可自选）
mkdir /home/kpg/verdaccio
mkdir /home/kpg/verdaccio/conf
mkdir /home/kpg/verdaccio/storage
```

```
# 拉取配置文件 config.yaml
cd /home/kpg/verdaccio/conf
git clone https://github.com/verdaccio/docker-examples
mv docker-examples/docker-local-storage-volume/conf/config.yaml config.yaml
rm -rf docker-examples    # config.yaml 复制好后，删除这个目录
```

注：如果没有将 config.yaml 配置文件放在 `/home/kpg/verdaccio/conf/` 目录下，会导致浏览器将访问不了，`docker run` 看不出错误，只有通过 `docker logs` 查找日志，才能发现问题。

```
docker ps                # 找到 verdaccio container id
docker logs containerId  # 查找日志
```

* 设置宿主机目录权限

`mkdir verdaccio` 创建的目录属主是当前宿主机用户，而每个 docker container 都会运行在自建的用户上。所以要注意挂载目录的权限，要不然 `npm adduser` 和 `npm install` 无法写入，提示 500 服务器错误，查看容器日志会有下面这样的提示：

```
docker logs --tail 20 verdaccio
EACCES: permission denied, open '/verdaccio/conf/htpasswd'
```

```
docker exec -it verdaccio sh    # 进入容器查找容器的用户 ID（进入后 Shell 前缀变成了 ~）。直接在宿主机里面 cat /etc/passwd 查找不到
whoami                          # 查看当前用户
cat /etc/passwd                 # 找到当前用户的 User ID (10001) 和 Group ID (65533)。docker 容器中的 uid 和 gid 和宿主机是共享的，只是没有具体名称
exit                            # 退出容器
chown -R 10001:65533 verdaccio  # 在宿主机下设置目录权限。-R 表示递归设置
```

* 挂载宿主机目录

可以在启动时通过 `-v` 将宿主机目录挂载到容器内目录，也可以通过 docker-compose.yml 来配置 volumes。

* 配置 config.yaml

基本配置参考上面，storage、htpasswd 要指向容器内目录，uplinks 可以使用淘宝 npm 私仓：

```
storage: /verdaccio/storage
auth:
  htpasswd:
    file: /verdaccio/conf/htpasswd
uplinks:
  npmjs:
    url: https://registry.npm.taobao.org/
```

### 启动镜像

如果将启动参数放在命令中，做成脚本文件来启动会更加方便（如果用 docker-compose 启动，将参数放在 docker-compose.yml 中也很方便）：

```
docker run -d \
	--name verdaccio \
	--restart always \
	-p 4873:4873 \
	-v /home/kpg/verdaccio/conf:/verdaccio/conf \
	-v /home/kpg/verdaccio/storage:/verdaccio/storage \
	-v /home/kpg/verdaccio/plugins:/verdaccio/plugins \
	verdaccio/verdaccio
```

`-v` 用于挂载宿主机的一个目录，`:` 前面的目录是宿主机目录，后面的目录是容器内目录。

* 一个错误

`npm publish` 时出现了一个错误：

```
...
npm ERR! code E503
npm ERR! 503 Service Unavailable - PUT http://npm.kpg123.com/sdf - one of the uplinks is down, refuse to publish
```

查看 [Issues](https://github.com/verdaccio/verdaccio/issues/78) 和[配置文档](https://verdaccio.org/docs/en/configuration.html#offline-publish)发现，By default verdaccio does not allow to publish when the client is offline, that behavior can be overridden by setting this to true.

```
publish:
  allow_offline: true
```

### Nginx 反向代理

如果 nginx 直接安装在宿主机，直接 `/etc/nginx/conf.d` 下新建 nginx.conf 文件，填入以下内容即可：

```
upstream npm {
    server 127.0.0.1:4873;
}

server {
    listen 80;
    server_name npm.kpg123.com;
    charset utf-8;

    location / {
        proxy_pass http://npm;
        proxy_set_header Host $host;
    }
}
```

修改客户端 host，然后就可以通过域名访问了。

```
192.168.10.101 npm.kpg123.com
```
