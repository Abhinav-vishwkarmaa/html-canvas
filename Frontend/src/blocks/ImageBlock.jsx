import { memo, useCallback, useRef } from 'react'
import { Upload, Trash2, RefreshCw } from 'lucide-react'
import { useBlockStyles } from '../hooks/useBlockStyles'
import useStore from '../store/useStore'

function ImageBlock({ block }) {
  const updateBlock = useStore((s) => s.updateBlock)
  const fileRef = useRef(null)
  const { imageUrl, altText, caption } = block.content
  const style = useBlockStyles(block)

  const handleUpload = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      updateBlock(block.id, { content: { imageUrl: ev.target.result } })
    }
    reader.readAsDataURL(file)
  }, [block.id, updateBlock])

  const handleDelete = useCallback(() => {
    updateBlock(block.id, { content: { imageUrl: '' } })
  }, [block.id, updateBlock])

  return (
    <figure style={{ ...style, textAlign: 'center', position: 'relative' }}>
      {imageUrl ? (
        <>
          <img src={imageUrl} alt={altText || ''} style={{ maxWidth: '100%', borderRadius: '8px' }} />
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click() }}
              className="p-1.5 bg-white/90 rounded-md shadow hover:bg-white"
              title="Replace image"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete() }}
              className="p-1.5 bg-white/90 rounded-md shadow hover:bg-white text-red-500"
              title="Delete image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); fileRef.current?.click() }}
          className="flex flex-col items-center gap-2 w-full py-12 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-primary-400 transition-colors"
        >
          <Upload className="w-8 h-8 text-slate-400" />
          <span className="text-sm text-slate-500">Click to upload image</span>
        </button>
      )}
      {caption && <figcaption style={{ marginTop: '8px', fontSize: '0.875rem', opacity: 0.7 }}>{caption}</figcaption>}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
    </figure>
  )
}

export default memo(ImageBlock)

