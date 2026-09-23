import JsonTool from './JsonTool.jsx'

export const DEV_TOOL_TABS = [
  {
    id: 'json',
    label: 'JSON',
    icon: 'data_object',
    title: 'JSON Formatter & Validator',
    description: 'Format, minify, dan validasi teks JSON langsung di browser.',
    Component: JsonTool,
  },
]

export function findToolById(id) {
  return DEV_TOOL_TABS.find((tool) => tool.id === id) ?? DEV_TOOL_TABS[0]
}