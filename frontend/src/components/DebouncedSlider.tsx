import { default as Slider, SliderProps } from '@material-ui/core/Slider'
import React, { useState, useEffect, useCallback, useRef } from "react"

type DebouncedSliderProps<D extends React.ElementType, P> = SliderProps<D, P> & {delay: number}

function DebouncedSlider<D extends React.ElementType, T>(props: DebouncedSliderProps<D, T>) {
  const { value, onChange, delay: time } = props
  const [internalValue, setInternalValue] = useState<SliderProps['value']>(props.defaultValue)
  const onChangeEventRef = useRef<React.ChangeEvent<{}>>()

  const handleChange = useCallback((event: React.ChangeEvent<{}>, value: number | number[]) => {
    onChangeEventRef.current = event
    setInternalValue(value instanceof Array ? value[0] : value)
  }, [])

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onChange !== undefined && onChangeEventRef.current !== undefined && internalValue !== undefined) {
        onChange(onChangeEventRef.current, internalValue)
      }
    }, time)
    return () => clearTimeout(handler)
  }, [internalValue, onChange, time])

  return (
    <Slider {...props} value={internalValue} onChange={handleChange} />
  )
}

export default DebouncedSlider