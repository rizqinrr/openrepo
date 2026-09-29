import { useEffect, useRef } from 'react'

export function useReveal() {
  const refs = useRef([])

  useEffect(() => {
    const nodes = refs.current.filter(Boolean)
    if (!nodes.length) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((node) => node.classList.add('is-in'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const setRef = (index) => (element) => {
    refs.current[index] = element
  }

  return setRef
}