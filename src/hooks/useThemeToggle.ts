import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useThemeStore } from '@/stores/themeStore'
const isBrowser = typeof window !== 'undefined'

// Inject base CSS for view transitions
const injectBaseStyles = () => {
  if (isBrowser) {
    const styleId = 'theme-switch-base-style'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      const isHighResolution = window.innerWidth >= 3000 || window.innerHeight >= 2000

      style.textContent = `
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
          ${isHighResolution ? 'transform: translateZ(0);' : ''}
        }
        
        ${isHighResolution
          ? `
        ::view-transition-group(root),
        ::view-transition-image-pair(root),
        ::view-transition-old(root),
        ::view-transition-new(root) {
          backface-visibility: hidden;
          perspective: 1000px;
          transform: translate3d(0, 0, 0);
        }
        `
          : ''
        }
      `
      document.head.appendChild(style)
    }
  }
}

interface ReactThemeSwitchAnimationHook {
  ref: React.RefObject<HTMLButtonElement>
  toggleSwitchTheme: () => Promise<void>
  isDarkMode: boolean
}

export interface ReactThemeSwitchAnimationProps {
  duration?: number
  easing?: string
  pseudoElement?: string
  globalClassName?: string
  blurAmount?: number
  styleId?: string
  isDarkMode?: boolean
  onDarkModeChange?: (isDark: boolean) => void
}

export const useModeAnimation = (props?: ReactThemeSwitchAnimationProps): ReactThemeSwitchAnimationHook => {
  const {
    duration: propsDuration = 750,
    easing = 'ease-in-out',
    pseudoElement = '::view-transition-new(root)',
    globalClassName = 'dark',
    styleId = 'theme-switch-style',
    isDarkMode: externalDarkMode,
    onDarkModeChange,
  } = props || {}

  const isHighResolution = typeof window !== 'undefined' && (window.innerWidth >= 3000 || window.innerHeight >= 2000)

  const duration = isHighResolution ? Math.max(propsDuration * 0.8, 500) : propsDuration

  // Inject base styles when the hook is initialized
  useEffect(() => {
    injectBaseStyles()
  }, [])

  const [internalDarkMode, setInternalDarkMode] = useState(isBrowser ? localStorage.getItem('theme') === 'dark' : false)

  const isDarkMode = externalDarkMode ?? internalDarkMode
  const setIsDarkMode = (value: boolean | ((prev: boolean) => boolean)) => {
    const newValue = typeof value === 'function' ? value(isDarkMode) : value
    if (onDarkModeChange) {
      onDarkModeChange(newValue)
    } else {
      setInternalDarkMode(newValue)
    }
  }

  const ref = useRef<HTMLButtonElement>(document.createElement('button'))

  const toggleSwitchTheme = async () => {
    if (
      !ref.current ||
      !(document as any).startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsDarkMode((isDarkMode) => !isDarkMode)
      return
    }

    const existingStyle = document.getElementById(styleId)
    if (existingStyle) {
      existingStyle.remove()
    }

    const { top, left, width, height } = ref.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2

    // Calculate the distance to each corner of the viewport
    const topLeft = Math.hypot(x, y)
    const topRight = Math.hypot(window.innerWidth - x, y)
    const bottomLeft = Math.hypot(x, window.innerHeight - y)
    const bottomRight = Math.hypot(window.innerWidth - x, window.innerHeight - y)

    // Find the maximum distance to ensure animation covers the entire viewport
    const maxRadius = Math.max(topLeft, topRight, bottomLeft, bottomRight)

    await (document as any).startViewTransition(() => {
      flushSync(() => {
        setIsDarkMode(!isDarkMode)
      })
    }).ready

    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
      },
      {
        duration,
        easing,
        pseudoElement,
      }
    )
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add(globalClassName)
      useThemeStore.setState({ theme: 'dark' })
    } else {
      document.documentElement.classList.remove(globalClassName)
      useThemeStore.setState({ theme: 'light' })
    }
  }, [isDarkMode, globalClassName])

  return {
    ref,
    toggleSwitchTheme,
    isDarkMode,
  }
}
