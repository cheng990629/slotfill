import { MascotLogo } from './MascotLogo'

// 方案与设计物料页：所有物料都在前端 public/ 里，打开就能看、点就能下载，
// 不需要再回聊天记录里翻附件。Word / PPT / PDF 是方案文档的同一份内容三种形态，
// 调研 md 是全文，页内是摘要——摘要和全文出自同一份 research.md，不会出现两套说法。
export function DesignPanel() {
  function dl(url: string, name: string) {
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
  }
  return (
    <section className="panel">
      <h2>方案与设计物料</h2>
      <p className="panel-desc">
        这一页就是物料库：方案文档、设计图、技术图、视觉资产、调研全文都在这里，
        全部来自本项目的真实文件，不是为演示临时拼的图。
      </p>

      <h3>方案文档（同一份方案，三种形态）</h3>
      <div className="form-row">
        <button className="primary" onClick={() => dl('/docs/槽位填充落地方案.docx', '槽位填充落地方案.docx')}>下载方案 Word（12 章、12 张表）</button>
        <button className="primary" onClick={() => dl('/docs/槽位填充落地方案.pptx', '槽位填充落地方案.pptx')}>下载方案 PPT（16 页）</button>
        <button className="primary" onClick={() => dl('/docs/槽位填充落地方案.pdf', '槽位填充落地方案.pdf')}>下载方案 PDF（9 页，Word 转出）</button>
      </div>
      <p className="note">方案章节：强约束与输入输出、槽位定义、总体架构、时序、React 设计、ReAct 设计、四档对比、错版与标题错乱、验证集与测试、视觉设计、部署访问、风险与下一步。</p>

      <h3>设计图（代码绘制，文字无乱码）</h3>
      <img className="solution-img" src="/design/architecture.png" alt="总体架构图" />
      <div className="form-row">
        <button className="ghost" onClick={() => dl('/design/architecture.png', 'architecture.png')}>下载架构图</button>
        <button className="ghost" onClick={() => dl('/design/sequence.png', 'sequence.png')}>下载时序图</button>
        <button className="ghost" onClick={() => dl('/design/validation-by-type.png', 'validation-by-type.png')}>下载验证集图表</button>
      </div>
      <img className="solution-img" src="/design/sequence.png" alt="提取时序图" />
      <img className="solution-img" src="/design/validation-by-type.png" alt="验证集按类型得分图" />

      <h3>视觉资产（AI 生成）</h3>
      <div className="form-row">
        <MascotLogo size={120} />
        <span className="note">槽宝：奶油色长耳毛绒 + 蓝紫帽子 + 打勾的单子。主形态是 AI 动画视频（挥手、眨眼、浮动、循环），视频失败时降级图片 + CSS 动画，永不静态。</span>
      </div>
      <img className="solution-img" src="/assets/hero-bg.webp" alt="主视觉：纸张流向结构化卡片" />
      <div className="form-row">
        <button className="ghost" onClick={() => dl('/assets/mascot-animation.mp4', 'mascot-animation.mp4')}>下载吉祥物动画视频</button>
        <button className="ghost" onClick={() => dl('/assets/mascot.webp', 'mascot.webp')}>下载吉祥物图片</button>
        <button className="ghost" onClick={() => dl('/assets/hero-bg.webp', 'hero-bg.webp')}>下载主视觉</button>
        <button className="ghost" onClick={() => dl('/assets/editorial-desk.webp', 'editorial-desk.webp')}>下载编辑配图（桌面）</button>
        <button className="ghost" onClick={() => dl('/assets/editorial-contract.webp', 'editorial-contract.webp')}>下载编辑配图（合同）</button>
        <button className="ghost" onClick={() => dl('/assets/editorial-mascot.webp', 'editorial-mascot.webp')}>下载线稿吉祥物</button>
        <button className="ghost" onClick={() => dl('/assets/card-texture.webp', 'card-texture.webp')}>下载卡片纹理</button>
      </div>
      <img className="solution-img" src="/assets/editorial-desk.webp" alt="编辑配图：桌面上的文档与放大镜" />
      <img className="solution-img" src="/assets/editorial-mascot.webp" alt="线稿吉祥物：墨线长耳兔与朱砂印" />
      <p className="note">架构图、时序图、验证图表不用 AI 生成——AI 画技术图文字常成乱码，技术图由代码绘制、文字写死在代码里。视觉图（主视觉、吉祥物、插图、纹理）用 AI 生成，因为它们不需要准确文字。</p>

      <h3>调研摘要（全文可下载）</h3>
      <div className="form-row">
        <button className="primary" onClick={() => dl('/design/research.md', 'slotfill-research.md')}>下载调研全文（Markdown）</button>
      </div>
      <table className="table">
        <thead><tr><th>调研项</th><th>结论</th></tr></thead>
        <tbody>
          <tr><td>AgentScope</td><td>只借 ReAct、Toolkit、Hook、预算；不借会话记忆、工作区人格、SSE、多租户、沙箱 shell。前端“好用”是因为错误可见可打断，后端槽位错误看起来合理，所以核心是校验门 + trace。</td></tr>
          <tr><td>RAG 不精准</td><td>不用向量 RAG：结构化分块 + BM25 选块 + Python 校验门。证据是原文原句，校验是代码不是模型。</td></tr>
          <tr><td>YAML 还是 JSON</td><td>模型出 YAML、Python 转 JSON：小模型少一层转义错误，转换失败有 JSON 回退和行级回退，格式记进 trace。</td></tr>
          <tr><td>8b / 27b / 35b 适配</td><td>文本 JSON action 代替原生 tool_calls；分组 ≤8 槽；温度 0；证据约 12,000 字；模型只走 .env 配置。</td></tr>
          <tr><td>错版与标题错乱</td><td>分隔符混用、断行、重复键、中文数字、标题层级错乱都有确定性处理；未满分 6 个全是错版，不为它们调偏通用规则。</td></tr>
          <tr><td>未实测</td><td>真模型三档准确率未测（无 Key）、图片像素不 OCR——单独列出，不混进已验证结论。</td></tr>
        </tbody>
      </table>
    </section>
  )
}
