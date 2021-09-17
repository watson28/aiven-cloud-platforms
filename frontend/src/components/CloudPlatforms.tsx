import React, { useState } from 'react'
import CloudPlatformList from './CloudPlatformList'
import Filters from './Filters'
import { CloudProvider } from '../types'
import useCloudPlatforms from '../hooks/useCloudPlatforms'

const cloudProviders: CloudProvider[] = [
  { name: 'aws', description: 'Amazon Web Services'},
  { name: 'google', description: 'Google Cloud'},
  { name: 'do', description: 'DigitalOcean'},
]

function CloudPlatforms() {
  const [cloudProviderFilter, setCloudProviderFilter] = useState<string>('')
  const [maxDistanceFilter, setMaxDistanceFilter] = useState<number>(0)
  const { cloudPlatforms, loading } = useCloudPlatforms(cloudProviderFilter)

  return (
    <>
      <Filters
        cloudProvider={cloudProviderFilter}
        cloudProviderOptions={cloudProviders}
        maximumDistance={maxDistanceFilter}
        onChangeCloudProvider={setCloudProviderFilter}
        onChangeMaximumDistance={setMaxDistanceFilter}
      />
      <CloudPlatformList cloudPlatforms={cloudPlatforms} loading={loading} />
    </>
  )
}

export default CloudPlatforms