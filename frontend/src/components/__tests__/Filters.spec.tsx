import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Filters from '../Filters'
import { CloudProvider } from '../../types'
import { SliderProps } from '@material-ui/core'

jest.mock('@material-ui/core/Slider', () => (props: SliderProps) => {
  const { id, name, min, max, onChange } = props
  return (
    <input
      data-testid="filters--max-distance-input"
      type="range"
      id={id}
      name={name}
      min={min}
      max={max}
      onChange={(event) => onChange && onChange(event, parseInt(event.target.value))}
    />
  )
})

describe('Filters component', () => {
  const cloudProviderLabel = 'Cloud Provider'
  const cloudProviders: CloudProvider[] = [
    { name: 'aws', description: 'Amazon Web Services'},
    { name: 'google', description: 'Google Cloud'},
    { name: 'do', description: 'DigitalOcean'},
  ]

	it('emit changes when cloud provider filter changes', () => {
    const onChangeCloudProvider = jest.fn()
    const option = cloudProviders[0]
    render(<Filters
      cloudProvider=""
      cloudProviderOptions={cloudProviders}
      maximumDistance={0}
      onChangeCloudProvider={onChangeCloudProvider}
    />)

    fireEvent.mouseDown(screen.getByLabelText(cloudProviderLabel))
    fireEvent.click(screen.getByText(option.description))

    expect(onChangeCloudProvider).toHaveBeenCalledWith(option.name)
  })

  it('emits changes when max distance changes', () => {
    const onChangeMaxDistance = jest.fn()
    render(<Filters
      cloudProvider=""
      cloudProviderOptions={cloudProviders}
      maximumDistance={0}
      onChangeMaximumDistance={onChangeMaxDistance}
    />)

    fireEvent.change(
      screen.getByTestId('filters--max-distance-input'),
      { target: { value: 25 } }
    )

    expect(onChangeMaxDistance).toHaveBeenCalledWith(25)
  })
})