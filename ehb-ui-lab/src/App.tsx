import './App.css'
import { Canvas } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useState } from 'react'
import OllamaChat from './components/OllamaChat'

function FloatingOrb() {
  return (
    <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial
          color="#7dd3fc"
          metalness={0.6}
          roughness={0.25}
          emissive="#38bdf8"
          emissiveIntensity={0.6}
        />
      </mesh>
    </Float>
  )
}

function GlassCard({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <motion.div
      className="glass-card"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
    >
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </motion.div>
  )
}

function App() {
  const [tab, setTab] = useState<'studio' | 'ai'>('studio')

  return (
    <div className="ultra-root">
      <div className="ultra-bg">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[6, 6, 6]} intensity={1.2} />
          <directionalLight position={[-4, -5, -2]} intensity={0.6} />
          <FloatingOrb />
        </Canvas>
      </div>

      <main className="ultra-layer">
        <div className="tab-row" role="tablist" aria-label="Studio tabs">
          <button
            className={`tab-btn ${tab === 'studio' ? 'tab-active' : ''}`}
            type="button"
            role="tab"
            aria-selected={tab === 'studio'}
            onClick={() => setTab('studio')}
          >
            Studio
          </button>
          <button
            className={`tab-btn ${tab === 'ai' ? 'tab-active' : ''}`}
            type="button"
            role="tab"
            aria-selected={tab === 'ai'}
            onClick={() => setTab('ai')}
          >
            AI Console
          </button>
        </div>

        {tab === 'studio' ? (
          <>
            <motion.div
              className="hero-left"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <p className="eyebrow">EHB · Design Intelligence</p>
              <h1>
                World-ultra
                <span> UI / UX </span>
                studio for 3D & AI visuals
              </h1>
              <p className="subtitle">
                Realtime 3D canvases, AI-powered image prompts, and hyper-clean
                layouts — all ready to extend for your EHB projects.
              </p>

              <div className="cta-row">
                <button className="btn-primary">Start 3D playground</button>
                <button className="btn-ghost">AI image lab (soon)</button>
              </div>
            </motion.div>

            <motion.div
              className="hero-right"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              <GlassCard
                title="3D background engine"
                subtitle="Built with React Three Fiber - swap meshes, colors or animations anytime."
              />
              <GlassCard
                title="AI image slots"
                subtitle="Connect any AI image API; drop previews in clean, responsive frames."
              />
              <GlassCard
                title="Ultra UI system"
                subtitle="Layered glassmorphism, soft gradients, and motion-first interaction."
              />
            </motion.div>
          </>
        ) : (
          <div className="ai-panel">
            <OllamaChat />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
