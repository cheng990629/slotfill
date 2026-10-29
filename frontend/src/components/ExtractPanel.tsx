import { useEffect, useState } from 'react'
import type { Extractor } from '../types'
import { useFillJob } from '../hooks/useFillJob'
import { ResultPanel } from './ResultPanel'

const SAMPLE_DOC = `# 服务合同

甲方：沈阳晨光科技有限公司（以下简称甲方）
乙方：大连云启软件有限公司（以下简称乙方）

## 第一条 合作内容

本合同服务类型为开发。双方约定合作期限为 2 年，属于长期合作。

## 第二条 合同金额

合同总金额为 1,250,000 元，大写壹佰贰拾伍万元整。

## 第三条 签署与联系

本合同于 2026年10月29日 签署。
甲方联系人邮箱：contact@chenguang.example.com

## 第四条 交付物

交付物包括：需求文档、原型系统、上线部署报告。`

const SAMPLE_SLOTS = `{
  "slots": {
    "company_name": {"desc": "合同甲方公司全称", "type": "string", "required": true, "length": {"max": 100}},
    "contract_amount": {"desc": "合同总金额", "type": "number", "required": true},
    "signed_date": {"desc": "合同签署日期", "type": "string", "format": "date", "required": true},
    "service_type": {"desc": "服务类型", "type": "string", "enum": ["咨询", "开发", "运维", "其他"], "required": true},
    "contact_email": {"desc": "甲方联系人邮箱", "type": "string", "format": "email", "required": false, "nullable": true},
    "is_long_term": {"desc": "是否为长期合作", "type": "boolean", "required": false},
    "deliverables": {"desc": "交付物清单", "type": "array", "items": {"desc": "单个交付物", "type": "string"}},
    "summary": {"desc": "一句话归纳本合同核心内容", "type": "semantic", "length": {"max": 100}}
  }
}`

const MODES: { value: Extractor; label: string; hint: string }[] = [
  { value: 'auto', label: '自动', hint: '代码满覆盖则 0 LLM 调用，否则走混合' },
  { value: 'code', label: '代码逻辑', hint: '零 LLM，最快，语义槽会缺失' },
  { value: 'hybrid', label: '混合', hint: '代码先行，LLM 只补缺（推荐）' },
  { value: 'llm', label: 'LLM', hint: 'YAML 输出，Python 转 JSON' },
  { value: 'agent', label: 'Agent', hint: 'ReAct 小文档、疑难槽专用' },
]

// ExtractPanel 是容器组件：表单状态在这里，异步状态在 useFillJob 里，结果展示交给 ResultPanel。
// 这样表单、异步、展示三者互不耦合，改后端契约只改 api.ts，改展示只改 ResultPanel。
export function ExtractPanel({ preset, onPresetUsed, externalLoad }: { preset: boolean; onPresetUsed: () => void; externalLoad: { doc: string; slots: string; nonce: number } | null }) {
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text')
  const [docText, setDocText] = useState('')
  const [slotsText, setSlotsText] = useState('')
  const [docUrl, setDocUrl] = useState('')
  const [slotsUrl, setSlotsUrl] = useState('')
  const [extractor, setExtractor] = useState<Extractor>('auto')
  const [formError, setFormError] = useState('')
  // 上传的二进制文件（PDF/DOCX）：不经过文本框，直接把字节发给后端解析。
  // 之前这里对所有文件都调 file.text()，PDF/DOCX 二进制会被当成文本，等于没传上去。
  const [pendingFile, setPendingFile] = useState<{ name: string; base64: string; size: number } | null>(null)
  const job = useFillJob()

  // preset / 外部载入都走 useEffect，不在渲染里 setState，避免 StrictMode 下重复渲染。
  useEffect(() => {
    if (preset) {
      setDocText(SAMPLE_DOC)
      setSlotsText(SAMPLE_SLOTS)
      setInputMode('text')
      onPresetUsed()
    }
  }, [preset, onPresetUsed])
  useEffect(() => {
    if (externalLoad) {
      setDocText(externalLoad.doc)
      setSlotsText(externalLoad.slots)
      setInputMode('text')
    }
  }, [externalLoad])

  async function handleFile(file: File) {
    const lower = file.name.toLowerCase()
    if (lower.endsWith('.txt') || lower.endsWith('.md')) {
      // 纯文本：读成文本进文本框，老行为不变。
      setDocText(await file.text())
      setPendingFile(null)
    } else {
      // PDF/DOCX 是二进制：读成 base64 交给后端按字节解析，不再要求用户粘贴文本。
      const buf = await file.arrayBuffer()
      let binary = ''
      const bytes = new Uint8Array(buf)
      const CHUNK = 0x8000
      for (let i = 0; i < bytes.length; i += CHUNK) {
        binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
      }
      setPendingFile({ name: file.name, base64: btoa(binary), size: file.size })
      setDocText('')
    }
    setInputMode('text')
  }

  function handleRun() {
    setFormError('')
    try {
      if (inputMode === 'url') {
        if (!docUrl.trim() || !slotsUrl.trim()) {
          setFormError('请同时填写文档 URL 和槽位 JSON URL。')
          return
        }
        void job.run({ document_url: docUrl.trim(), slots_url: slotsUrl.trim(), extractor })
      } else {
        if (!slotsText.trim()) {
          setFormError('请填写槽位 JSON。')
          return
        }
        if (!docText.trim() && !pendingFile) {
          setFormError('请粘贴文档文本或上传文件（PDF/DOCX 上传后直接解析，无需粘贴）。')
          return
        }
        const slots = JSON.parse(slotsText) as unknown
        if (pendingFile) {
          void job.run({ document_base64: pendingFile.base64, document_filename: pendingFile.name, slots, extractor })
        } else {
          void job.run({ document_text: docText, slots, extractor })
        }
      }
    } catch {
      setFormError('槽位 JSON 解析失败：请检查括号、逗号和引号。')
    }
  }

  return (
    <section className="panel">
      <h2>提取</h2>
      <p className="panel-desc">
        入参是文档 URL + 槽位 JSON URL（强约束），本地测试也支持直接粘贴文本和 JSON；上传 PDF/DOCX 会直接解析原文，无需粘贴；
        出参永远是一份结果 JSON 的 URL（非 SSE），本页轮询该 URL 直到完成。
      </p>
      <div className="tabs">
        <button className={inputMode === 'text' ? 'active' : ''} onClick={() => setInputMode('text')}>粘贴 / 上传 / 示例</button>
        <button className={inputMode === 'url' ? 'active' : ''} onClick={() => setInputMode('url')}>URL 入参</button>
      </div>
      {inputMode === 'url' ? (
        <div className="form-grid">
          <label>文档 URL<input value={docUrl} onChange={(e) => setDocUrl(e.target.value)} placeholder="https://example.com/contract.docx" /></label>
          <label>槽位 JSON URL<input value={slotsUrl} onChange={(e) => setSlotsUrl(e.target.value)} placeholder="https://example.com/slots.json" /></label>
        </div>
      ) : (
        <div className="form-grid">
          <label>文档文本
            <textarea value={docText} onChange={(e) => setDocText(e.target.value)} rows={12} placeholder="粘贴文档全文，或上传文件，或用示例合同" />
          </label>
          <label>槽位 JSON
            <textarea value={slotsText} onChange={(e) => setSlotsText(e.target.value)} rows={12} placeholder='{"slots": {"company_name": {"desc": "...", "type": "string", "required": true}}}' />
          </label>
        </div>
      )}
      <div className="form-row">
        <label>上传文档<input type="file" accept=".txt,.md,.docx,.pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); e.target.value = '' }} /></label>
        {pendingFile && <p className="note" aria-live="polite">已选择文件：{pendingFile.name}（{(pendingFile.size / 1024).toFixed(0)} KB），点“开始提取”直接解析，无需粘贴文本。</p>}
        <button className="ghost" onClick={() => { setDocText(SAMPLE_DOC); setSlotsText(SAMPLE_SLOTS); setInputMode('text') }}>一键体验示例合同</button>
      </div>
      <div className="mode-row" role="radiogroup" aria-label="提取模式">
        {MODES.map((m) => (
          <label key={m.value} className={extractor === m.value ? 'mode active' : 'mode'}>
            <input type="radio" name="extractor" value={m.value} checked={extractor === m.value} onChange={() => setExtractor(m.value)} />
            <strong>{m.label}</strong><span>{m.hint}</span>
          </label>
        ))}
      </div>
      {formError && <p className="error" role="alert">{formError}</p>}
      {job.error && <p className="error" role="alert">{job.error}（后端未启动时请先在后端目录执行 python run.py --port 8000）</p>}
      <button className="primary large" disabled={job.phase === 'processing'} onClick={handleRun}>
        {job.phase === 'processing' ? '正在提取…' : '开始提取'}
      </button>
      {job.phase === 'processing' && <p className="progress" aria-live="polite">{job.progress}</p>}
      {job.resultUrl && <p className="result-url">结果 URL：<code>{job.resultUrl}</code></p>}
      {job.phase === 'done' && job.result && <ResultPanel result={job.result} trace={job.trace} />}
    </section>
  )
}
