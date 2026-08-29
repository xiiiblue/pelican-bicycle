# 鹈鹕骑自行车·模型生成对比

同一道“鹈鹕骑自行车”题目由11个不同模型生成的HTML动画合集。

## 本地预览

```bash
python3 -m http.server 8000
```

打开`http://localhost:8000`即可浏览。

## 部署

推送到GitHub仓库的`main`分支后，GitHub Actions会自动部署到GitHub Pages。首次部署前需要在仓库的`Settings → Pages → Build and deployment → Source`中选择`GitHub Actions`。
