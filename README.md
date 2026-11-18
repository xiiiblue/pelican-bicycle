# 鹈鹕骑自行车·模型生成对比

把同一道“鹈鹕骑自行车”题目交给不同模型，在同一个页面查看它们生成的HTML动画。首页可以按模型名称或系列查找作品，也可以单独打开原始演示。

## 本地预览

在仓库根目录运行：

```bash
python3 -m http.server 8000
```

打开`http://localhost:8000`。网站由静态文件组成，无需安装依赖或构建。

## 添加模型演示

1. 把模型生成的独立HTML文件放到仓库根目录。文件名沿用`pelican-bicycle-<模型名>.html`的格式。
2. 在`assets/works.js`的`works`数组中添加一项。填写显示名称、模型系列和文件名：

   ```js
   { name: "示例模型", family: "示例系列", file: "pelican-bicycle-example.html" },
   ```

3. 如需缩略图，可以截取动画画面，保存为`assets/previews/example.webp`，并在该项中补上`thumbnail: "example.webp"`。现有缩略图采用256×168像素。省略缩略图时，目录会显示自行车图标。

目录、筛选选项和作品数量会随清单更新。清单第一项是默认演示，上一项、下一项按清单顺序循环切换。切换演示后，可以复制地址栏中带`?work=`的链接分享当前作品。

## 部署

推送到GitHub仓库的`main`分支后，GitHub Actions会自动部署到GitHub Pages。首次部署前需在仓库设置的Pages页面中，把部署来源设为GitHub Actions。
