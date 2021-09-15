import React, { useEffect, useState } from 'react'
import CloudPlatformList from './components/CloudPlatformList'
import { CloudPlatform } from './types'

const getCloudPlatforms = (): Promise<CloudPlatform[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          name: 'aws-af-south-1',
          description: 'Africa, South Africa - Amazon Web Services: Cape Town',
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
          providerDescription: 'Amazon Web Services',
          region: 'south asia',
          geolocation: {
            latitude: 26.07,
            longitude: 50.55
          }
        }
      ])
    }, 5000)
  })
}

function App() {
  const [cloudPlatforms, setCloudPlatforms] = useState<CloudPlatform[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getCloudPlatforms()
    .then(setCloudPlatforms)
    .finally(() => setLoading(false))
  }, [])

  return (
    <div className="App">
      <CloudPlatformList cloudPlatforms={cloudPlatforms} loading={loading} />
    </div>
  )
}

export default App
