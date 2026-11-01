import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'

/**
 * 数值滚动动画：数值变化时从旧值缓动到新值。
 * @param {{ value: number, className?: string }} props
 */
export default function AnimatedNumber({ value, className }) {
  const count = useMotionValue(value)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.4, ease: 'easeOut' })
    return () => controls.stop()
  }, [count, value])

  return <motion.span className={className}>{rounded}</motion.span>
}
