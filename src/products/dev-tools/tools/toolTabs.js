import JsonTool from './JsonTool.jsx'
import RegexTool from './RegexTool.jsx'
import EpochTool from './EpochTool.jsx'
import EncoderTool from './EncoderTool.jsx'

export const DEV_TOOL_TABS = [
  {
    id: 'json',
    label: 'JSON',
    icon: 'data_object',
    title: 'JSON Formatter & Validator',
    description: 'Format, minify, dan validasi teks JSON langsung di browser.',
    Component: JsonTool,
  },
  {
    id: 'regex',
    label: 'Regex',
    icon: 'manage_search',
    title: 'Regex Tester',
    description: 'Uji pola regex dan lihat setiap match beserta group capture.',
    Component: RegexTool,
  },
  {
    id: 'epoch',
    label: 'Timestamp',
    icon: 'schedule',
    title: 'Epoch & Timestamp Converter',
    description: 'Konversi antara Unix timestamp (detik/milidetik) dan tanggal.',
    Component: EpochTool,
  },
  {
    id: 'encoder',
    label: 'Encode',
    icon: 'swap_horiz',
    title: 'Base64 & URL Encoder-Decoder',
    description: 'Encode dan decode Base64 serta URL encoding langsung di browser.',
    Component: EncoderTool,
  },
]

export function findToolById(id) {
  return DEV_TOOL_TABS.find((tool) => tool.id === id) ?? DEV_TOOL_TABS[0]
}