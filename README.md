# Bilibili-Download B站视频下载器

一款使用Node.JS + ELECTRON编写的B站下载器。

## 目录

- 特色
- 文件结构
- 下载

## 特色

- 多平台版本支持，支持Windows，Linux。

- 结合bilibili手机客户端，获取用户SSESSDATA。

- 支持解析下载https中带有ss、ep、av类型的视频

## 文件结构

- src  // 文件源代码

  - API // 各功能模块

    - AVURL.js

      *解析开头为AV的url，因为AV号后跟的就是aid，直接获取获取cid号*

    - EPURL.js

      *输入开头为ep的url, 爬取页面获取视频aid*

    - getLoginInfo.js

      *获取登录状态*

    - getLoginUrl.js

      *二维码登录*

    - SSURL.js

      *解析开头为ss的url，获取整季的aid和cid*

- LICENSE
- README.md

## 下载

Linux下载地址

// Todo

window下载地址

// Todo