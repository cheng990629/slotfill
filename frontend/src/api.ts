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
