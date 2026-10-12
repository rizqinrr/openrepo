import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdOutlineTransform,
  Md3dRotation,
  MdOutlineLayers,
  MdOutlineCropSquare,
  MdOutlineAutoFixHigh,
  MdOutlineGradient,
  MdOutlineTextFields,
  MdOutlineContentCopy,
  MdCheck,
  MdRestartAlt,
  MdRefresh,
  MdAdd,
  MdDeleteOutline,
  MdArrowBack,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
} from 'react-icons/md'
import './CssPlayground.css'

// --- DEFAULT STATES PER SECTION ---

const DEFAULT_TRANSFORM_2D = {
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  skewX: 0,
  skewY: 0,
}

const DEFAULT_TRANSFORM_3D = {
  rotateX: 25,
  rotateY: -30,
  rotateZ: 0,
  translateZ: 0,
  perspective: 800,
}

const DEFAULT_SHADOWS = [
  {
    id: 1,
    offsetX: 0,
    offsetY: 15,
    blur: 30,
    spread: -5,
    color: '#2563eb',
    opacity: 35,
    inset: false,
  },
]

const DEFAULT_BORDER = {
  radiusTopLeft: 16,
  radiusTopRight: 16,
  radiusBottomRight: 16,
  radiusBottomLeft: 16,
  borderWidth: 3,
  borderStyle: 'solid',
  borderColor: '#2563eb',
}

const DEFAULT_FILTER = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hueRotate: 0,
  opacity: 100,
}

const DEFAULT_BACKGROUND = {
  mode: 'linear', // 'solid' | 'linear' | 'radial'
  solidColor: '#2563eb',
  linearAngle: 135,
  linearStops: [
    { id: 1, color: '#3b82f6', position: 0 },
    { id: 2, color: '#8b5cf6', position: 100 },
  ],
  radialShape: 'circle', // 'circle' | 'ellipse'
  radialStops: [
    { id: 1, color: '#3b82f6', position: 0 },
    { id: 2, color: '#1e1b4b', position: 100 },
  ],
}

const DEFAULT_TYPOGRAPHY = {
  fontSize: 28,
  fontWeight: '600',
  lineHeight: 1.4,
  letterSpacing: 0,
  color: '#2563eb',
  enableShadow: false,
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  shadowBlur: 4,
  shadowColor: '#000000',
  shadowOpacity: 30,
  textAlign: 'center',
  textTransform: 'none',
}

// --- HELPER UTILITIES ---

function hexToRgba(hex, opacity = 100) {
  if (!hex) return 'rgba(0, 0, 0, 1)'
  const clean = hex.replace('#', '')
  let r = 0, g = 0, b = 0
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16)
    g = parseInt(clean[1] + clean[1], 16)
    b = parseInt(clean[2] + clean[2], 16)
  } else if (clean.length >= 6) {
    r = parseInt(clean.substring(0, 2), 16)
    g = parseInt(clean.substring(2, 4), 16)
    b = parseInt(clean.substring(4, 6), 16)
  }
  const alpha = (Math.max(0, Math.min(100, opacity)) / 100).toFixed(2)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// --- SECTION METADATA ---

const SECTIONS = [
  { id: 'transform-2d', label: 'Transform 2D', icon: MdOutlineTransform, desc: 'Rotate, scale, translate, skew' },
  { id: 'transform-3d', label: 'Transform 3D', icon: Md3dRotation, desc: 'Perspective, rotation 3D, translateZ' },
  { id: 'box-shadow', label: 'Box Shadow', icon: MdOutlineLayers, desc: 'Multiple shadow layer & inset' },
  { id: 'border', label: 'Border', icon: MdOutlineCropSquare, desc: 'Radius per corner & border style' },
  { id: 'filter', label: 'Filter', icon: MdOutlineAutoFixHigh, desc: 'Blur, brightness, contrast, saturate' },
  { id: 'background', label: 'Background', icon: MdOutlineGradient, desc: 'Solid, linear & radial gradient' },
  { id: 'typography', label: 'Typography', icon: MdOutlineTextFields, desc: 'Size, weight, line-height, text-shadow' },
]

// --- REUSABLE CONTROL COMPONENTS ---

function SliderControl({ label, value, onChange, min, max, step = 1, unit = '' }) {
  return (
    <div className="cp-control-row">
      <div className="cp-control-label-group">
        <label className="cp-control-label">{label}</label>
        <span className="cp-control-value-badge">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        className="cp-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

function ColorPickerRow({ label, color, onColorChange, opacity, onOpacityChange }) {
  return (
    <div className="cp-control-row cp-color-row">
      <div className="cp-control-label-group">
        <label className="cp-control-label">{label}</label>
        <div className="cp-color-badges">
          <span className="cp-color-hex">{color.toUpperCase()}</span>
          {opacity !== undefined && (
            <span className="cp-control-value-badge">{opacity}%</span>
          )}
        </div>
      </div>
      <div className="cp-color-inputs">
        <label className="cp-color-chip-wrapper" title="Pilih warna">
          <input
            type="color"
            className="cp-color-input"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
          />
          <span className="cp-color-chip" style={{ backgroundColor: color }} />
        </label>
        {opacity !== undefined && onOpacityChange && (
          <input
            type="range"
            className="cp-slider cp-slider-opacity"
            min={0}
            max={100}
            value={opacity}
            onChange={(e) => onOpacityChange(Number(e.target.value))}
            title="Opacity warna"
          />
        )}
      </div>
    </div>
  )
}

function SelectControl({ label, value, onChange, options }) {
  return (
    <div className="cp-control-row">
      <label className="cp-control-label">{label}</label>
      <select
        className="cp-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function ToggleControl({ label, checked, onChange }) {
  return (
    <div className="cp-control-row cp-toggle-row">
      <label className="cp-control-label">{label}</label>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`cp-toggle ${checked ? 'is-active' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="cp-toggle-thumb" />
      </button>
    </div>
  )
}

// --- SUB-COMPONENTS CONTROLS PER SECTION ---

function Transform2DControls({ state, onChange }) {
  return (
    <div className="cp-controls-grid">
      <SliderControl
        label="Rotate"
        value={state.rotate}
        min={-180}
        max={180}
        step={1}
        unit="deg"
        onChange={(v) => onChange({ ...state, rotate: v })}
      />
      <SliderControl
        label="Scale X"
        value={state.scaleX}
        min={0}
        max={3}
        step={0.05}
        onChange={(v) => onChange({ ...state, scaleX: v })}
      />
      <SliderControl
        label="Scale Y"
        value={state.scaleY}
        min={0}
        max={3}
        step={0.05}
        onChange={(v) => onChange({ ...state, scaleY: v })}
      />
      <SliderControl
        label="Translate X"
        value={state.translateX}
        min={-200}
        max={200}
        step={1}
        unit="px"
        onChange={(v) => onChange({ ...state, translateX: v })}
      />
      <SliderControl
        label="Translate Y"
        value={state.translateY}
        min={-200}
        max={200}
        step={1}
        unit="px"
        onChange={(v) => onChange({ ...state, translateY: v })}
      />
      <SliderControl
        label="Skew X"
        value={state.skewX}
        min={-45}
        max={45}
        step={1}
        unit="deg"
        onChange={(v) => onChange({ ...state, skewX: v })}
      />
      <SliderControl
        label="Skew Y"
        value={state.skewY}
        min={-45}
        max={45}
        step={1}
        unit="deg"
        onChange={(v) => onChange({ ...state, skewY: v })}
      />
    </div>
  )
}

function Transform3DControls({ state, onChange }) {
  return (
    <div className="cp-controls-grid">
      <SliderControl
        label="Perspective (Parent)"
        value={state.perspective}
        min={100}
        max={2000}
        step={20}
        unit="px"
        onChange={(v) => onChange({ ...state, perspective: v })}
      />
      <SliderControl
        label="Rotate X"
        value={state.rotateX}
        min={-180}
        max={180}
        step={1}
        unit="deg"
        onChange={(v) => onChange({ ...state, rotateX: v })}
      />
      <SliderControl
        label="Rotate Y"
        value={state.rotateY}
        min={-180}
        max={180}
        step={1}
        unit="deg"
        onChange={(v) => onChange({ ...state, rotateY: v })}
      />
      <SliderControl
        label="Rotate Z"
        value={state.rotateZ}
        min={-180}
        max={180}
        step={1}
        unit="deg"
        onChange={(v) => onChange({ ...state, rotateZ: v })}
      />
      <SliderControl
        label="Translate Z"
        value={state.translateZ}
        min={-200}
        max={200}
        step={1}
        unit="px"
        onChange={(v) => onChange({ ...state, translateZ: v })}
      />
    </div>
  )
}

function BoxShadowControls({ shadows, onChange }) {
  const [activeLayerIndex, setActiveLayerIndex] = useState(0)

  const currentLayer = shadows[activeLayerIndex] ?? shadows[0]

  const updateCurrentLayer = (updated) => {
    const next = [...shadows]
    next[activeLayerIndex] = updated
    onChange(next)
  }

  const addShadow = () => {
    if (shadows.length >= 3) return
    const newId = Date.now()
    const newLayer = {
      id: newId,
      offsetX: 0,
      offsetY: 8,
      blur: 16,
      spread: 0,
      color: '#000000',
      opacity: 20,
      inset: false,
    }
    onChange([...shadows, newLayer])
    setActiveLayerIndex(shadows.length)
  }

  const removeShadow = (indexToRemove) => {
    if (shadows.length <= 1) return
    const next = shadows.filter((_, idx) => idx !== indexToRemove)
    onChange(next)
    if (activeLayerIndex >= next.length) {
      setActiveLayerIndex(next.length - 1)
    }
  }

  return (
    <div className="cp-shadow-controls">
      <div className="cp-shadow-layers-bar">
        <div className="cp-layer-pills">
          {shadows.map((sh, idx) => (
            <button
              key={sh.id || idx}
              type="button"
              className={`cp-layer-pill ${idx === activeLayerIndex ? 'is-active' : ''}`}
              onClick={() => setActiveLayerIndex(idx)}
            >
              <span>Shadow {idx + 1}</span>
              {shadows.length > 1 && (
                <span
                  role="button"
                  tabIndex={0}
                  className="cp-layer-pill-del"
                  title="Hapus layer"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeShadow(idx)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation()
                      removeShadow(idx)
                    }
                  }}
                >
                  &times;
                </span>
              )}
            </button>
          ))}
        </div>
        {shadows.length < 3 && (
          <button
            type="button"
            className="cp-btn cp-btn-sm cp-btn-ghost"
            onClick={addShadow}
            title="Tambah shadow baru (maksimal 3)"
          >
            <MdAdd />
            <span>Tambah Shadow ({shadows.length}/3)</span>
          </button>
        )}
      </div>

      {currentLayer && (
        <div className="cp-controls-grid">
          <SliderControl
            label="Offset X"
            value={currentLayer.offsetX}
            min={-50}
            max={50}
            step={1}
            unit="px"
            onChange={(v) => updateCurrentLayer({ ...currentLayer, offsetX: v })}
          />
          <SliderControl
            label="Offset Y"
            value={currentLayer.offsetY}
            min={-50}
            max={50}
            step={1}
            unit="px"
            onChange={(v) => updateCurrentLayer({ ...currentLayer, offsetY: v })}
          />
          <SliderControl
            label="Blur Radius"
            value={currentLayer.blur}
            min={0}
            max={100}
            step={1}
            unit="px"
            onChange={(v) => updateCurrentLayer({ ...currentLayer, blur: v })}
          />
          <SliderControl
            label="Spread Radius"
            value={currentLayer.spread}
            min={-20}
            max={50}
            step={1}
            unit="px"
            onChange={(v) => updateCurrentLayer({ ...currentLayer, spread: v })}
          />
          <ColorPickerRow
            label="Shadow Color"
            color={currentLayer.color}
            opacity={currentLayer.opacity}
            onColorChange={(v) => updateCurrentLayer({ ...currentLayer, color: v })}
            onOpacityChange={(v) => updateCurrentLayer({ ...currentLayer, opacity: v })}
          />
          <ToggleControl
            label="Inset Shadow"
            checked={currentLayer.inset}
            onChange={(v) => updateCurrentLayer({ ...currentLayer, inset: v })}
          />
        </div>
      )}
    </div>
  )
}

function BorderControls({ state, onChange }) {
  const borderStyles = [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' },
    { value: 'double', label: 'Double' },
    { value: 'groove', label: 'Groove' },
    { value: 'ridge', label: 'Ridge' },
    { value: 'inset', label: 'Inset' },
    { value: 'outset', label: 'Outset' },
  ]

  return (
    <div className="cp-controls-grid">
      <div className="cp-controls-subhead">Border Radius per Corner</div>
      <SliderControl
        label="Top Left"
        value={state.radiusTopLeft}
        min={0}
        max={100}
        step={1}
        unit="px"
        onChange={(v) => onChange({ ...state, radiusTopLeft: v })}
      />
      <SliderControl
        label="Top Right"
        value={state.radiusTopRight}
        min={0}
        max={100}
        step={1}
        unit="px"
        onChange={(v) => onChange({ ...state, radiusTopRight: v })}
      />
      <SliderControl
        label="Bottom Right"
        value={state.radiusBottomRight}
        min={0}
        max={100}
        step={1}
        unit="px"
        onChange={(v) => onChange({ ...state, radiusBottomRight: v })}
      />
      <SliderControl
        label="Bottom Left"
        value={state.radiusBottomLeft}
        min={0}
        max={100}
        step={1}
        unit="px"
        onChange={(v) => onChange({ ...state, radiusBottomLeft: v })}
      />

      <div className="cp-controls-subhead">Border Properties</div>
      <SliderControl
        label="Border Width"
        value={state.borderWidth}
        min={0}
        max={20}
        step={1}
        unit="px"
        onChange={(v) => onChange({ ...state, borderWidth: v })}
      />
      <SelectControl
        label="Border Style"
        value={state.borderStyle}
        options={borderStyles}
        onChange={(v) => onChange({ ...state, borderStyle: v })}
      />
      <ColorPickerRow
        label="Border Color"
        color={state.borderColor}
        onColorChange={(v) => onChange({ ...state, borderColor: v })}
      />
    </div>
  )
}

function FilterControls({ state, onChange }) {
  return (
    <div className="cp-controls-grid">
      <SliderControl
        label="Blur"
        value={state.blur}
        min={0}
        max={20}
        step={0.5}
        unit="px"
        onChange={(v) => onChange({ ...state, blur: v })}
      />
      <SliderControl
        label="Brightness"
        value={state.brightness}
        min={0}
        max={200}
        step={1}
        unit="%"
        onChange={(v) => onChange({ ...state, brightness: v })}
      />
      <SliderControl
        label="Contrast"
        value={state.contrast}
        min={0}
        max={200}
        step={1}
        unit="%"
        onChange={(v) => onChange({ ...state, contrast: v })}
      />
      <SliderControl
        label="Saturate"
        value={state.saturate}
        min={0}
        max={200}
        step={1}
        unit="%"
        onChange={(v) => onChange({ ...state, saturate: v })}
      />
      <SliderControl
        label="Hue Rotate"
        value={state.hueRotate}
        min={0}
        max={360}
        step={1}
        unit="deg"
        onChange={(v) => onChange({ ...state, hueRotate: v })}
      />
      <SliderControl
        label="Opacity"
        value={state.opacity}
        min={0}
        max={100}
        step={1}
        unit="%"
        onChange={(v) => onChange({ ...state, opacity: v })}
      />
    </div>
  )
}

function BackgroundControls({ state, onChange }) {
  const modes = [
    { value: 'solid', label: 'Solid' },
    { value: 'linear', label: 'Linear Gradient' },
    { value: 'radial', label: 'Radial Gradient' },
  ]

  const addLinearStop = () => {
    if (state.linearStops.length >= 5) return
    const nextStops = [...state.linearStops]
    const lastPos = nextStops[nextStops.length - 1].position
    const newPos = Math.min(100, Math.round(lastPos / 2) + 20)
    nextStops.push({
      id: Date.now(),
      color: '#ec4899',
      position: newPos,
    })
    onChange({ ...state, linearStops: nextStops })
  }

  const removeLinearStop = (idToRemove) => {
    if (state.linearStops.length <= 2) return
    const nextStops = state.linearStops.filter((s) => s.id !== idToRemove)
    onChange({ ...state, linearStops: nextStops })
  }

  const updateLinearStop = (id, partial) => {
    const nextStops = state.linearStops.map((s) =>
      s.id === id ? { ...s, ...partial } : s,
    )
    onChange({ ...state, linearStops: nextStops })
  }

  const updateRadialStop = (index, partial) => {
    const nextStops = [...state.radialStops]
    nextStops[index] = { ...nextStops[index], ...partial }
    onChange({ ...state, radialStops: nextStops })
  }

  return (
    <div className="cp-bg-controls">
      {/* Mode Switcher */}
      <div className="cp-mode-switcher">
        {modes.map((m) => (
          <button
            key={m.value}
            type="button"
            className={`cp-mode-btn ${state.mode === m.value ? 'is-active' : ''}`}
            onClick={() => onChange({ ...state, mode: m.value })}
          >
            {m.label}
          </button>
        ))}
      </div>

      {state.mode === 'solid' && (
        <div className="cp-controls-grid">
          <ColorPickerRow
            label="Solid Color"
            color={state.solidColor}
            onColorChange={(v) => onChange({ ...state, solidColor: v })}
          />
        </div>
      )}

      {state.mode === 'linear' && (
        <div className="cp-controls-grid">
          <SliderControl
            label="Gradient Angle"
            value={state.linearAngle}
            min={0}
            max={360}
            step={1}
            unit="deg"
            onChange={(v) => onChange({ ...state, linearAngle: v })}
          />

          <div className="cp-controls-subhead-row">
            <span className="cp-controls-subhead">Color Stops ({state.linearStops.length}/5)</span>
            {state.linearStops.length < 5 && (
              <button
                type="button"
                className="cp-btn cp-btn-sm cp-btn-ghost"
                onClick={addLinearStop}
              >
                <MdAdd />
                <span>Tambah Stop</span>
              </button>
            )}
          </div>

          {state.linearStops.map((stop, idx) => (
            <div key={stop.id || idx} className="cp-stop-row">
              <div className="cp-stop-header">
                <span className="cp-stop-title">Stop {idx + 1}</span>
                {state.linearStops.length > 2 && (
                  <button
                    type="button"
                    className="cp-btn-icon cp-btn-danger"
                    title="Hapus stop ini"
                    onClick={() => removeLinearStop(stop.id)}
                  >
                    <MdDeleteOutline />
                  </button>
                )}
              </div>
              <ColorPickerRow
                label="Warna"
                color={stop.color}
                onColorChange={(v) => updateLinearStop(stop.id, { color: v })}
              />
              <SliderControl
                label="Posisi Stop"
                value={stop.position}
                min={0}
                max={100}
                step={1}
                unit="%"
                onChange={(v) => updateLinearStop(stop.id, { position: v })}
              />
            </div>
          ))}
        </div>
      )}

      {state.mode === 'radial' && (
        <div className="cp-controls-grid">
          <SelectControl
            label="Radial Shape"
            value={state.radialShape}
            options={[
              { value: 'circle', label: 'Circle' },
              { value: 'ellipse', label: 'Ellipse' },
            ]}
            onChange={(v) => onChange({ ...state, radialShape: v })}
          />

          <div className="cp-controls-subhead">2 Color Stops</div>

          <div className="cp-stop-row">
            <span className="cp-stop-title">Center Stop (Dalam)</span>
            <ColorPickerRow
              label="Warna"
              color={state.radialStops[0].color}
              onColorChange={(v) => updateRadialStop(0, { color: v })}
            />
            <SliderControl
              label="Posisi"
              value={state.radialStops[0].position}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(v) => updateRadialStop(0, { position: v })}
            />
          </div>

          <div className="cp-stop-row">
            <span className="cp-stop-title">Outer Stop (Luar)</span>
            <ColorPickerRow
              label="Warna"
              color={state.radialStops[1].color}
              onColorChange={(v) => updateRadialStop(1, { color: v })}
            />
            <SliderControl
              label="Posisi"
              value={state.radialStops[1].position}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(v) => updateRadialStop(1, { position: v })}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function TypographyControls({ state, onChange }) {
  const fontWeights = [
    { value: '100', label: '100 - Thin' },
    { value: '200', label: '200 - Extra Light' },
    { value: '300', label: '300 - Light' },
    { value: '400', label: '400 - Normal' },
    { value: '500', label: '500 - Medium' },
    { value: '600', label: '600 - Semi Bold' },
    { value: '700', label: '700 - Bold' },
    { value: '800', label: '800 - Extra Bold' },
    { value: '900', label: '900 - Black' },
  ]

  const textTransforms = [
    { value: 'none', label: 'None' },
    { value: 'uppercase', label: 'Uppercase' },
    { value: 'lowercase', label: 'Lowercase' },
    { value: 'capitalize', label: 'Capitalize' },
  ]

  const textAligns = [
    { value: 'left', label: 'Left', icon: MdFormatAlignLeft },
    { value: 'center', label: 'Center', icon: MdFormatAlignCenter },
    { value: 'right', label: 'Right', icon: MdFormatAlignRight },
    { value: 'justify', label: 'Justify', icon: MdFormatAlignJustify },
  ]

  return (
    <div className="cp-controls-grid">
      <SliderControl
        label="Font Size"
        value={state.fontSize}
        min={8}
        max={72}
        step={1}
        unit="px"
        onChange={(v) => onChange({ ...state, fontSize: v })}
      />
      <SelectControl
        label="Font Weight"
        value={state.fontWeight}
        options={fontWeights}
        onChange={(v) => onChange({ ...state, fontWeight: v })}
      />
      <SliderControl
        label="Line Height"
        value={state.lineHeight}
        min={0.5}
        max={3}
        step={0.1}
        onChange={(v) => onChange({ ...state, lineHeight: v })}
      />
      <SliderControl
        label="Letter Spacing"
        value={state.letterSpacing}
        min={-5}
        max={20}
        step={0.5}
        unit="px"
        onChange={(v) => onChange({ ...state, letterSpacing: v })}
      />
      <ColorPickerRow
        label="Text Color"
        color={state.color}
        onColorChange={(v) => onChange({ ...state, color: v })}
      />

      <div className="cp-control-row">
        <label className="cp-control-label">Text Align</label>
        <div className="cp-align-buttons">
          {textAligns.map((ta) => {
            const Icon = ta.icon
            return (
              <button
                key={ta.value}
                type="button"
                className={`cp-align-btn ${state.textAlign === ta.value ? 'is-active' : ''}`}
                title={`Align ${ta.label}`}
                onClick={() => onChange({ ...state, textAlign: ta.value })}
              >
                <Icon />
              </button>
            )
          })}
        </div>
      </div>

      <SelectControl
        label="Text Transform"
        value={state.textTransform}
        options={textTransforms}
        onChange={(v) => onChange({ ...state, textTransform: v })}
      />

      <div className="cp-controls-subhead">Text Shadow</div>
      <ToggleControl
        label="Aktifkan Text Shadow"
        checked={state.enableShadow}
        onChange={(v) => onChange({ ...state, enableShadow: v })}
      />

      {state.enableShadow && (
        <>
          <SliderControl
            label="Shadow Offset X"
            value={state.shadowOffsetX}
            min={-20}
            max={20}
            step={1}
            unit="px"
            onChange={(v) => onChange({ ...state, shadowOffsetX: v })}
          />
          <SliderControl
            label="Shadow Offset Y"
            value={state.shadowOffsetY}
            min={-20}
            max={20}
            step={1}
            unit="px"
            onChange={(v) => onChange({ ...state, shadowOffsetY: v })}
          />
          <SliderControl
            label="Shadow Blur"
            value={state.shadowBlur}
            min={0}
            max={30}
            step={1}
            unit="px"
            onChange={(v) => onChange({ ...state, shadowBlur: v })}
          />
          <ColorPickerRow
            label="Shadow Color"
            color={state.shadowColor}
            opacity={state.shadowOpacity}
            onColorChange={(v) => onChange({ ...state, shadowColor: v })}
            onOpacityChange={(v) => onChange({ ...state, shadowOpacity: v })}
          />
        </>
      )}
    </div>
  )
}

// --- PREVIEW STAGE COMPONENT ---

function PreviewStage({ activeSection, states }) {
  const [backdropTheme, setBackdropTheme] = useState('grid') // 'grid' | 'light' | 'dark'

  const t2d = states['transform-2d']
  const t3d = states['transform-3d']
  const shadows = states['box-shadow']
  const border = states['border']
  const filter = states['filter']
  const bg = states['background']
  const typo = states['typography']

  // Pre-calculated style objects
  const transform2dStyle = useMemo(() => ({
    transform: `rotate(${t2d.rotate}deg) scale(${t2d.scaleX}, ${t2d.scaleY}) translate(${t2d.translateX}px, ${t2d.translateY}px) skew(${t2d.skewX}deg, ${t2d.skewY}deg)`,
  }), [t2d])

  const transform3dContainerStyle = useMemo(() => ({
    perspective: `${t3d.perspective}px`,
    perspectiveOrigin: 'center',
    transformStyle: 'preserve-3d',
  }), [t3d.perspective])

  const transform3dElementStyle = useMemo(() => ({
    transform: `rotateX(${t3d.rotateX}deg) rotateY(${t3d.rotateY}deg) rotateZ(${t3d.rotateZ}deg) translateZ(${t3d.translateZ}px)`,
    transformStyle: 'preserve-3d',
  }), [t3d])

  const boxShadowStyle = useMemo(() => {
    const parts = shadows.map((s) => {
      const colorStr = hexToRgba(s.color, s.opacity)
      return `${s.inset ? 'inset ' : ''}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${colorStr}`
    })
    return {
      boxShadow: parts.join(', '),
    }
  }, [shadows])

  const borderStyle = useMemo(() => ({
    borderRadius: `${border.radiusTopLeft}px ${border.radiusTopRight}px ${border.radiusBottomRight}px ${border.radiusBottomLeft}px`,
    borderWidth: `${border.borderWidth}px`,
    borderStyle: border.borderStyle,
    borderColor: border.borderColor,
  }), [border])

  const filterStyle = useMemo(() => ({
    filter: `blur(${filter.blur}px) brightness(${filter.brightness}%) contrast(${filter.contrast}%) saturate(${filter.saturate}%) hue-rotate(${filter.hueRotate}deg)`,
    opacity: filter.opacity / 100,
  }), [filter])

  const backgroundStyle = useMemo(() => {
    if (bg.mode === 'solid') {
      return { background: bg.solidColor }
    }
    if (bg.mode === 'linear') {
      const stops = bg.linearStops.map((s) => `${s.color} ${s.position}%`).join(', ')
      return { background: `linear-gradient(${bg.linearAngle}deg, ${stops})` }
    }
    const stops = bg.radialStops.map((s) => `${s.color} ${s.position}%`).join(', ')
    return { background: `radial-gradient(${bg.radialShape}, ${stops})` }
  }, [bg])

  const typographyStyle = useMemo(() => {
    const styleObj = {
      fontSize: `${typo.fontSize}px`,
      fontWeight: typo.fontWeight,
      lineHeight: typo.lineHeight,
      letterSpacing: `${typo.letterSpacing}px`,
      color: typo.color,
      textAlign: typo.textAlign,
      textTransform: typo.textTransform,
    }
    if (typo.enableShadow) {
      styleObj.textShadow = `${typo.shadowOffsetX}px ${typo.shadowOffsetY}px ${typo.shadowBlur}px ${hexToRgba(typo.shadowColor, typo.shadowOpacity)}`
    }
    return styleObj
  }, [typo])

  return (
    <div className="cp-preview-wrapper">
      <div className="cp-preview-toolbar">
        <span className="cp-preview-title">
          Live Preview: <strong>{SECTIONS.find((s) => s.id === activeSection)?.label}</strong>
        </span>
        <div className="cp-backdrop-switcher">
          <span className="cp-backdrop-label">Canvas:</span>
          <button
            type="button"
            className={`cp-backdrop-btn ${backdropTheme === 'grid' ? 'is-active' : ''}`}
            onClick={() => setBackdropTheme('grid')}
            title="Grid Checkerboard"
          >
            Grid
          </button>
          <button
            type="button"
            className={`cp-backdrop-btn ${backdropTheme === 'light' ? 'is-active' : ''}`}
            onClick={() => setBackdropTheme('light')}
            title="Light Background"
          >
            Light
          </button>
          <button
            type="button"
            className={`cp-backdrop-btn ${backdropTheme === 'dark' ? 'is-active' : ''}`}
            onClick={() => setBackdropTheme('dark')}
            title="Dark Background"
          >
            Dark
          </button>
        </div>
      </div>

      <div className={`cp-preview-stage is-${backdropTheme}`}>
        {/* SECTION 1: TRANSFORM 2D */}
        {activeSection === 'transform-2d' && (
          <div className="cp-preview-box cp-box-2d" style={transform2dStyle}>
            <div className="cp-box-content">
              <MdOutlineTransform className="cp-box-icon" />
              <span>2D Transform</span>
            </div>
          </div>
        )}

        {/* SECTION 2: TRANSFORM 3D (Wrapped in container with perspective) */}
        {activeSection === 'transform-3d' && (
          <div className="cp-perspective-container" style={transform3dContainerStyle}>
            <div className="cp-preview-box cp-box-3d" style={transform3dElementStyle}>
              <div className="cp-box-3d-card">
                <Md3dRotation className="cp-box-icon" />
                <span className="cp-3d-title">3D Perspective</span>
                <span className="cp-3d-tag">{t3d.perspective}px</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: BOX SHADOW */}
        {activeSection === 'box-shadow' && (
          <div className="cp-preview-box cp-box-shadow" style={boxShadowStyle}>
            <div className="cp-box-content">
              <MdOutlineLayers className="cp-box-icon" />
              <span>Box Shadow</span>
              <span className="cp-shadow-count">{shadows.length} layer active</span>
            </div>
          </div>
        )}

        {/* SECTION 4: BORDER */}
        {activeSection === 'border' && (
          <div className="cp-preview-box cp-box-border" style={borderStyle}>
            <div className="cp-box-content">
              <MdOutlineCropSquare className="cp-box-icon" />
              <span>Custom Border</span>
              <span className="cp-border-detail">
                {border.borderWidth}px {border.borderStyle}
              </span>
            </div>
          </div>
        )}

        {/* SECTION 5: FILTER */}
        {activeSection === 'filter' && (
          <div className="cp-preview-box cp-box-filter" style={filterStyle}>
            <div className="cp-filter-visual">
              <div className="cp-filter-badge">Vibrant Media</div>
              <MdOutlineAutoFixHigh className="cp-box-icon" />
              <p>CSS Filter Effect Preview</p>
              <div className="cp-filter-tags">
                <span>Color</span>
                <span>Contrast</span>
                <span>Blur</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: BACKGROUND */}
        {activeSection === 'background' && (
          <div className="cp-preview-box cp-box-bg" style={backgroundStyle}>
            <div className="cp-bg-pill">
              <MdOutlineGradient className="cp-box-icon-sm" />
              <span>{bg.mode.toUpperCase()} BACKGROUND</span>
            </div>
          </div>
        )}

        {/* SECTION 7: TYPOGRAPHY */}
        {activeSection === 'typography' && (
          <div className="cp-typography-preview-container">
            <p className="cp-typography-text" style={typographyStyle}>
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// --- MAIN CSS PLAYGROUND PAGE COMPONENT ---

export default function CssPlayground() {
  const [activeSection, setActiveSection] = useState('transform-2d')
  const [copiedSection, setCopiedSection] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  // State per section
  const [transform2d, setTransform2d] = useState(DEFAULT_TRANSFORM_2D)
  const [transform3d, setTransform3d] = useState(DEFAULT_TRANSFORM_3D)
  const [shadows, setShadows] = useState(DEFAULT_SHADOWS)
  const [border, setBorder] = useState(DEFAULT_BORDER)
  const [filter, setFilter] = useState(DEFAULT_FILTER)
  const [background, setBackground] = useState(DEFAULT_BACKGROUND)
  const [typography, setTypography] = useState(DEFAULT_TYPOGRAPHY)

  const states = {
    'transform-2d': transform2d,
    'transform-3d': transform3d,
    'box-shadow': shadows,
    border: border,
    filter: filter,
    background: background,
    typography: typography,
  }

  // Auto-generate CSS Output per section
  const generatedCss = useMemo(() => {
    switch (activeSection) {
      case 'transform-2d': {
        return `transform: rotate(${transform2d.rotate}deg) scale(${transform2d.scaleX}, ${transform2d.scaleY}) translate(${transform2d.translateX}px, ${transform2d.translateY}px) skew(${transform2d.skewX}deg, ${transform2d.skewY}deg);`
      }
      case 'transform-3d': {
        return `/* Container Parent */\nperspective: ${transform3d.perspective}px;\n\n/* Elemen */\ntransform: rotateX(${transform3d.rotateX}deg) rotateY(${transform3d.rotateY}deg) rotateZ(${transform3d.rotateZ}deg) translateZ(${transform3d.translateZ}px);`
      }
      case 'box-shadow': {
        const parts = shadows.map((s) => {
          const colorStr = hexToRgba(s.color, s.opacity)
          return `${s.inset ? 'inset ' : ''}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${colorStr}`
        })
        return `box-shadow:\n  ${parts.join(',\n  ')};`
      }
      case 'border': {
        return `border-radius: ${border.radiusTopLeft}px ${border.radiusTopRight}px ${border.radiusBottomRight}px ${border.radiusBottomLeft}px;\nborder: ${border.borderWidth}px ${border.borderStyle} ${border.borderColor};`
      }
      case 'filter': {
        const opVal = (filter.opacity / 100).toFixed(2)
        return `filter: blur(${filter.blur}px) brightness(${filter.brightness}%) contrast(${filter.contrast}%) saturate(${filter.saturate}%) hue-rotate(${filter.hueRotate}deg);\nopacity: ${opVal};`
      }
      case 'background': {
        if (background.mode === 'solid') {
          return `background: ${background.solidColor};`
        }
        if (background.mode === 'linear') {
          const stops = background.linearStops.map((s) => `${s.color} ${s.position}%`).join(', ')
          return `background: linear-gradient(${background.linearAngle}deg, ${stops});`
        }
        const stops = background.radialStops.map((s) => `${s.color} ${s.position}%`).join(', ')
        return `background: radial-gradient(${background.radialShape}, ${stops});`
      }
      case 'typography': {
        const shadowPart = typography.enableShadow
          ? `\ntext-shadow: ${typography.shadowOffsetX}px ${typography.shadowOffsetY}px ${typography.shadowBlur}px ${hexToRgba(typography.shadowColor, typography.shadowOpacity)};`
          : ''
        return `font-size: ${typography.fontSize}px;\nfont-weight: ${typography.fontWeight};\nline-height: ${typography.lineHeight};\nletter-spacing: ${typography.letterSpacing}px;\ncolor: ${typography.color};${shadowPart}\ntext-align: ${typography.textAlign};\ntext-transform: ${typography.textTransform};`
      }
      default:
        return ''
    }
  }, [activeSection, transform2d, transform3d, shadows, border, filter, background, typography])

  // Copy CSS Handler
  const handleCopyCss = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(generatedCss)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = generatedCss
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedSection(activeSection)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      console.error('Failed to copy CSS:', err)
    }
  }

  // Reset per section
  const handleResetSection = () => {
    switch (activeSection) {
      case 'transform-2d':
        setTransform2d(DEFAULT_TRANSFORM_2D)
        break
      case 'transform-3d':
        setTransform3d(DEFAULT_TRANSFORM_3D)
        break
      case 'box-shadow':
        setShadows(DEFAULT_SHADOWS)
        break
      case 'border':
        setBorder(DEFAULT_BORDER)
        break
      case 'filter':
        setFilter(DEFAULT_FILTER)
        break
      case 'background':
        setBackground(DEFAULT_BACKGROUND)
        break
      case 'typography':
        setTypography(DEFAULT_TYPOGRAPHY)
        break
      default:
        break
    }
    showToast(`Section ${SECTIONS.find((s) => s.id === activeSection)?.label} di-reset!`)
  }

  // Reset all sections
  const handleResetAll = () => {
    setTransform2d(DEFAULT_TRANSFORM_2D)
    setTransform3d(DEFAULT_TRANSFORM_3D)
    setShadows(DEFAULT_SHADOWS)
    setBorder(DEFAULT_BORDER)
    setFilter(DEFAULT_FILTER)
    setBackground(DEFAULT_BACKGROUND)
    setTypography(DEFAULT_TYPOGRAPHY)
    showToast('Semua 7 section berhasil di-reset ke nilai default!')
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 2500)
  }

  // Listen to hash change for deep linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash
      const match = hash.match(/^#\/css-playground\/([a-z0-9-]+)/)
      if (match && SECTIONS.some((s) => s.id === match[1])) {
        setActiveSection(match[1])
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const handleSelectSection = (id) => {
    setActiveSection(id)
  }

  const activeMeta = SECTIONS.find((s) => s.id === activeSection)

  return (
    <div className="cp-container">
      {/* Top Header */}
      <header className="cp-header">
        <div className="cp-header-left">
          <a href="#/" className="cp-back-btn" title="Kembali ke Katalog OpenRepo">
            <MdArrowBack />
            <span>Kembali ke OpenRepo</span>
          </a>
          <div className="cp-header-title-box">
            <h1>CSS Playground</h1>
            <p>Eksplorasi dan generate properti CSS secara visual & interaktif</p>
          </div>
        </div>

        <div className="cp-header-actions">
          <button
            type="button"
            className="cp-btn cp-btn-reset-all"
            onClick={handleResetAll}
            title="Reset semua 7 section ke default"
          >
            <MdRestartAlt />
            <span>Reset All</span>
          </button>
        </div>
      </header>

      {/* Main App Layout (3 Kolom: Kiri = Menu Section, Tengah = Controls, Kanan = Preview + Output CSS) */}
      <div className="cp-layout">
        {/* KOLOM 1 (KIRI): Menu PILIH SECTION */}
        <aside className="cp-col-nav" aria-label="Navigasi Section CSS Playground">
          <div className="cp-sidebar-label">PILIH SECTION</div>
          <nav className="cp-sidebar-nav">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon
              const isActive = sec.id === activeSection
              return (
                <a
                  key={sec.id}
                  href={`#/css-playground/${sec.id}`}
                  className={`cp-nav-item ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleSelectSection(sec.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="cp-nav-icon">
                    <Icon />
                  </span>
                  <div className="cp-nav-text">
                    <span className="cp-nav-title">{sec.label}</span>
                    <span className="cp-nav-desc">{sec.desc}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActivePill"
                      className="cp-active-indicator"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              )
            })}
          </nav>
        </aside>

        {/* KOLOM 2 (TENGAH): Controls */}
        <section className="cp-col-controls" aria-label="Kontrol Properti CSS">
          <div className="cp-controls-header">
            <div className="cp-controls-title-group">
              <h2>{activeMeta?.label} Controls</h2>
              <span className="cp-controls-subtitle">{activeMeta?.desc}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="cp-controls-body"
            >
              {activeSection === 'transform-2d' && (
                <Transform2DControls
                  state={transform2d}
                  onChange={setTransform2d}
                />
              )}
              {activeSection === 'transform-3d' && (
                <Transform3DControls
                  state={transform3d}
                  onChange={setTransform3d}
                />
              )}
              {activeSection === 'box-shadow' && (
                <BoxShadowControls
                  shadows={shadows}
                  onChange={setShadows}
                />
              )}
              {activeSection === 'border' && (
                <BorderControls
                  state={border}
                  onChange={setBorder}
                />
              )}
              {activeSection === 'filter' && (
                <FilterControls
                  state={filter}
                  onChange={setFilter}
                />
              )}
              {activeSection === 'background' && (
                <BackgroundControls
                  state={background}
                  onChange={setBackground}
                />
              )}
              {activeSection === 'typography' && (
                <TypographyControls
                  state={typography}
                  onChange={setTypography}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* KOLOM 3 (KANAN): Preview di atas, CSS Output di bawah */}
        <section className="cp-col-preview-output" aria-label="Preview dan Output CSS">
          {/* Kanan Atas: Live Preview Box */}
          <div className="cp-area-preview">
            <PreviewStage activeSection={activeSection} states={states} />
          </div>

          {/* Kanan Bawah: Output CSS */}
          <div className="cp-area-output">
            <div className="cp-output-header">
              <div className="cp-output-title-group">
                <span className="cp-output-badge">CSS Output</span>
                <span className="cp-output-sub">Auto-generated property</span>
              </div>
              <div className="cp-output-actions">
                <button
                  type="button"
                  className="cp-btn cp-btn-reset-section"
                  onClick={handleResetSection}
                  title="Kembalikan section ini ke default"
                >
                  <MdRefresh />
                  <span>Reset Section</span>
                </button>
                <button
                  type="button"
                  className={`cp-btn cp-btn-copy ${copiedSection === activeSection ? 'is-copied' : ''}`}
                  onClick={handleCopyCss}
                  title="Copy CSS ke clipboard"
                >
                  {copiedSection === activeSection ? (
                    <>
                      <MdCheck />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <MdOutlineContentCopy />
                      <span>Copy CSS</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="cp-code-block-wrapper">
              <pre className="cp-code-block">
                <code>{generatedCss}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="cp-toast"
          >
            <MdCheck className="cp-toast-icon" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
