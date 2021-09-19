from src.cloud_platforms_repository import CloudPlatformsRepository
from src.cloud_platforms_service import CloudPlatformDownstream
from unittest.mock import MagicMock, patch
from src.cloud_platforms_business import CloudPlatform, CloudPlatformBusiness, Geolocation


cloud_platform_from_service: CloudPlatformDownstream = {
	'cloud_description': 'Europe, Norway - Azure: Norway West',
	'cloud_name': 'azure-norway-west',
    'geo_latitude': 58.97,
    'geo_longitude': 5.73,
    'geo_region': 'europe'
}

transformed_cloud_platform: CloudPlatform = CloudPlatform(
	name=cloud_platform_from_service['cloud_name'],
	description=cloud_platform_from_service['cloud_description'],
	region=cloud_platform_from_service['geo_region'],
	geolocation=Geolocation(
		latitude=cloud_platform_from_service['geo_latitude'],
		longitude=cloud_platform_from_service['geo_longitude']
	),
	provider_name='azure',
	provider_description='Azure'
)


@patch('src.cloud_platforms_business.CloudPlatformsRepository', autospec=True)
@patch('src.cloud_platforms_business.CloudPlatformsService', autospec=True)
def test_save_transformed_platforms_when_hydrating(CloudPlatformServiceMock: MagicMock, CloudPlatformsRepositoryMock: MagicMock):
	CloudPlatformServiceMock.return_value.get_cloud_platforms.return_value = [
		cloud_platform_from_service
	]

	platform_business = CloudPlatformBusiness()
	platform_business.hydrate_cloud_platforms()

	CloudPlatformsRepositoryMock.return_value.save_cloud_platforms.assert_called_with([transformed_cloud_platform])


@patch('src.cloud_platforms_business.CloudPlatformsRepository', autospec=True)
@patch('src.cloud_platforms_business.CloudPlatformsService', autospec=True)
def test_save_cloud_provider_name_with_none_when_format_is_wrong(CloudPlatformServiceMock: MagicMock, CloudPlatformsRepositoryMock: MagicMock):
	cloud_platform_with_wrong_name = cloud_platform_from_service.copy()
	cloud_platform_with_wrong_name['cloud_name'] = '$$$$'
	CloudPlatformServiceMock.return_value.get_cloud_platforms.return_value = [
		cloud_platform_with_wrong_name
	]

	platform_business = CloudPlatformBusiness()
	platform_business.hydrate_cloud_platforms()

	first_save_call = CloudPlatformsRepositoryMock.return_value.save_cloud_platforms.call_args_list[0]
	assert first_save_call[0][0][0].provider_name == None
	

@patch('src.cloud_platforms_business.CloudPlatformsRepository', autospec=True)
@patch('src.cloud_platforms_business.CloudPlatformsService', autospec=True)
def test_save_provider_description_from_platform_description(CloudPlatformServiceMock: MagicMock, CloudPlatformsRepositoryMock: MagicMock):
	cloud_platform_with_wrong_description = cloud_platform_from_service.copy()
	cloud_platform_with_wrong_description['cloud_description'] = '$$$$'
	CloudPlatformServiceMock.return_value.get_cloud_platforms.return_value = [
		cloud_platform_with_wrong_description
	]

	platform_business = CloudPlatformBusiness()
	platform_business.hydrate_cloud_platforms()

	first_save_call = CloudPlatformsRepositoryMock.return_value.save_cloud_platforms.call_args_list[0]
	assert first_save_call[0][0][0].provider_description == None