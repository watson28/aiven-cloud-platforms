export interface CloudPlatform {
  name: string
  description: string
  providerName: string
  providerDescription: string
  region: string
  geolocation: Geolocation
}

export interface CloudProvider {
  name: string
  description: string
}

export interface Geolocation {
  latitude: number
  longitude: number
}
