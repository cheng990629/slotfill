# 槽位填充工作台 · 前端

Vite + React 18 + TypeScript。设计见前端“架构与 React 设计”页，也见方案文档第 6、7 章。

## 在本机访问看效果（两条命令，两个终端）

终端 1（后端，slot-filling-backend 目录）：

```bash
python run.py --port 8000
```

终端 2（本前端目录）：

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:5173

- “提取”页：点“一键体验示例合同”→“开始提取”，看结果表、缺失、trace。
- “50 个文件”页：点左侧任一用例，看文档原文、槽位、标准答案；点“用这个用例跑提取”，
  看跑出来的结果和标准答案逐键对比；勾选多个点“下载选中”拿原文件。
- “验证集”页：50 个用例的分数表，可按类型 / 变体筛选。
- 如果只看界面不跑提取，不用启动后端；提取按钮会如实报“后端未启动”，不会显示假成功。

## 生产构建

```bash
npm run build   # 产物在 dist/
npm run preview # 本地预览构建产物，http://localhost:5173
```

开发时 /api 代理到 http://127.0.0.1:8000（见 vite.config.ts）；
生产部署时把前端静态文件和后端同域部署，或设置 VITE_API_BASE 指向后端地址。

## 目录

- src/components：Header / Hero / ExtractPanel（容器）/ ResultPanel / CaseBrowser /
  ValidationPanel / ArchitecturePanel / MascotLogo
- src/hooks/useFillJob.ts：提交 → 轮询 → 取结果 → 取 trace 的状态机
- src/api.ts / src/types.ts：唯一碰 fetch 的地方 + 后端契约
- src/data：验证集分数、50 个用例文件清单（构建时由后端报告生成）
- public/assets：AI 生成的主视觉、吉祥物图片与动画视频、卡片纹理、方案插图
- public/validation-cases：后端 validation/cases 的原文件（文档 + 槽位 + 标准答案）
