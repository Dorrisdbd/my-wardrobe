# 私人衣橱 PWA 版

这是适合 GitHub Pages 部署的纯前端 PWA 版本。

## 特点

- 不需要 Python 后端
- 不需要服务器数据库
- 数据保存在手机浏览器的 IndexedDB
- 支持添加到 iPhone 主屏幕
- 支持离线打开基础页面
- 支持导出/导入 JSON 备份

## 本地预览

在这个文件夹上一级目录运行：

```bash
python3 -m http.server 8090
```

然后打开：

```text
http://localhost:8090/wardrobe-pwa/
```

`mobile.html` 只用于在桌面浏览器中预览手机外观，不是手机上的正式入口。

## 之后在你自己的电脑上传 GitHub

只上传 `wardrobe-pwa` 文件夹里的内容即可。

GitHub Pages 推荐设置：

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/root`

如果你把 `wardrobe-pwa` 作为仓库根目录上传，手机访问地址通常是：

```text
https://你的用户名.github.io/仓库名/
```

## iPhone 使用

1. Safari 打开部署后的仓库主页地址。
2. 点分享按钮。
3. 选择“添加到主屏幕”。
4. 以后从主屏幕打开使用。

## 重要提醒

数据存在当前手机/浏览器里，不会自动同步到 GitHub。

请定期点击“导出”保存备份文件。换手机、清理 Safari 网站数据、或更换浏览器前，需要先导出备份，然后在新设备里点击“导入”恢复。
