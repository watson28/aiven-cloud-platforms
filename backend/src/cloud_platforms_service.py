from json.decoder import JSONDecodeError
from typing import Any, List, Optional, Sequence, TypedDict, cast
from pydantic import create_model_from_typeddict, ValidationError
import logging
import requests
from .config import settings


class CloudPlatformDownstream(TypedDict):
    cloud_description: str
    cloud_name: str
    geo_latitude: float
    geo_longitude: float
    geo_region: str


class CloudPlatformDownstreamResponse(TypedDict):
    clouds: Sequence[Any]
    # errors: Optional[Sequence[Any]] = None


# next lines type ignored because of fix not released yet: https://github.com/samuelcolvin/pydantic/issues/3008
CloudPlatformDownstreamResponseModel = create_model_from_typeddict(CloudPlatformDownstreamResponse)  # type: ignore
CloudPlatformDownstreamModel = create_model_from_typeddict(CloudPlatformDownstream)  # type: ignore


class CloudPlatformsUnavailableException(BaseException):
    pass


class CloudPlatformsService:
    def get_cloud_platforms(self) -> Sequence[CloudPlatformDownstream]:
        try:
            response = requests.get(
                f'{settings.aiven_service_url}/clouds',
                headers={'Authorization': f'aivenv1 {settings.aiven_auth_token}'}
            )

            if response.status_code != 200:
                logging.error(f'Invalid status code received: {response.status_code}')
                raise CloudPlatformsUnavailableException()

            response_content = response.json()
            self._validate_cloud_platform_response(response_content)
            validated_cloud_platforms = map(
                self._map_valid_cloud_platform_or_none,
                cast(CloudPlatformDownstreamResponse, response_content)['clouds']
            )
            return cast(
                List[CloudPlatformDownstream],
                list(filter(lambda platform: platform is not None, validated_cloud_platforms))
            )

        except requests.exceptions.RequestException:
            logging.error('Failed to connect to Aiven service')
            raise CloudPlatformsUnavailableException()
        except JSONDecodeError:
            logging.error('Invalid JSON content received from downstream service')
            raise CloudPlatformsUnavailableException()
        except ValidationError:
            logging.error('Invalid clouds format received from downstream service')
            raise CloudPlatformsUnavailableException()

    def _map_valid_cloud_platform_or_none(self, cloud_platform: dict) -> Optional[CloudPlatformDownstream]:
        try:
            self._validate_cloud_platform(cloud_platform)
            return cast(CloudPlatformDownstream, cloud_platform)
        except ValidationError:
            logging.error('Invalid cloud platform format received.')
            return None

    def _validate_cloud_platform(self, cloud_platform_dict: dict):
        CloudPlatformDownstreamModel(**cloud_platform_dict)

    def _validate_cloud_platform_response(self, response: dict):
        CloudPlatformDownstreamResponseModel(**response)
