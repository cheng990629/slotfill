// 架构面板：图是手绘 SVG（文字由代码写死），不用 AI 生成架构图——
// AI 画的架构图经常把文字画成乱码，技术图必须字字准确。
export function ArchitecturePanel() {
  return (
    <section className="panel">
      <h2>架构：后端流水线 + 前端 React 设计 + ReAct Agent 设计</h2>
      <img className="solution-img" src="/assets/editorial-desk.webp" alt="编辑配图：桌面上的文档与放大镜" />
      <h3>后端架构（真实部署形态）</h3>
      <svg viewBox="0 0 900 220" className="diagram" role="img" aria-label="后端架构图">
        <rect x="10" y="70" width="130" height="80" rx="12" fill="#eef2ff" stroke="#6c5cff" />
        <text x="75" y="105" textAnchor="middle" fontSize="14">前端 React</text>
        <text x="75" y="125" textAnchor="middle" fontSize="12">工作台 / 50 文件</text>
        <rect x="190" y="70" width="130" height="80" rx="12" fill="#eef2ff" stroke="#6c5cff" />
        <text x="255" y="105" textAnchor="middle" fontSize="14">HTTP 服务</text>
        <text x="255" y="125" textAnchor="middle" fontSize="12">job + 轮询</text>
        <rect x="370" y="70" width="150" height="80" rx="12" fill="#eef2ff" stroke="#6c5cff" />
        <text x="445" y="105" textAnchor="middle" fontSize="14">解析 / 分块 / BM25</text>
        <text x="445" y="125" textAnchor="middle" fontSize="12">不走向量 RAG</text>
        <rect x="570" y="20" width="150" height="60" rx="12" fill="#fff7ed" stroke="#d97706" />
        <text x="645" y="45" textAnchor="middle" fontSize="14">代码提取</text>
        <text x="645" y="65" textAnchor="middle" fontSize="12">0 LLM 调用</text>
        <rect x="570" y="100" width="150" height="60" rx="12" fill="#fff7ed" stroke="#d97706" />
        <text x="645" y="125" textAnchor="middle" fontSize="14">LLM / 混合 / Agent</text>
        <text x="645" y="145" textAnchor="middle" fontSize="12">YAML → Python 转 JSON</text>
        <rect x="770" y="70" width="120" height="80" rx="12" fill="#ecfdf5" stroke="#059669" />
        <text x="830" y="105" textAnchor="middle" fontSize="14">校验门</text>
        <text x="830" y="125" textAnchor="middle" fontSize="12">+ 结果 JSON URL</text>
        <text x="155" y="115" fontSize="20">→</text>
        <text x="335" y="115" fontSize="20">→</text>
        <text x="535" y="115" fontSize="20">→</text>
        <text x="735" y="115" fontSize="20">→</text>
      </svg>
      <h3>时序：一次提取怎么走（非 SSE）</h3>
      <svg viewBox="0 0 900 260" className="diagram" role="img" aria-label="提取时序图">
        <text x="20" y="30" fontSize="13">1 用户提交 文档 URL + 槽位 URL + 档位 → POST /api/v1/fill → 202 job_id + result_url</text>
        <text x="20" y="70" fontSize="13">2 服务端建 job：解析文档（txt/md/docx/pdf）→ 扁平分块 → BM25 检索证据块</text>
        <text x="20" y="110" fontSize="13">3 提取：代码档直接算；LLM 档按组出 YAML、Python 转 JSON；混合档代码先行、LLM 只补缺</text>
        <text x="20" y="150" fontSize="13">4 校验门：类型 / 长度 / 枚举 / 格式 / 必填逐项过，不过的置 null 并进 trace，不编造</text>
        <text x="20" y="190" fontSize="13">5 前端每 1.5 秒轮询 job 状态 → done 后 GET result_url → 200 拿到纯填槽 JSON</text>
        <text x="20" y="230" fontSize="13">6 失败分支：job 状态 failed，错误和缺失清单一起返回，前端原样展示，不显示假成功</text>
      </svg>

      <h3>React 是怎么设计的</h3>
      <p className="panel-desc">
        技术栈：Vite + React 18 + TypeScript，生产构建是 tsc -b + vite build，产物是静态文件，
        可以和后端同域部署，也可以单独部署后把 VITE_API_BASE 指到后端。
        设计上刻意不堆框架：这个产品的状态就是“一份表单 + 一个异步任务 + 一份结果”，
        上 Redux / Zustand 是过度设计，反而让后来的人看不懂。
      </p>
      <table className="table">
        <thead><tr><th>层</th><th>文件</th><th>职责（只做这一件）</th></tr></thead>
        <tbody>
          <tr><td>入口</td><td><code>src/main.tsx / App.tsx</code></td><td>挂载、导航 tab、后端健康检查、把用例载入提取页</td></tr>
          <tr><td>容器</td><td><code>components/ExtractPanel.tsx</code></td><td>表单状态、校验输入、调 useFillJob；不直接碰 fetch</td></tr>
          <tr><td>展示</td><td><code>components/ResultPanel.tsx</code></td><td>结果扁平化成表、复制 / 下载；用 React.memo + useMemo 省重算</td></tr>
          <tr><td>展示</td><td><code>components/CaseBrowser.tsx</code></td><td>50 个文件选、看、下载、跑效果、批量自选文件</td></tr>
          <tr><td>展示</td><td><code>components/ValidationPanel.tsx</code></td><td>验证集筛选表，数据由后端报告自动生成</td></tr>
          <tr><td>展示</td><td><code>components/MascotLogo.tsx</code></td><td>吉祥物：视频动画为主，失败降级图片 + CSS 动画，永不静态</td></tr>
          <tr><td>数据</td><td><code>src/api.ts / src/types.ts</code></td><td>唯一碰 fetch 的地方 + 后端契约类型，改后端只改这里</td></tr>
          <tr><td>异步</td><td><code>src/hooks/useFillJob.ts</code></td><td>提交 → 轮询 → 取结果 → 取 trace 的状态机，四态：idle / processing / done / failed</td></tr>
          <tr><td>数据</td><td><code>src/data/validation.ts / cases.ts</code></td><td>验证集分数、文件清单，构建时由后端报告生成，不手写</td></tr>
        </tbody>
      </table>
      <p className="panel-desc">
        数据流只有一条线：表单 → useFillJob.run → api.submitFill → 轮询 job → 结果进 ResultPanel。
        没有跨组件全局状态，没有 props 层层透传超过两层；状态变化只用 transform / opacity 做动画，
        不触发布局抖动。每个状态都有 UI：加载中显示进度、失败显示后端启动命令、空状态显示示例入口，
        不会出现“点了没反应”或“空白页”。
      </p>
      <p className="panel-desc">
        组件树：App → Header / Hero /（ExtractPanel → ResultPanel）/ CaseBrowser / ValidationPanel / ArchitecturePanel。
        ExtractPanel 是容器组件，ResultPanel / ValidationPanel 是纯展示组件——这是刻意分的：
        展示组件只认 props，不认后端，改 UI 不用懂后端，改后端不用动 UI。
      </p>

      <h3>ReAct 后端 Agent 是怎么设计的</h3>
      <p className="panel-desc">
        Agent 不是默认档位，是疑难档位：小文档、语义槽、代码和 LLM 分组都搞不定的槽才用它。
        它的核心是 slotfill/harness.py 里约 150 行的最小 ReAct 骨架，不是把 AgentScope 整套搬过来。
      </p>
      <table className="table">
        <thead><tr><th>设计点</th><th>实现（以代码为准）</th><th>为什么这样定</th></tr></thead>
        <tbody>
          <tr><td>循环</td><td><code>HarnessAgent.run</code>：reason（LLM 决策）→ act（调工具）→ observe（结果喂回）</td><td>证据驱动：每一步都有原文块可查，不是一次性幻觉输出</td></tr>
          <tr><td>动作格式</td><td>每轮只输出一个文本 JSON action：<code>{"{"}action, args{"}"}</code>，不用原生 tool_calls</td><td>8b 小模型原生 tool_calls 不稳；文本 JSON 解析失败时把错误当 observation 喂回，让模型自己纠正</td></tr>
          <tr><td>工具（只读 4 个）</td><td>list_sections / search_chunks(query, top_k≤8) / read_chunk(chunk_id) / submit(values)</td><td>没有 shell、没有写文件、没有联网——提取不需要给模型开这些口子，攻击面最小</td></tr>
          <tr><td>任务提示</td><td>先 list_sections 看结构，再 search_chunks 找证据，确认后再 submit；找不到填 null</td><td>顺序写死在提示里，避免模型跳过证据直接猜</td></tr>
          <tr><td>预算</td><td>max_steps 20 步，max_llm_calls 25 次，超了就停，submit 不到就全 null + trace 报错</td><td>成本可算：最坏 25 次调用，绝不无限循环烧模型费</td></tr>
          <tr><td>钩子</td><td>只有 3 个：before_llm / after_tool / on_error</td><td>够记 trace、够排错，不搞全量中间件链</td></tr>
          <tr><td>校验闭环</td><td>submit 后走同一套 validate.py：类型 / 长度 / 枚举 / 格式 / 必填逐项过</td><td>Agent 的输出和代码档过同一道门，门后不分档位</td></tr>
          <tr><td>大文档护栏</td><td>AGENT_MAX_CHARS = 120,000 字；超了不直接跑全量 Agent</td><td>5M 文档塞不进上下文；大文档先走代码档，只把必填缺失槽交给 Agent 复查</td></tr>
          <tr><td>YAML 提交</td><td>submit 的 values 可以是 YAML 字符串，harness 用 parse_yaml_output 转 JSON</td><td>和 LLM 档同一条“YAML 出、Python 转”路线，模型少一层 JSON 转义错误</td></tr>
        </tbody>
      </table>
      <p className="panel-desc">
        Agent 在流水线里的位置（pipeline.py）：独立 agent 档直接跑 ReAct，要求必须配模型，没配就报错不装成功；
        混合 / 自动档里 Agent 只是第三阶段复查——且只有显式开启 agent_fallback、文档 ≤120K 字、
        仍有必填缺失这三个条件同时满足才触发，复查完只合并它填上的槽，不覆盖代码档已填的。
        它的 trace 全量落盘：每步的 LLM 输出（截断 2000 字）和工具结果（截断 2000 字）都在，
        出错能一步步复盘，这是它比“直接让模型出 JSON”贵、但值得的唯一理由。
      </p>
      <table className="table">
        <thead><tr><th>AgentScope 借鉴了什么</th><th>刻意没借鉴什么</th></tr></thead>
        <tbody>
          <tr><td>ReAct 循环、Toolkit 注册表、统一“工具名 + JSON 参数 + 文本结果”契约、Hook 插点</td><td>会话持久化 / 双层记忆 / 对话压缩（一次性任务，状态就是 job 的 trace 文件）</td></tr>
          <tr><td>步数 / 调用预算（step / call budget）</td><td>工作区人格注入（AGENTS.md / MEMORY.md）：槽位定义就是全部任务，注入只会污染提示</td></tr>
          <tr><td>—</td><td>流式 SSE / 多租户 RuntimeContext（强约束要求出参是结果 JSON URL，非 SSE）</td></tr>
          <tr><td>—</td><td>沙箱 shell（提取不需要，工具只限读块 / 搜块 / 提交）</td></tr>
        </tbody>
      </table>
      <p className="panel-desc">
        一句话定位：Agent 档 = “会查证据、会认错、会停手”的提取器，不是“更聪明的聊天机器人”。
        它的性价比只在疑难槽上成立；大批量、结构化文档永远先走代码档，Agent 档跑全量是浪费。
      </p>
    </section>
  )
}
