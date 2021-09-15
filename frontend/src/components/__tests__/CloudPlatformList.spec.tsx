import React from 'react'
import { render, screen, within, fireEvent } from '@testing-library/react'
import CloudPlatformList from '../CloudPlatformList'
import faker from 'faker'
import { CloudPlatform } from '../../types'

describe('CloudPlatformList component', () => {
	it('renders cloud platforms', () => {
		const platforms = [
			createTestPlatform(),
			createTestPlatform()
		]
    render(<CloudPlatformList cloudPlatforms={platforms} />)

    const cloudPlatformElements = screen.getAllByTestId('cloud-platform-list--item')
    
    expect(cloudPlatformElements.length).toBe(platforms.length)
    platforms.forEach((platform, index) => {
      expect(
        within(cloudPlatformElements[index]).getByText(platform.name)
      ).toBeInTheDocument()

      expect(
        within(cloudPlatformElements[index]).getByText(platform.description)
      ).toBeInTheDocument()

      expect(
        within(cloudPlatformElements[index]).getByText(platform.region)
      ).toBeInTheDocument()
    })
	})

	it('renders cloud platforms getlocations with fixed decimals', () => {
    const geolocationWithLongDecimals = {
      latitude: 45.456789,
      longitude: 24.12345
    }
    const platforms = [createTestPlatform({ geolocation: geolocationWithLongDecimals })]

    render(<CloudPlatformList cloudPlatforms={platforms} />)

    const formattedLatitude = geolocationWithLongDecimals.latitude.toFixed(2)
    const formattedLongitute = geolocationWithLongDecimals.longitude.toFixed(2)
    expect(
      screen.getByText(`(${formattedLatitude}, ${formattedLongitute})`)
    ).toBeInTheDocument()
  })

	it('renders placeholder while fetching cloud platforms', () => {
    render(<CloudPlatformList cloudPlatforms={[]} loading={true} />)

    expect(
      screen.getByTestId('cloud-platform-list--placeholder')
    ).toBeInTheDocument()
  })
})

function createTestPlatform(data: Partial<CloudPlatform> = {}): CloudPlatform {
	return {
    name: faker.commerce.productName(),
    description: faker.datatype.string(20),
    providerDescription: faker.datatype.string(20),
    region: faker.datatype.string(10),
    geolocation: {
      latitude: parseFloat(faker.address.latitude()),
      longitude: parseFloat(faker.address.longitude())
    },
    ...data
	}
}