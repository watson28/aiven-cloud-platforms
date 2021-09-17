import { useEffect, useState } from "react"
import { Geolocation } from '../types'

function useUserLocation() {
  const [position, setPosition] = useState<Geolocation | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      })
    }
  }, [])

  return position
}

export default useUserLocation