import { useCallback, useEffect, useRef, useState } from 'react'
import { submitFill, pollJob, fetchResult, fetchTrace } from '../api'
import type { Extractor, FillResult, Trace } from '../types'

// useFillJob：把“提交 -> 轮询 -> 取结果 -> 取 trace”这段异步状态机收进一个 Hook，
// 组件只关心 status 和数据，不用自己写 setInterval / 清理 / 竞态。
// 状态只有四种：idle / processing / done / failed，UI 按状态渲染，不会出现空白态。
export type JobPhase = 'idle' | 'processing' | 'done' | 'failed'

export function useFillJob() {
  const [phase, setPhase] = useState<JobPhase>('idle')
  const [progress, setProgress] = useState('')
  const [result, setResult] = useState<FillResult | null>(null)
  const [trace, setTrace] = useState<Trace | null>(null)
  const [resultUrl, setResultUrl] = useState('')
  const [error, setError] = useState('')
  const timer = useRef<number | null>(null)

  const stop = useCallback(() => {
    if (timer.current !== null) {
      window.clearInterval(timer.current)
      timer.current = null
    }
  }, [])

  useEffect(() => stop, [stop])

  const run = useCallback(
    async (payload: {
      document_url?: string
      slots_url?: string
      document_text?: string
      document_base64?: string
      document_filename?: string
      slots?: unknown
      extractor: Extractor
    }) => {
      stop()
      setPhase('processing')
      setError('')
      setResult(null)
      setTrace(null)
      setProgress('已提交任务，正在解析文档…')
      try {
        const job = await submitFill(payload)
        setResultUrl(job.result_url)
        if (job.data) {
          // sync 模式：一次返回结果
          setResult(job.data)
          const tr = await fetchTrace(job.trace_url)
          setTrace(tr)
          setPhase('done')
          setProgress('已完成')
          return
        }
        // 异步模式：每 1.5 秒轮询一次 job 状态，拿到 done 再取结果 JSON（非 SSE）
        timer.current = window.setInterval(async () => {
          try {
            const st = await pollJob(job.job_url)
            if (st.status === 'done') {
              stop()
              const data = await fetchResult(job.result_url)
              setResult(data ?? {})
              const tr = await fetchTrace(job.trace_url)
              setTrace(tr)
              setPhase('done')
              setProgress('已完成')
            } else if (st.status === 'failed') {
              stop()
              setError(st.error ?? '任务失败')
              setPhase('failed')
            } else {
              setProgress('正在提取中，文档越大耗时越长，请勿关闭页面…')
            }
          } catch (e) {
            stop()
            setError(e instanceof Error ? e.message : String(e))
            setPhase('failed')
          }
        }, 1500)
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
        setPhase('failed')
      }
    },
    [stop],
  )

  return { phase, progress, result, trace, resultUrl, error, run }
}
