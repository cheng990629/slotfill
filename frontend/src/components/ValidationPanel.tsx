import { useMemo, useState } from 'react'
import { VALIDATION_SUMMARY, VALIDATION_CASES } from '../data/validation'

// 验证集面板：数据来自后端 validation/report.json 自动生成，不是手写数字。
// 筛选、求和都用 useMemo，50 行表格在任何设备上都不需要分页也能瞬间渲染。
export function ValidationPanel() {
  const [type, setType] = useState('全部')
  const [style, setStyle] = useState('全部')
  const types = useMemo(() => ['全部', ...Array.from(new Set(VALIDATION_CASES.map((c) => c.type)))], [])
  const rows = useMemo(
    () =>
      VALIDATION_CASES.filter(
        (c) => (type === '全部' || c.type === type) && (style === '全部' || c.style === style),
      ),
    [type, style],
  )
  const avg = rows.length ? rows.reduce((s, c) => s + c.score, 0) / rows.length : 0
  const imperfect = VALIDATION_CASES.filter((c) => c.score < 1)

  return (
    <section className="panel">
      <h2>验证集：50 个用例，代码档实测</h2>
      <p className="panel-desc">
        10 种文档 × 5 个变体，md 23、txt 13、docx 14；每个变体 4 都是错版 + 标题错乱，
        docx 含真实表格和真实图片。语义槽不计入抽取分（它只能靠模型归纳），单独上报。
        整体 {VALIDATION_SUMMARY.overall}，结构化 {VALIDATION_SUMMARY.byStyle.structured}，
        错版 {VALIDATION_SUMMARY.byStyle.malformed}，50 个用例合计 {VALIDATION_SUMMARY.totalElapsed} 秒，
        平均 {VALIDATION_SUMMARY.avgElapsed} 秒/个，LLM 调用 0 次。
      </p>
      <div className="form-row">
        <label>类型<select value={type} onChange={(e) => setType(e.target.value)}>{types.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label>变体<select value={style} onChange={(e) => setStyle(e.target.value)}><option>全部</option><option>structured</option><option>malformed</option></select></label>
        <span className="badge ok">当前筛选平均分 {avg.toFixed(4)}（{rows.length} 个）</span>
      </div>
      <table className="table">
        <thead><tr><th>用例</th><th>类型</th><th>格式</th><th>变体</th><th>得分</th><th>耗时（秒）</th></tr></thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id}>
              <td><code>{c.id}</code></td><td>{c.type}</td><td>{c.format}</td><td>{c.style}</td>
              <td><span className={c.score === 1 ? 'badge ok' : 'badge warn'}>{c.score.toFixed(4)}</span></td>
              <td>{c.elapsed.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="note">
        未满分的 6 个全是错版：{imperfect.map((c) => c.id).join('、')}。
        结论是不再为这 6 个调模板——它们就是混合 / LLM 档的用武之地，调模板会把通用规则调偏。
      </p>
    </section>
  )
}
