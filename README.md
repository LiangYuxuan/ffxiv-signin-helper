# FFXIV SignIn Helper

FF14国服相关签到自动化脚本

## 功能

### 石之家

- [x] 每天签到
- [x] 领取签到奖励
- [x] 在[水贴](https://ff14risingstones.web.sdo.com/pc/index.html#/post/detail/9365)发布5条评论
- [x] 发布5条动态并删除

## 获取 Cookies

程序会依序尝试从以下途径获取Cookies
  * `.env`中的`COOKIES`
  * 环境变量`COOKIES`
  * 已配置的[CookieCloud](https://github.com/easychen/CookieCloud)服务
  * `.cookies`文件内容

### 获取现有的 Cookies

打开开发人员工具，在网络/Network选项卡内随意挑选一个`apiff14risingstones.web.sdo.com`请求，然后在请求头中找到Cookie。

### 获取新的 Cookies

石之家在使用同类型客户端登录后，旧的登录状态会失效。获取新的Cookies会使旧的电脑端登录状态失效。

```bash
# Docker
docker run --name ffxiv rhyster/ffxiv-signin-helper:latest pnpm start:cookies && docker cp ffxiv:/usr/src/app/.cookies ffxiv.cookies && docker rm -f ffxiv
# Node
pnpm install
pnpm start:cookies
```

使用叨鱼扫描显示的二维码完成登录后，工具将自动将Cookies写入.cookies文件。

### 配置 CookieCloud

配置环境变量`COOKIE_CLOUD_URL`、`COOKIE_CLOUD_UUID`和`COOKIE_CLOUD_KEY`，在同步域名关键词中加入`sdo.com`。

## 配置与运行

### Docker

```bash
vi .env
docker pull rhyster/ffxiv-signin-helper:latest
docker run --rm --env-file .env --name ffxiv rhyster/ffxiv-signin-helper:latest
```

### Node

1. 运行环境

需要环境 Node.js >= 20.10.0

2. 配置

```bash
cp .env.example .env
vi .env
```

根据注释修改，如果需要禁用某项功能，将等号后置空或者改为0。

3. 开始运行

```bash
pnpm install
pnpm build
pnpm start
```

## 许可

MIT License
