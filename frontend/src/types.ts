export interface CloudPlatform {
  name: string
  description: string
  providerDescription: string
  region: string
  geolocation: {
    latitude: number
    longitude: number
  }
}
