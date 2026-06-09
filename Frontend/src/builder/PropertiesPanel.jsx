import { memo, useState, useCallback, useMemo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import useStore from '../store/useStore'
import { COLOR_PRESETS } from '../constants/blocks'
import { getBlockById } from '../utils/blockUtils'
import { isStyleInherited } from '../utils/responsiveStyles'

function InheritedLabel({ inherited }) {
  if (inherited) return <span className="text-[10px] text-emerald-500 ml-1">Inherited</span>
  return <span className="text-[10px] text-amber-500 ml-1">Overridden</span>
}

function ColorPicker({ label, value, onChange, inherited }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}<InheritedLabel inherited={inherited} /></label>
      <div className="flex flex-wrap gap-1.5">
        {COLOR_PRESETS.map((color) => (
          <button key={color} onClick={() => onChange(color)} className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${value === color ? 'border-primary-500 scale-110' : 'border-slate-200 dark:border-slate-600'}`} style={{ backgroundColor: color }} aria-label={`Color ${color}`} />
        ))}
      </div>
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="#000000" className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
    </div>
  )
}

function SliderField({ label, value, onChange, min = 0, max = 100, inherited }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}<InheritedLabel inherited={inherited} /></label>
        <span className="text-xs text-slate-400">{value}px</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-primary-500" />
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
      <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500" />
    </div>
  )
}

function ContentTab({ block, updateBlock }) {
  const updateContent = useCallback((key, value) => {
    updateBlock(block.id, { content: { [key]: value } })
  }, [block.id, updateBlock])

  const c = block.content

  const renderLinksEditor = (linksKey) => {
    const links = c[linksKey] || []
    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-500">Links</label>
        {links.map((link, i) => (
          <div key={i} className="flex gap-2">
            <input value={link.label} onChange={(e) => { const u = [...links]; u[i] = { ...u[i], label: e.target.value }; updateContent(linksKey, u) }} placeholder="Label" className="flex-1 px-2 py-1.5 text-sm rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
            <input value={link.url} onChange={(e) => { const u = [...links]; u[i] = { ...u[i], url: e.target.value }; updateContent(linksKey, u) }} placeholder="URL" className="flex-1 px-2 py-1.5 text-sm rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
            <button onClick={() => updateContent(linksKey, links.filter((_, j) => j !== i))} className="p-1.5 text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={() => updateContent(linksKey, [...links, { label: 'Link', url: '#' }])} className="flex items-center gap-1 text-xs text-primary-600"><Plus className="w-3 h-3" /> Add Link</button>
      </div>
    )
  }

  const fields = useMemo(() => {
    switch (block.type) {
      case 'navbar': return (<><Field label="Logo Text" value={c.logoText} onChange={(v) => updateContent('logoText', v)} /><Field label="Button Text" value={c.buttonText} onChange={(v) => updateContent('buttonText', v)} /><Field label="Button Link" value={c.buttonLink} onChange={(v) => updateContent('buttonLink', v)} />{renderLinksEditor('links')}</>)
      case 'header': return (<><Field label="Title" value={c.title} onChange={(v) => updateContent('title', v)} /><Field label="Subtitle" value={c.subtitle} onChange={(v) => updateContent('subtitle', v)} /></>)
      case 'hero': return (<><Field label="Title" value={c.title} onChange={(v) => updateContent('title', v)} /><Field label="Subtitle" value={c.subtitle} onChange={(v) => updateContent('subtitle', v)} /><Field label="Button Text" value={c.buttonText} onChange={(v) => updateContent('buttonText', v)} /><Field label="Button Link" value={c.buttonLink} onChange={(v) => updateContent('buttonLink', v)} /><Field label="Image URL" value={c.imageUrl} onChange={(v) => updateContent('imageUrl', v)} /></>)
      case 'text': return (<div className="space-y-1"><label className="text-xs font-medium text-slate-500">Paragraph Text</label><textarea value={c.text} onChange={(e) => updateContent('text', e.target.value)} rows={5} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 resize-y" /></div>)
      case 'button': return (<><Field label="Button Text" value={c.buttonText} onChange={(v) => updateContent('buttonText', v)} /><Field label="Button Link URL" value={c.buttonLink} onChange={(v) => updateContent('buttonLink', v)} /></>)
      case 'image': return (<><Field label="Image URL" value={c.imageUrl} onChange={(v) => updateContent('imageUrl', v)} /><Field label="Alt Text" value={c.altText} onChange={(v) => updateContent('altText', v)} /><Field label="Caption" value={c.caption} onChange={(v) => updateContent('caption', v)} /></>)
      case 'card': return (<><Field label="Title" value={c.title} onChange={(v) => updateContent('title', v)} /><div className="space-y-1"><label className="text-xs font-medium text-slate-500">Body Text</label><textarea value={c.bodyText} onChange={(e) => updateContent('bodyText', e.target.value)} rows={3} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" /></div><Field label="Image URL" value={c.imageUrl} onChange={(v) => updateContent('imageUrl', v)} /></>)
      case 'form': return (<><Field label="Title" value={c.title} onChange={(v) => updateContent('title', v)} /><Field label="Button Text" value={c.buttonText} onChange={(v) => updateContent('buttonText', v)} /></>)
      case 'footer': return (<><Field label="Footer Text" value={c.footerText} onChange={(v) => updateContent('footerText', v)} />{renderLinksEditor('links')}</>)
      case 'container': return (<Field label="Columns" value={String(c.columns || 2)} onChange={(v) => updateContent('columns', Number(v))} type="number" />)
      default: return <p className="text-sm text-slate-500">No content properties.</p>
    }
  }, [block, c, updateContent])

  return <div className="space-y-4">{fields}</div>
}

function DesignTab({ block, updateBlock }) {
  const previewMode = useStore((s) => s.previewMode)
  const updateStyle = useCallback((key, value) => {
    updateBlock(block.id, { styles: { [key]: value } })
  }, [block.id, updateBlock])

  const s = block.styles?.desktop ? block.styles : { desktop: block.styles || {}, tablet: {}, mobile: {} }
  const resolved = { ...s.desktop, ...s[previewMode] }

  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-400 capitalize">Editing: {previewMode} styles</p>
      <ColorPicker label="Text Color" value={resolved.color} onChange={(v) => updateStyle('color', v)} inherited={isStyleInherited(block.styles, previewMode, 'color')} />
      <ColorPicker label="Background Color" value={resolved.backgroundColor} onChange={(v) => updateStyle('backgroundColor', v)} inherited={isStyleInherited(block.styles, previewMode, 'backgroundColor')} />
      {block.type === 'text' && (
        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-xs font-semibold text-slate-500 uppercase">Typography</h4>
          <Field label="Font Size" value={resolved.fontSize} onChange={(v) => updateStyle('fontSize', v)} />
          <SliderField label="Font Weight" value={Number(resolved.fontWeight) || 400} onChange={(v) => updateStyle('fontWeight', String(v))} min={300} max={700} inherited={isStyleInherited(block.styles, previewMode, 'fontWeight')} />
        </div>
      )}
      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
        <h4 className="text-xs font-semibold text-slate-500 uppercase">Layout Spacing</h4>
        <SliderField label="Padding Top" value={resolved.paddingTop} onChange={(v) => updateStyle('paddingTop', v)} max={120} inherited={isStyleInherited(block.styles, previewMode, 'paddingTop')} />
        <SliderField label="Padding Bottom" value={resolved.paddingBottom} onChange={(v) => updateStyle('paddingBottom', v)} max={120} inherited={isStyleInherited(block.styles, previewMode, 'paddingBottom')} />
        <SliderField label="Margin Top" value={resolved.marginTop} onChange={(v) => updateStyle('marginTop', v)} max={80} inherited={isStyleInherited(block.styles, previewMode, 'marginTop')} />
        <SliderField label="Margin Bottom" value={resolved.marginBottom} onChange={(v) => updateStyle('marginBottom', v)} max={80} inherited={isStyleInherited(block.styles, previewMode, 'marginBottom')} />
      </div>
      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
        <h4 className="text-xs font-semibold text-slate-500 uppercase">Borders & Radius</h4>
        <SliderField label="Border Radius" value={resolved.borderRadius} onChange={(v) => updateStyle('borderRadius', v)} max={48} inherited={isStyleInherited(block.styles, previewMode, 'borderRadius')} />
        <SliderField label="Border Width" value={resolved.borderWidth} onChange={(v) => updateStyle('borderWidth', v)} max={10} inherited={isStyleInherited(block.styles, previewMode, 'borderWidth')} />
      </div>
    </div>
  )
}

function PropertiesPanel() {
  const [tab, setTab] = useState('content')
  const selectedBlockId = useStore((s) => s.selectedBlockId)
  const layout = useStore((s) => s.layout)
  const updateBlock = useStore((s) => s.updateBlock)
  const block = useMemo(() => selectedBlockId ? getBlockById(layout, selectedBlockId) : null, [selectedBlockId, layout])

  return (
    <aside className="w-80 shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full" aria-label="Properties panel">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800"><h2 className="text-sm font-semibold font-display">Properties</h2></div>
      {!block ? (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
          <div><p className="text-sm">No Block Selected</p><p className="text-xs mt-1">Click a block on the canvas to edit</p></div>
        </div>
      ) : (
        <>
          <div className="flex border-b border-slate-200 dark:border-slate-800" role="tablist">
            {['content', 'design'].map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`flex-1 py-2.5 text-sm font-medium capitalize ${tab === t ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500'}`}>{t}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4" role="tabpanel">
            {tab === 'content' ? <ContentTab block={block} updateBlock={updateBlock} /> : <DesignTab block={block} updateBlock={updateBlock} />}
          </div>
        </>
      )}
    </aside>
  )
}

export default memo(PropertiesPanel)
