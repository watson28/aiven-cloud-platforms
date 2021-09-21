from typing import Optional, Pattern, Sequence
from .cloud_platforms_repository import CloudPlatformsRepository
from .cloud_platforms_service import CloudPlatformsService, CloudPlatformDownstream, CloudPlatformsUnavailableException
from src.cloud_platforms_model import CloudPlatform, Geolocation
import logging
import re


class CloudPlatformBusiness:
    repository: CloudPlatformsRepository
    service: CloudPlatformsService
    _re_cloud_provider_name: Pattern
    _re_cloud_provider_description: Pattern

    def __init__(self) -> None:
        self.repository = CloudPlatformsRepository()
        self.service = CloudPlatformsService()
        self._re_cloud_provider_name = re.compile(r'^(\w+)-*')
        self._re_cloud_provider_description = re.compile(r'^[\s\w]*\,[\s\w]*\-\s*([\w\s]+)')

    def get_cloud_platforms(self) -> Sequence[CloudPlatform]:
        return self.repository.get_cloud_platforms()

    def hydrate_cloud_platforms(self):
        try:
            logging.info('Hydrating cloud platforms')
            platforms = self.service.get_cloud_platforms()
            transformed_platforms = list(
                map(self._transform_cloud_platform, platforms),
            )
            self.repository.save_cloud_platforms(transformed_platforms)
        except CloudPlatformsUnavailableException:
            pass

    def _transform_cloud_platform(self, platform: CloudPlatformDownstream) -> CloudPlatform:
        return CloudPlatform(
            name=platform['cloud_name'],
            description=platform['cloud_description'],
            provider_name=self._compute_cloud_provider(platform),
            provider_description=self._compute_cloud_provider_description(platform),
            region=platform['geo_region'],
            geolocation=Geolocation(
                latitude=platform['geo_latitude'],
                longitude=platform['geo_longitude']
            )
        )

    def _compute_cloud_provider(self, platform: CloudPlatformDownstream) -> Optional[str]:
        result = self._re_cloud_provider_name.match(platform['cloud_name'])
        if result is None:
            return None
        return result[1]

    def _compute_cloud_provider_description(self, platform: CloudPlatformDownstream) -> Optional[str]:
        result = self._re_cloud_provider_description.match(platform['cloud_description'])
        if result is None:
            return None
        return result[1]
