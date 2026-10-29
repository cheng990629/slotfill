import type { Extractor, FillJobResponse, JobStatus, Trace, FillResult } from './types'

// API 层是唯一直接碰 fetch 的地方：组件只调 submitFill / pollJob / fetchJson，
// 不自己拼 URL、不自己处理轮询，这样后端地址、超时、错误格式变了只改这里。
const API_BASE = import.meta.env.VITE_API_BASE ?? ''

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`请求失败 ${res.status}：${text.slice(0, 300)}`)
  }
  return res.json() as Promise<T>
}

async function getJson<T>(path: string): Promise<{ status: number; data: T }> {
  const res = await fetch(`${API_BASE}${path}`)
  const data = (await res.json()) as T
  return { status: res.status, data }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`)
    return res.ok
  } catch {
    return false
  }
}

export async function submitFill(payload: {
  document_url?: string
  slots_url?: string
  document_text?: string
  slots?: unknown
  extractor: Extractor
  sync?: boolean
}): Promise<FillJobResponse & { data?: FillResult }> {
  return postJson('/api/v1/fill', payload)
}

export async function pollJob(jobUrl: string): Promise<JobStatus> {
  const { data } = await getJson<JobStatus>(jobUrl)
  return data
}

export async function fetchResult(resultUrl: string): Promise<FillResult | null> {
  const { status, data } = await getJson<FillResult>(resultUrl)
  if (status === 202) return null // 还在处理中，调用方继续轮询
  return data
}

export async function fetchTrace(traceUrl: string): Promise<Trace | null> {
  try {
    const { data } = await getJson<Trace>(traceUrl)
    return data
  } catch {
    return null
  }
}

export type ModelConfig = {
  has_api_key: boolean
  api_key_masked: string
  base_url: string
  model: string
  is_bailian: boolean
  mock: boolean
  bailian_default_base_url: string
  tier_suggestions: Record<string, string>
}

export async function getConfig(): Promise<ModelConfig> {
  const { data } = await getJson<ModelConfig>('/api/v1/config')
  return data
}

export async function saveConfig(body: { api_key?: string; base_url?: string; model?: string }): Promise<ModelConfig> {
  return postJson('/api/v1/config', body)
}

export async function testConfig(body: { api_key?: string; base_url?: string; model?: string }): Promise<{ ok: boolean; model?: string; base_url?: string; latency_ms?: number; reply?: string; error?: string }> {
  try {
    return await postJson('/api/v1/config/test', body)
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}
