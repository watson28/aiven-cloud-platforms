from json.decoder import JSONDecodeError
from typing import Any, Sequence, TypedDict, Union, cast
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


class Geolocation:
	latitude: float
	longitude: float


class CloudPlatform:
	name: str
	description: str
	provider_name: str
	provider_description: str
	region: str
	geolocation: Geolocation


# next lines type ignored because of fix not released yet: https://github.com/samuelcolvin/pydantic/issues/3008
CloudPlatformDownstreamResponseModel = create_model_from_typeddict(CloudPlatformDownstreamResponse) # type: ignore
CloudPlatformDownstreamModel = create_model_from_typeddict(CloudPlatformDownstream) # type: ignore

class CloudPlatformsUnavailableException(BaseException):
	pass

class CloudPlatformsService:
	def get_cloud_platforms(self) -> Sequence[CloudPlatformDownstream]:
		response = requests.get(
			f'{settings.aiven_service_url}/clouds', 
			headers={ 'Authorization': f'aivenv1 {settings.aiven_auth_token}' }
		)

		if response.status_code != 200:
			logging.error(f'Invalid status code received: {response.status_code}')
			raise CloudPlatformsUnavailableException()

		try:
			response_content: dict = response.json()
			response_model = CloudPlatformDownstreamResponseModel(**response_content)
			validated_cloud_platforms = map(self._validate_cloud_platform, response_model.clouds)

			return list(filter(lambda platform: platform is not None, validated_cloud_platforms))
		except JSONDecodeError:
			logging.exception('Invalid JSON content received from downstream service')
			raise CloudPlatformsUnavailableException()
		except ValidationError as e:
			logging.exception('Invalid clouds format received from downstream service')
			raise CloudPlatformsUnavailableException()

	def _validate_cloud_platform(self, cloud_platform_dict: CloudPlatformDownstream) -> Union[CloudPlatformDownstream, None]:
		try:
			return cast(CloudPlatformDownstream, CloudPlatformDownstreamModel(**cloud_platform_dict).dict())
		except ValidationError:
			logging.exception('Invalid cloud platform format received.')
			return None