import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ExtractPanel } from './components/ExtractPanel'
import { CaseBrowser } from './components/CaseBrowser'
import { ValidationPanel } from './components/ValidationPanel'
import { ArchitecturePanel } from './components/ArchitecturePanel'
import { DesignPanel } from './components/DesignPanel'
import { ModelPanel } from './components/ModelPanel'
import { checkHealth } from './api'
import './styles.css'

// App 只做三件事：导航、健康检查、把用例载入提取页。
// 提取表单自己的状态留在 ExtractPanel 里，不上提到 App，避免 App 变成“什么都管”的大组件。
export default function App() {
  const [tab, setTab] = useState('extract')
  const [healthy, setHealthy] = useState<boolean | null>(null)
  const [preset, setPreset] = useState(false)
  const [loadRequest, setLoadRequest] = useState<{ doc: string; slots: string; nonce: number } | null>(null)

  useEffect(() => {
    void checkHealth().then(setHealthy)
  }, [])

  return (
    <div className="app">
      <Header healthy={healthy} onNav={setTab} />
      <main>
        {tab === 'extract' && (
          <>
            <Hero onTry={() => setPreset(true)} />
            <ExtractPanel preset={preset} onPresetUsed={() => setPreset(false)} externalLoad={loadRequest} />
          </>
        )}
        {tab === 'cases' && (
          <CaseBrowser
            onLoadIntoExtract={(doc, slots) => {
              setLoadRequest({ doc, slots, nonce: Date.now() })
              setTab('extract')
            }}
          />
        )}
        {tab === 'validation' && <ValidationPanel />}
        {tab === 'architecture' && <ArchitecturePanel />}
        {tab === 'design' && <DesignPanel />}
        {tab === 'model' && <ModelPanel />}
      </main>
      <footer className="footer">
        <span>后端：slot-filling-backend（Python 标准库 HTTP 服务，默认 8000 端口）</span>
        <span>前端：Vite + React 18 + TypeScript，开发 5173 端口，/api 代理到后端</span>
      </footer>
    </div>
  )
}
