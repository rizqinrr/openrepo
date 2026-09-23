import JsonTool from './JsonTool.jsx'
import RegexTool from './RegexTool.jsx'

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
]

export function findToolById(id) {
  return DEV_TOOL_TABS.find((tool) => tool.id === id) ?? DEV_TOOL_TABS[0]
}