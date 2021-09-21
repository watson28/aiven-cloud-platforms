from typing import List
import json
import pytest # type: ignore
from src.cloud_platforms_model import CloudPlatform, Geolocation
from src.cloud_platforms_repository import CloudPlatformsRepository, CloudPlatformNotFoundException
from unittest import TestCase
from unittest.mock import MagicMock, patch, mock_open


cloud_platforms: List[CloudPlatform] = [CloudPlatform(
	name='azure-norway-west',
	description='Europe, Norway - Azure: Norway West',
	region='europe',
	geolocation=Geolocation(latitude=5.0, longitude=6.0),
	provider_name='azure',
	provider_description='Azure'
)]

json_cloud_platforms = json.dumps([p.dict() for p in cloud_platforms])

@patch('src.cloud_platforms_repository.Path', autospec=True)
@patch("builtins.open", new_callable=mock_open, read_data="")
class TestCloudPlatformsRepository(TestCase):
	def test_loads_cache_from_file(self, mock_file: MagicMock, *args):
		CloudPlatformsRepository()

		mock_file.assert_called_with(CloudPlatformsRepository._CACHE_FILE_PATH)

	def test_returns_cloud_platforms_from_cache(self, *args):
		with patch("builtins.open", mock_open(read_data=json_cloud_platforms)):
			repository = CloudPlatformsRepository()

			assert repository.get_cloud_platforms() == cloud_platforms	

	def test_update_cache_when_saving_cloud_platforms(self, mock_file: MagicMock, *args):
		repository = CloudPlatformsRepository()

		repository.save_cloud_platforms(cloud_platforms)

		mock_file.assert_called_with(CloudPlatformsRepository._CACHE_FILE_PATH, 'w')
		mock_file.return_value.write.assert_called()

	def test_get_cloud_platforms_raise_exception_when_data_not_found(self, *args):
		repository = CloudPlatformsRepository()

		with pytest.raises(CloudPlatformNotFoundException):
			repository.get_cloud_platforms()
		