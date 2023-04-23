import React, { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import useDebouncy from 'use-debouncy/lib/effect'

export default function DebouncedPicker({
  color,
  onChange,
  wait,
}: {
  color?: string
  onChange: (newColor?: string) => void
  wait: number | undefined
}) {
  const [value, setValue] = useState(color)

  useDebouncy(() => onChange(value), wait, [value])

  return <HexColorPicker color={value} onChange={setValue} />
}
