import { useState, useEffect } from 'react'
import { CloudPlatform } from '../types'
import { useErrorHandler } from 'react-error-boundary'

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

function useCloudPlatforms(cloudProvider: string = '') {
  const handleError = useErrorHandler()
  const [loading, setLoading] = useState<boolean>(true)
  const [cloudPlatforms, setCloudPlatforms] = useState<CloudPlatform[]>([])

  const visibleCloudPlatforms = cloudPlatforms.filter(platform =>(
		!cloudProvider || platform.providerName === cloudProvider
	))

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
	  cloudPlatforms: visibleCloudPlatforms,
	  loading,
  }
}

export default useCloudPlatforms