import React from 'react'
import App from '../App'
import { render } from '@testing-library/react'
import useCloudPlatforms from '../../hooks/useCloudPlatforms'

jest.mock('../../hooks/useCloudPlatforms', (): typeof useCloudPlatforms => {
  return () => ({
    cloudProviders: [],
    cloudPlatforms: [],
    loading: false,
    maxCloudPlatformDistance: 0
  })
})

describe('App component', () => {
	it('renders without errors', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    render(<App />)

    expect(spy).not.toHaveBeenCalled()

    spy.mockRestore()
  })
})