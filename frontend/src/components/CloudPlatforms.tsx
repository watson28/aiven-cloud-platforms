import React, { useState } from 'react'
import CloudPlatformList from './CloudPlatformList'
import Filters from './Filters'
import useCloudPlatforms from '../hooks/useCloudPlatforms'
import useUserLocation from '../hooks/useUserLocation'

function CloudPlatforms() {
  const [cloudProviderFilter, setCloudProviderFilter] = useState<string>('')
  const [maxDistanceFilter, setMaxDistanceFilter] = useState<number>(0)
  const userLocation = useUserLocation()
  const { cloudProviders, cloudPlatforms, maxCloudPlatformDistance, loading } =
    useCloudPlatforms(cloudProviderFilter, maxDistanceFilter, userLocation)

  return (
    <>
      <Filters
        cloudProvider={cloudProviderFilter}
        cloudProviderOptions={cloudProviders}
        maximumDistance={maxDistanceFilter}
        maximumDistanceLimit={maxCloudPlatformDistance}
        maximumDistanceDisabled={userLocation === null}
        onChangeCloudProvider={setCloudProviderFilter}
        onChangeMaximumDistance={setMaxDistanceFilter}
      />
      <CloudPlatformList cloudPlatforms={cloudPlatforms} loading={loading} />
    </>
  )
}

export default CloudPlatforms
