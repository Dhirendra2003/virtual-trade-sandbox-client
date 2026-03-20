import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Check, X, ZoomIn, ZoomOut } from 'lucide-react'

/**
 * Crops the image on a canvas and returns a Blob URL of the result.
 * @param {string} imageSrc  - object URL or data URL of the original image
 * @param {Object} pixelCrop - { x, y, width, height } in pixels
 * @returns {Promise<string>} - object URL of the cropped image blob
 */
async function getCroppedImg(imageSrc, pixelCrop) {
  const image = new Image()
  image.src = imageSrc
  await new Promise(resolve => {
    image.onload = resolve
  })

  const canvas = document.createElement('canvas')
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext('2d')

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve({ blob, url: URL.createObjectURL(blob) })
    }, 'image/jpeg')
  })
}

export default function PhotoUpload({ image, setCropperOpen, setCroppedPfp }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const handleSave = async () => {
    if (!croppedAreaPixels) return
    const croppedUrl = await getCroppedImg(image, croppedAreaPixels)
    setCroppedPfp(croppedUrl)
    setCropperOpen(false)
  }

  const handleCancel = () => {
    setCropperOpen(false)
  }

  return (
    /* Full-screen dark modal backdrop */
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Modal panel */}
      <div className="relative flex flex-col items-center gap-5 bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-2xl w-[520px] max-w-[95vw]">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg tracking-tight">Crop Profile Photo</h2>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cropper area */}
        <div className="relative w-[420px] h-[420px] max-w-full rounded-xl overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            style={{
              containerStyle: {
                position: 'absolute',
                inset: 0,
                background: '#0f172a',
              },
              mediaStyle: {},
              cropAreaStyle: {
                border: '2px solid rgba(99,102,241,0.8)',
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.65)',
              },
            }}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3 w-full px-2">
          <ZoomOut size={16} className="text-slate-400 shrink-0" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <ZoomIn size={16} className="text-slate-400 shrink-0" />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            onClick={handleCancel}
          >
            <X size={15} className="mr-1" />
            Cancel
          </Button>
          <Button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white" onClick={handleSave}>
            <Check size={15} className="mr-1" />
            Save Crop
          </Button>
        </div>
      </div>
    </div>
  )
}
