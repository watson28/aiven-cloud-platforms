export interface CloudPlatform {
  name: string
  description: string
  providerName: string
  providerDescription: string
  region: string
  geolocation: {
    latitude: number
    longitude: number
  }
}

export interface CloudProvider {
  name: string
  description: string
}
