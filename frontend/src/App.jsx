import { useState } from 'react'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import SlideCanvas from './components/SlideCanvas'
import GenerateModal from './components/GenerateModal'
import HomePage from './components/HomePage'
import PresentMode from './components/PresentMode'
import html2canvas from 'html2canvas'
import './App.css'

export default function App() {
  const [presentation, setPresentation] = useState(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isPresenting, setIsPresenting] = useState(false)

  const exportPptx = async (data, fetch_images = true) => {
    try {
      const res = await fetch('/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presentation: data, fetch_images }),
      })
      if (!res.ok) {
        throw new Error(await res.text())
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = (data.title || 'presentation').replace(/\s+/g, '_') + '.pptx'
      a.target = '_blank'
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (e) {
      alert('Export failed: ' + e.message)
    }
  }

  const handleGenerate = async ({ topic, requirements, num_slides, fetch_images }) => {
    setLoading(true)
    try {
      const res = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, requirements, num_slides }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      data._fetch_images = fetch_images
      setPresentation(data)
      setActiveSlide(-1)
      setShowModal(false)
      await exportPptx(data, fetch_images)
    } catch (e) {
      alert('Generation failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => exportPptx(presentation, presentation?._fetch_images ?? true)

  if (!presentation) {
    return (
      <>
        <HomePage 
          onNew={() => setShowModal(true)} 
          onPreview={(data) => {
            setActiveSlide(-1)
            setPresentation(data)
          }}
          loading={loading} 
        />
        {showModal && (
          <GenerateModal
            onClose={() => setShowModal(false)}
            onGenerate={handleGenerate}
            loading={loading}
          />
        )}
      </>
    )
  }

  return (
    <div className="app-shell">
      <Topbar
        title={presentation.title}
        onExport={handleExport}
        onNew={() => setShowModal(true)}
        onBack={() => setPresentation(null)}
        onPresent={() => setIsPresenting(true)}
        currentSlide={activeSlide === -1 ? 1 : activeSlide + 2}
        totalSlides={presentation.slides.length + 1}
      />
      <div className="app-body">
        <Sidebar
          slides={presentation.slides}
          activeSlide={activeSlide}
          onSelect={setActiveSlide}
          title={presentation.title}
          subtitle={presentation.subtitle}
          coverImageQuery={presentation.cover_image_query}
        />
        <SlideCanvas
          presentation={presentation}
          activeSlide={activeSlide}
          onSelect={setActiveSlide}
        />
      </div>
      {showModal && (
        <GenerateModal
          onClose={() => setShowModal(false)}
          onGenerate={handleGenerate}
          loading={loading}
        />
      )}
      {isPresenting && (
        <PresentMode 
          presentation={presentation} 
          startSlide={activeSlide}
          onClose={() => setIsPresenting(false)} 
        />
      )}
    </div>
  )
}
