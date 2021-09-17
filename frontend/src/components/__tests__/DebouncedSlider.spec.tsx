import { SliderProps } from "@material-ui/core"
import DebouncedSlider from '../DebouncedSlider'
import { render, screen, fireEvent, act } from '@testing-library/react'

const mockSliderTestId = 'slider-input'
jest.mock('@material-ui/core/Slider', () => (props: SliderProps) => {
  const { id, name, min, max, onChange } = props
  return (
    <input
      data-testid={mockSliderTestId}
      type="range"
      id={id}
      name={name}
      min={min}
      max={max}
      onChange={(event) => onChange && onChange(event, parseInt(event.target.value))}
    />
  )
})

describe('DebouncedSlider component', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  
  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  it('does not emit changes before debounce delay', () => {
    const delay = 500
    const onChange = jest.fn()
    render(<DebouncedSlider delay={delay} onChange={onChange} />)

    fireEvent.change(
      screen.getByTestId(mockSliderTestId),
      { target: { value: 25 } }
    )
    act(() => {
      jest.advanceTimersByTime(delay / 2)
    })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('emits changes after debounce delay', () => {
    const delay = 500
    const newValue = 25
    const onChange = jest.fn()
    render(<DebouncedSlider delay={delay} onChange={onChange} />)

    fireEvent.change(
      screen.getByTestId(mockSliderTestId),
      { target: { value: newValue } }
    )
    act(() => {
      jest.advanceTimersByTime(delay)
    })

    expect(onChange).toHaveBeenCalledWith(expect.anything(), newValue)
  })
})