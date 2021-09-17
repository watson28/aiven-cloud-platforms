import React from 'react'
import App from '../App'
import { render } from '@testing-library/react'
import useCloudPlatforms from '../../hooks/useCloudPlatforms'

jest.mock('../../hooks/useCloudPlatforms', (): typeof useCloudPlatforms => {
  return () => ({
    cloudPlatforms: [],
    loading: false,
    maxCloudPlatformDistance: 0
  })
})

describe('App component', () => {
	it('renders without errors', () => {
    render(<App />)
  })
})