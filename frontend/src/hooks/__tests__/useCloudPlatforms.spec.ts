import fetchMock from "jest-fetch-mock"
import { CloudPlatform, CloudProvider } from '../../types'
import { renderHook, act } from '@testing-library/react-hooks'
import useCloudPlatforms from '../useCloudPlatforms'

const mockErrorBoundaryHandleError = jest.fn()
jest.mock('react-error-boundary', () => {
  const originalModule = jest.requireActual('react-error-boundary')
  return {
    __esModule: true,
    ...originalModule,
    useErrorHandler: () => mockErrorBoundaryHandleError
  }
})

describe('useCloudPlatforms hook', () => {
  const cloudProviders: CloudProvider[] = [
    { name: 'aws', description: 'Amazon Web Services'},
    { name: 'azure', description: 'Azure' }
  ]
  const cloudPlatforms: CloudPlatform[] = [
    {
      name: 'aws-af-south-1',
      description: 'Africa, South Africa - Amazon Web Services: Cape Town',
      providerName: 'aws',
      providerDescription: 'Amazon Web Services',
      region: 'africa',
      geolocation: {
        latitude: -33.92,
        longitude: 18.42
      }
    },
    {
      name: 'aws-me-south-1',
      description: 'Asia, Bahrain - Amazon Web Services: Bahrain',
      providerName: 'aws',
      providerDescription: 'Amazon Web Services',
      region: 'south asia',
      geolocation: {
        latitude: 26.07,
        longitude: 50.55
      }
    },
      {
        name: '"azure-eastasia',
        description: 'Asia, Hong Kong - Azure: East Asia',
        providerName: 'azure',
        providerDescription: 'Azure',
        region: 'southeast asia',
        geolocation: {
          latitude: 22.5,
          longitude: 114.0
        }
      }
  ]

  beforeEach(() => {
    fetchMock.resetMocks()
    mockErrorBoundaryHandleError.mockClear()
  })

  it('fetches cloud platforms', async () => {
    const mockResponse = fetchMock.mockResponse(JSON.stringify(cloudPlatforms))

    const { waitForNextUpdate, result } = renderHook(() => useCloudPlatforms())
    await waitForNextUpdate()

    expect(mockResponse).toHaveBeenCalled()
    cloudPlatforms.forEach(platform => {
      expect(result.current.cloudPlatforms).toContainEqual(expect.objectContaining(platform))
    })
  })

  it('does not fetch cloud platforms when hook rerender', async () => {
    const mockResponse = fetchMock.mockResponse(JSON.stringify(cloudPlatforms))

    const { waitForNextUpdate, rerender } = renderHook(() => useCloudPlatforms())
    await waitForNextUpdate()

    mockResponse.mockClear()
    rerender()

    expect(mockResponse).not.toHaveBeenCalled()
  })

  it('enable loading flag while data is fetched', async () => {
    fetchMock.mockResponse(() => new Promise(resolve => {}))
    const { result } = renderHook(() => useCloudPlatforms())

    expect(result.current.loading).toBe(true)
  })

  it('disables loading flag after data is fetched', async () => {
    let resolveServerResponse: (response: string) => void = () => {}
    fetchMock.mockResponse(() => new Promise(resolve => {
      resolveServerResponse = resolve
    }))
    const { waitForNextUpdate, result } = renderHook(() => useCloudPlatforms())

    act(() => {
      resolveServerResponse(JSON.stringify([]))
    })
    await waitForNextUpdate()

    expect(result.current.loading).toBe(false)
  })

  it('filters platforms by cloud provider', async () => {
    const providerNameFilter = 'azure'
    fetchMock.mockResponse(JSON.stringify(cloudPlatforms))
    const { result, waitForNextUpdate } = renderHook(() => useCloudPlatforms(providerNameFilter))

    await waitForNextUpdate()

    result.current.cloudPlatforms.forEach(platform => {
      expect(platform.providerName).toBe(providerNameFilter)
    })
  })

  it('filters platforms by maximum distance from location', async () => {
    const providerNameFilter = ''
    const maxDistanceFromLocationKm = 10
    const testPlatform = cloudPlatforms[0]
    const location = {
      latitude: testPlatform.geolocation.latitude + 0.01,
      longitude: testPlatform.geolocation.longitude + 0.01
    }
    fetchMock.mockResponse(JSON.stringify(cloudPlatforms))
    const { result, waitForNextUpdate } = renderHook(() => useCloudPlatforms(
      providerNameFilter,
      maxDistanceFromLocationKm,
      location
    ))

    await waitForNextUpdate()

    expect(result.current.cloudPlatforms.length).toBe(1)
    expect(result.current.cloudPlatforms[0]).toEqual(expect.objectContaining(testPlatform))
  })

  it('emits error to errorBoundary when data fetch fails', async () => {
    const error = new Error('And unexpected error has ocurred')
    fetchMock.mockReject(error)

    const { waitForNextUpdate } = renderHook(() => useCloudPlatforms())
    await waitForNextUpdate()

    expect(mockErrorBoundaryHandleError).toHaveBeenCalledWith(error)
  })

  it('generates cloud providers from cloud platforms', async () => {
    fetchMock.mockResponse(JSON.stringify(cloudPlatforms))
    const { result, waitForNextUpdate } = renderHook(() => useCloudPlatforms())

    await waitForNextUpdate()

    expect(result.current.cloudProviders).toEqual(cloudProviders)
  })
})