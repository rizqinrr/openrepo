export function getHashSegments(hash = window.location.hash) {
  return hash.replace(/^#\/?/, '').split('/').filter(Boolean)
}
