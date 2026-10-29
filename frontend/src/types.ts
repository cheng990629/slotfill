// 后端契约（与 slotfill/service.py 的 API 一一对应，改后端先改这里，再改组件）。
export type Extractor = 'auto' | 'code' | 'llm' | 'hybrid' | 'agent' | 'python'

export interface FillJobResponse {
  job_id: string
  status: string
  job_url: string
  result_url: string
  trace_url: string
}

export interface JobStatus {
  job_id: string
  status: 'processing' | 'done' | 'failed'
  missing?: string[]
  warnings?: string[]
  error?: string
}

export interface Trace {
  extractor_used?: string
  stages?: string[]
  document_chars?: number
  document_type?: string
  chunk_count?: number
  slot_count?: number
  sections?: string[]
  image_count?: number
  missing?: string[]
  coverage?: { filled: number; total: number; filled_required: number; total_required: number }
  elapsed_seconds?: number
  llm_calls?: number
  warnings?: string[]
  [key: string]: unknown
}

export type FillResult = Record<string, unknown>
