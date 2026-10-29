import { useState } from 'react'

// 槽宝：长耳毛绒吉祥物。动画有两层，缺一层也不静态：
// 1. 视频层：AI 生成的挥手、眨眼、上下浮动动画（assets/mascot-animation.mp4），自动循环播放；
// 2. CSS 层：容器本身也在做呼吸浮动（transform / opacity，只用 GPU 属性，不触发布局抖动）。
// 视频加载失败时自动降级为图片 + CSS 动画，logo 在任何情况下都不是一张静止贴图。
export function MascotLogo({ size = 56 }: { size?: number }) {
  const [videoFailed, setVideoFailed] = useState(false)
  return (
    <span className="mascot" style={{ width: size, height: size }} aria-label="槽宝吉祥物">
      {!videoFailed ? (
        <video
          className="mascot-video"
          src="/assets/mascot-animation.mp4"
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
        />
      ) : (
        <img className="mascot-img" src="/assets/mascot.webp" alt="槽宝" />
      )}
    </span>
  )
}
