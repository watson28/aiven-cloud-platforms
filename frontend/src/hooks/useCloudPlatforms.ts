import { useState, useEffect } from 'react'
import { CloudPlatform } from '../types'

const getCloudPlatforms = (): Promise<CloudPlatform[]> => {
  const serviceUrl = process.env.REACT_APP_SERVICE_URL
  if (!serviceUrl) {
    throw new Error('Service url not defined in application.')
  }

  return fetch(serviceUrl).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  })
}

function useCloudPlatforms() {
  const [loading, setLoading] = useState<boolean>(true)
  const [cloudPlatforms, setCloudPlatforms] = useState<CloudPlatform[]>([])

  useEffect(() => {
    getCloudPlatforms()
    .then(setCloudPlatforms)
    .finally(() => setLoading(false))
  }, [])

  return {
	  cloudPlatforms,
	  loading
  }
}

export default useCloudPlatforms