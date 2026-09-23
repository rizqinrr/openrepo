import JsonTool from './JsonTool.jsx'
import RegexTool from './RegexTool.jsx'
import EpochTool from './EpochTool.jsx'
import EncoderTool from './EncoderTool.jsx'
import CaseTool from './CaseTool.jsx'
import PasswordTool from './PasswordTool.jsx'
import DiffTool from './DiffTool.jsx'

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
  {
    id: 'case',
    label: 'Case',
    icon: 'text_fields',
    title: 'Case Converter',
    description: 'Ubah teks ke camelCase, snake_case, kebab-case, dan lainnya.',
    Component: CaseTool,
  },
  {
    id: 'password',
    label: 'Password',
    icon: 'password',
    title: 'Password Generator & Checker',
    description: 'Buat password kuat secara acak dan periksa kekuatannya.',
    Component: PasswordTool,
  },
  {
    id: 'diff',
    label: 'Diff',
    icon: 'difference',
    title: 'Text Diff',
    description: 'Bandingkan dua teks dan lihat baris yang berubah.',
    Component: DiffTool,
  },
]

export function findToolById(id) {
  return DEV_TOOL_TABS.find((tool) => tool.id === id) ?? DEV_TOOL_TABS[0]
}