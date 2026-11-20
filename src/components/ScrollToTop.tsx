import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Reset the scroll position of the app's main container on every route change. */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.querySelector('main')?.scrollTo({ top: 0 })
    window.scrollTo({ top: 0 })
  }, [pathname])

  return null
}
