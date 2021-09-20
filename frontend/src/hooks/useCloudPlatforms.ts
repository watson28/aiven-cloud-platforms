import { useState, useEffect, useMemo } from 'react'
import { CloudPlatform, CloudProvider, Geolocation } from '../types'
import { useErrorHandler } from 'react-error-boundary'

const getCloudPlatforms = (): Promise<CloudPlatform[]> => {
  const serviceUrl = process.env.REACT_APP_SERVICE_URL
  if (!serviceUrl) {
    throw new Error('Service url not defined in application.')
  }

  return fetch(`${serviceUrl}/cloud-platforms`).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  })
}
/*
 * https://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates 
 */
const getDistanceKm = (loc1: Geolocation, loc2: Geolocation) => {
  const degreesToRadians = (degrees: number) => degrees * Math.PI / 180
  const earthRadiusKm = 6371

  const dLat = degreesToRadians(loc2.latitude - loc1.latitude)
  const dLon = degreesToRadians(loc2.longitude - loc1.longitude)

  const lat1 = degreesToRadians(loc1.latitude)
  const lat2 = degreesToRadians(loc2.latitude)

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) 
  return earthRadiusKm * c
}

interface CloudPlatformWithDistance extends CloudPlatform {
  distanceKm: number
}

function useCloudPlatforms(
  cloudProvider: string = '',
  maxDistanceFromLocation: number = 0,
  location: Geolocation | null = null
) {
  const handleError = useErrorHandler()
  const [loading, setLoading] = useState<boolean>(true)
  const [cloudPlatforms, setCloudPlatforms] = useState<CloudPlatform[]>([])

  const cloudProviders = useMemo<CloudProvider[]>(() => {
    const providerRecords = cloudPlatforms.reduce((acc, platform) => {
      acc[platform.providerName] = platform.providerDescription
      return acc
    }, {} as Record<string, string>)

    return Object.entries(providerRecords)
      .map(([name, description]) => ({ name, description }))
  }, [cloudPlatforms])

  const cloudPlatformsWithDistance = useMemo<CloudPlatformWithDistance[]>(() => {
    return cloudPlatforms.map(platform => ({
      ...platform,
      distanceKm: location ? getDistanceKm(platform.geolocation, location): 0
    }))
  }, [cloudPlatforms, location])

  const maxCloudPlatformDistance = useMemo(() => {
    return cloudPlatformsWithDistance.reduce((maxDistance, platform) => {
      return Math.max(maxDistance, platform.distanceKm)
    }, Number.MIN_VALUE)
  }, [cloudPlatformsWithDistance])

  const visibleCloudPlatforms = useMemo(() => {
    return cloudPlatformsWithDistance.filter(platform =>(
		(!cloudProvider || platform.providerName === cloudProvider)
    && (maxDistanceFromLocation === 0 || platform.distanceKm <= maxDistanceFromLocation)
	))
  }, [cloudPlatformsWithDistance, cloudProvider, maxDistanceFromLocation])

  useEffect(() => {
    let canceled = false

    setLoading(true)
    getCloudPlatforms()
    .then(response => {
      if (!canceled) setCloudPlatforms(response)
    })
    .catch(handleError)
    .finally(() => {
      if (!canceled) setLoading(false)
    })

    return () => {
      canceled = true
    }
  }, [handleError])

  return {
    cloudProviders,
	  cloudPlatforms: visibleCloudPlatforms,
    maxCloudPlatformDistance,
	  loading,
  }
}

export default useCloudPlatforms