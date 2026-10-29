import { memo, useMemo } from 'react'
import type { FillResult, Trace } from '../types'

// 扁平化：对象按属性展开、数组按下标展开，这样结果表一行就是一个“槽位证据”，
// 用户不用在嵌套 JSON 里翻。useMemo 保证只有结果变了才重算。
function flatten(value: unknown, prefix: string, rows: { key: string; value: string; status: string }[]) {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) flatten(v, prefix ? `${prefix}.${k}` : k, rows)
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => flatten(v, `${prefix}[${i}]`, rows))
  } else {
    rows.push({
      key: prefix,
      value: value === null || value === undefined ? '—' : typeof value === 'object' ? JSON.stringify(value, null, 0) : String(value),
      status: value === null || value === undefined ? '缺失' : '已填',
    })
  }
}

const Row = memo(function Row({ row }: { row: { key: string; value: string; status: string } }) {
  return (
    <tr>
      <td><code>{row.key}</code></td>
      <td className="value-cell">{row.value}</td>
      <td><span className={row.status === '已填' ? 'badge ok' : 'badge warn'}>{row.status}</span></td>
    </tr>
  )
})

export function ResultPanel({ result, trace }: { result: FillResult; trace: Trace | null }) {
  const rows = useMemo(() => {
    const out: { key: string; value: string; status: string }[] = []
    flatten(result, '', out)
    return out
  }, [result])
  const filled = rows.filter((r) => r.status === '已填').length
  const missing: string[] = (trace?.missing as string[] | undefined) ?? []
  const warnings: string[] = (trace?.warnings as string[] | undefined) ?? []

  function download() {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'filled-slots.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function copy() {
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
  }

  return (
    <div className="result">
      <div className="result-head">
        <h3>提取结果</h3>
        <span className="badge ok">已填 {filled} / {rows.length}</span>
        {trace?.extractor_used && <span className="badge">实际档位：{trace.extractor_used}</span>}
        {trace?.llm_calls !== undefined && <span className="badge">LLM 调用：{trace.llm_calls} 次</span>}
        {trace?.elapsed_seconds !== undefined && <span className="badge">耗时：{trace.elapsed_seconds} 秒</span>}
        <button className="ghost" onClick={download}>下载 JSON</button>
        <button className="ghost" onClick={() => void copy()}>复制 JSON</button>
      </div>
      <table className="table">
        <thead><tr><th>槽位</th><th>值</th><th>状态</th></tr></thead>
        <tbody>{rows.map((r) => <Row key={r.key} row={r} />)}</tbody>
      </table>
      {missing.length > 0 && (
        <p className="note">缺失（必填未找到，程序如实留空，不编造）：<code>{missing.join('、')}</code></p>
      )}
      {warnings.length > 0 && (
        <p className="note">校验提示：{warnings.slice(0, 8).join('；')}</p>
      )}
      <details>
        <summary>查看完整 JSON</summary>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </details>
      {trace && (
        <details>
          <summary>查看处理轨迹（trace：档位、分块数、耗时、LLM 调用数）</summary>
          <pre>{JSON.stringify(trace, null, 2)}</pre>
        </details>
      )}
    </div>
  )
}
