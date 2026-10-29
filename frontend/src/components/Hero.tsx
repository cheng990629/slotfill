import { MascotLogo } from './MascotLogo'

export function Hero({ onTry }: { onTry: () => void }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">槽位填充工作台 · SLOTFILL</p>
        <h1>把一整份文档，<br />按你定的槽位填成 JSON。</h1>
        <p className="rule" aria-hidden="true" />
        <p className="hero-sub">
          代码、LLM、混合、Agent 四档提取共用同一套校验门：
          找不到填 null，不在枚举里填 null，格式不对先纠正再不行填 null，
          绝不输出一个“看起来像”的值。
        </p>
        <div className="hero-actions">
          <button className="primary" onClick={onTry}>一键体验示例合同</button>
          <span className="hero-note">示例数据来自后端 examples，真实走后端接口，不是写死的演示数据。</span>
        </div>
        <dl className="hero-stats">
          <div><dt>验证集抽取分（代码档）</dt><dd>0.9775</dd></div>
          <div><dt>结构化变体</dt><dd>1.0</dd></div>
          <div><dt>错版变体</dt><dd>0.8875</dd></div>
          <div><dt>验证用例</dt><dd>50</dd></div>
        </dl>
      </div>
      <figure className="hero-figure">
        <img src="/assets/editorial-contract.webp" alt="合同配图：暖纸上的条款与朱砂核对线" />
        <figcaption>配图 · 合同与朱砂核对线。AI 生成的编辑配图，不是真实合同原件。</figcaption>
        <div className="hero-mascot-row">
          <MascotLogo size={44} />
          <span>槽宝在帮你核对每一个槽位</span>
        </div>
      </figure>
    </section>
  )
}
