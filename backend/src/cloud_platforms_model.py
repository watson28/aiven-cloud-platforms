from typing import Optional
from fastapi_utils.api_model import APIModel


class Geolocation(APIModel):
    latitude: float
    longitude: float


class CloudPlatform(APIModel):
    name: str
    description: str
    provider_name: Optional[str]
    provider_description: Optional[str]
    region: str
    geolocation: Geolocation
