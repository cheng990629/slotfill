import { useMemo, useState } from 'react'
import { VALIDATION_CASES } from '../data/validation'
import { CASE_FILES, caseDocUrl, caseFileUrl } from '../data/cases'
import { submitFill } from '../api'
import type { FillResult } from '../types'

// 50 个文件浏览器：文件不是写死的演示数据，是后端 validation/cases 的原文件，
// 前端构建时原样拷进 public/validation-cases，打开、下载、跑提取走的都是这些真文件。
// 每个用例含：document.md/txt/docx + slots.json + gold.json + meta.json。

function downloadUrl(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  downloadUrl(url, filename)
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

function compareKeys(result: FillResult, gold: FillResult) {
  const keys = Object.keys(gold)
  const exact = keys.filter((k) => JSON.stringify(result[k]) === JSON.stringify(gold[k]))
  return { total: keys.length, exact: exact.length, differing: keys.filter((k) => !exact.includes(k)) }
}

export function CaseBrowser({ onLoadIntoExtract }: { onLoadIntoExtract: (doc: string, slots: string) => void }) {
  const [filter, setFilter] = useState('')
  const [selectedId, setSelectedId] = useState<string>('contract_00')
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [docPreview, setDocPreview] = useState('')
  const [slotsText, setSlotsText] = useState('')
  const [goldText, setGoldText] = useState('')
  const [loading, setLoading] = useState(false)
  const [runState, setRunState] = useState('')
  const [runResult, setRunResult] = useState<FillResult | null>(null)
  const [userFiles, setUserFiles] = useState<File[]>([])
  const [userPreview, setUserPreview] = useState('')
  const [userSlots, setUserSlots] = useState('')
  const [batchResult, setBatchResult] = useState('')

  const meta = useMemo(() => VALIDATION_CASES.find((c) => c.id === selectedId), [selectedId])
  const file = useMemo(() => CASE_FILES.find((c) => c.id === selectedId), [selectedId])
  const filtered = useMemo(
    () => VALIDATION_CASES.filter((c) => !filter || c.id.includes(filter) || c.type.includes(filter)),
    [filter],
  )

  async function openCase(id: string) {
    setSelectedId(id)
    setRunResult(null)
    setRunState('')
    setLoading(true)
    try {
      const f = CASE_FILES.find((c) => c.id === id)!
      const slots = await (await fetch(caseFileUrl(id, 'slots.json'))).text()
      const gold = await (await fetch(caseFileUrl(id, 'gold.json'))).text()
      setSlotsText(slots)
      setGoldText(gold)
      if (f.docFile.endsWith('.docx')) {
        setDocPreview(`这是 docx 二进制文件（${f.docBytes} 字节），浏览器里不能直接当文本预览。点“下载文档”用 Word 打开，或点“用这个用例跑提取”走后端解析——后端会读出其中的表格和图片占位。`)
      } else {
        setDocPreview(await (await fetch(caseDocUrl(id, f.docFile))).text())
      }
    } finally {
      setLoading(false)
    }
  }

  function toggleCheck(id: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function downloadSelected() {
    // 浏览器没有打包库就不假装“打包”：逐个触发下载，文件就是原文件，名字带用例 id。
    const ids = checked.size ? [...checked] : [selectedId]
    ids.forEach((id, i) => {
      const f = CASE_FILES.find((c) => c.id === id)!
      setTimeout(() => downloadUrl(caseDocUrl(id, f.docFile), `${id}-${f.docFile}`), i * 300)
      setTimeout(() => downloadUrl(caseFileUrl(id, 'slots.json'), `${id}-slots.json`), i * 300 + 100)
      setTimeout(() => downloadUrl(caseFileUrl(id, 'gold.json'), `${id}-gold.json`), i * 300 + 200)
    })
  }

  async function runCase() {
    if (!file || file.docFile.endsWith('.docx')) {
      setRunState('docx 用例请先下载文档，再到“提取”页上传文件走后端解析；这里的在线预览只支持 md / txt 文本。')
      return
    }
    setRunState('正在跑提取（代码档，0 LLM 调用）…')
    try {
      const job = await submitFill({ document_text: docPreview, slots: JSON.parse(slotsText), extractor: 'code', sync: true })
      const result = (job.data ?? {}) as FillResult
      setRunResult(result)
      const gold = JSON.parse(goldText) as FillResult
      const cmp = compareKeys(result, gold)
      setRunState(`跑完了：与标准答案逐键对比，${cmp.exact}/${cmp.total} 个顶层键完全一致；不一致的键：${cmp.differing.join('、') || '无'}。`)
    } catch (e) {
      setRunState(`跑提取失败：${e instanceof Error ? e.message : String(e)}。请确认后端已启动（后端目录 python run.py --port 8000）。`)
    }
  }

  async function previewUserFile(f: File) {
    if (f.name.endsWith('.txt') || f.name.endsWith('.md')) {
      setUserPreview(await f.text())
    } else {
      setUserPreview(`这是 ${f.name}（${f.size} 字节），浏览器里不能直接当文本预览。点“下载原文件”保存到本地，或到“提取”页上传走后端解析。`)
    }
  }

  async function runUserFiles() {
    if (!userFiles.length) { setBatchResult('请先选择文件（最多 50 个）。'); return }
    let slots: unknown
    try { slots = JSON.parse(userSlots) } catch { setBatchResult('槽位 JSON 解析失败，请检查括号和引号。'); return }
    setBatchResult('正在逐个跑提取…')
    const out: { file: string; result: FillResult }[] = []
    for (const f of userFiles) {
      if (!(f.name.endsWith('.txt') || f.name.endsWith('.md'))) continue
      const job = await submitFill({ document_text: await f.text(), slots, extractor: 'code', sync: true })
      out.push({ file: f.name, result: (job.data ?? {}) as FillResult })
    }
    downloadText('batch-results.json', JSON.stringify(out, null, 2))
    setBatchResult(`已跑 ${out.length} 个文本文件，结果已下载为 batch-results.json（每个文件一份填槽 JSON）。docx / pdf 文件未计入：请到“提取”页单独上传走后端解析。`)
  }

  return (
    <section className="panel">
      <h2>50 个文件：选、看、下载、跑效果</h2>
      <p className="panel-desc">
        下面是后端验证集的 50 个真实用例文件。点一个用例看文档原文、槽位定义和标准答案；
        勾选多个点“下载选中”拿原文件；点“跑提取”会真走后端代码档，并把结果和标准答案逐键对比——
        看到的分数不是写死的，是这次跑出来的。
      </p>
      <div className="form-row">
        <label>搜索用例<input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="如 contract、invoice、docx" /></label>
        <button className="ghost" onClick={() => setChecked(new Set(filtered.map((c) => c.id)))}>全选当前筛选</button>
        <button className="ghost" onClick={() => setChecked(new Set())}>清空勾选</button>
        <button className="primary" onClick={downloadSelected}>下载选中（文档 + 槽位 + 标准答案）</button>
        <span className="badge">已选 {checked.size} 个</span>
      </div>
      <div className="case-layout">
        <div className="case-list">
          {filtered.map((c) => {
            const f = CASE_FILES.find((x) => x.id === c.id)!
            return (
              <button
                key={c.id}
                className={selectedId === c.id ? 'case-item active' : 'case-item'}
                onClick={() => void openCase(c.id)}
              >
                <input type="checkbox" checked={checked.has(c.id)} onChange={(e) => { e.stopPropagation(); toggleCheck(c.id) }} onClick={(e) => e.stopPropagation()} />
                <code>{c.id}</code>
                <span>{c.type} · {c.format}{f.has_table ? ' · 表格' : ''}{f.has_image ? ' · 图片' : ''}</span>
                <span className={c.score === 1 ? 'badge ok' : 'badge warn'}>{c.score.toFixed(4)}</span>
              </button>
            )
          })}
        </div>
        <div className="case-detail">
          {meta && file && (
            <>
              <h3>{meta.id} <span className="badge">{meta.type} · {meta.format} · {meta.style}</span> <span className="badge">验证集得分 {meta.score.toFixed(4)}</span></h3>
              <div className="form-row">
                <button className="ghost" onClick={() => downloadUrl(caseDocUrl(meta.id, file.docFile), `${meta.id}-${file.docFile}`)}>下载文档</button>
                <button className="ghost" onClick={() => downloadUrl(caseFileUrl(meta.id, 'slots.json'), `${meta.id}-slots.json`)}>下载槽位</button>
                <button className="ghost" onClick={() => downloadUrl(caseFileUrl(meta.id, 'gold.json'), `${meta.id}-gold.json`)}>下载标准答案</button>
                <button className="primary" onClick={() => void runCase()}>用这个用例跑提取</button>
                {!file.docFile.endsWith('.docx') && <button className="ghost" onClick={() => onLoadIntoExtract(docPreview, slotsText)}>载入到提取页</button>}
              </div>
              {loading && <p className="progress">正在加载文件…</p>}
              {runState && <p className="note" aria-live="polite">{runState}</p>}
              <h4>文档原文</h4>
              <pre className="doc-preview">{docPreview || '点左侧用例加载文档。'}</pre>
              <h4>槽位定义</h4>
              <pre>{slotsText}</pre>
              <h4>标准答案</h4>
              <pre>{goldText}</pre>
              {runResult && (
                <>
                  <h4>这次跑出来的结果</h4>
                  <pre>{JSON.stringify(runResult, null, 2)}</pre>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <h3 className="section-title">你自己的文件：一次选最多 50 个</h3>
      <p className="panel-desc">
        从电脑里一次选多个文件（按住 Ctrl / Command 多选，上限 50 个），点一个看内容，
        填一份槽位 JSON 就能逐个跑提取，结果打包成一个 batch-results.json 下载。
      </p>
      <input
        type="file"
        multiple
        accept=".txt,.md,.docx,.pdf"
        onChange={(e) => {
          const files = [...(e.target.files ?? [])].slice(0, 50)
          setUserFiles(files)
          setBatchResult(files.length >= 50 ? '已取前 50 个，多余的请分批。' : '')
          if (files[0]) void previewUserFile(files[0])
        }}
      />
      <div className="user-file-list">
        {userFiles.map((f) => (
          <button key={f.name} className="ghost" onClick={() => void previewUserFile(f)}>{f.name}（{(f.size / 1024).toFixed(1)} KB）</button>
        ))}
      </div>
      <label>这批文件共用的槽位 JSON
        <textarea rows={6} value={userSlots} onChange={(e) => setUserSlots(e.target.value)} placeholder='{"slots": {"company_name": {"desc": "公司全称", "type": "string", "required": true}}}' />
      </label>
      <div className="form-row">
        <button className="primary" onClick={() => void runUserFiles()}>逐个跑提取并下载结果</button>
        {userFiles.length > 0 && <button className="ghost" onClick={() => { const f = userFiles[0]; if (f) { const url = URL.createObjectURL(f); downloadUrl(url, f.name) } }}>下载第一个原文件</button>}
      </div>
      {batchResult && <p className="note" aria-live="polite">{batchResult}</p>}
      {userPreview && <pre className="doc-preview">{userPreview}</pre>}
    </section>
  )
}
