import { MascotLogo } from './MascotLogo'

export function Header({ healthy, onNav }: { healthy: boolean | null; onNav: (tab: string) => void }) {
  return (
    <header className="header">
      <button className="brand" onClick={() => onNav('extract')}>
        <MascotLogo size={44} />
        <span className="brand-text">
          <strong>槽位填充工作台</strong>
          <small>SlotFill · 文档 → 结构化 JSON</small>
        </span>
      </button>
      <nav className="nav">
        <button onClick={() => onNav('extract')}>提取</button>
        <button onClick={() => onNav('cases')}>50 个文件</button>
        <button onClick={() => onNav('validation')}>验证集</button>
        <button onClick={() => onNav('architecture')}>架构与 React 设计</button>
        <button onClick={() => onNav('design')}>方案与设计物料</button>
        <button onClick={() => onNav('model')}>模型配置</button>
      </nav>
      <span className={`health ${healthy === null ? '' : healthy ? 'ok' : 'bad'}`} aria-live="polite">
        {healthy === null ? '正在检测后端…' : healthy ? '● 后端在线' : '● 后端未启动'}
      </span>
    </header>
  )
}
