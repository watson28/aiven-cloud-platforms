from dataclasses import dataclass
from typing import Optional

@dataclass
class Geolocation:
	latitude: float
	longitude: float


@dataclass
class CloudPlatform:
	name: str
	description: str
	provider_name: Optional[str]
	provider_description: Optional[str]
	region: str
	geolocation: Geolocation

