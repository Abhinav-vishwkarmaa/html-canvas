import { memo } from 'react'
import { useBlockStyles } from '../hooks/useBlockStyles'

function FormBlock({ block }) {
  const { title, buttonText, fields } = block.content
  const style = useBlockStyles(block)

  return (
    <form
      style={{ ...style, maxWidth: '480px', margin: '0 auto' }}
      onSubmit={(e) => e.preventDefault()}
    >
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 24px', textAlign: 'center' }}>{title}</h2>
      {(fields || []).map((field, i) => (
        <div key={i} style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              rows={4}
              style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
              readOnly
            />
          ) : (
            <input
              type={field.type}
              style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
              readOnly
            />
          )}
        </div>
      ))}
      <button
        type="button"
        style={{
          width: '100%', background: '#2563eb', color: '#fff', padding: '12px',
          border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
        }}
      >
        {buttonText}
      </button>
    </form>
  )
}

export default memo(FormBlock)

