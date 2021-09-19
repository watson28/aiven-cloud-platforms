from unittest.mock import MagicMock, patch
from src.cloud_platforms_service import CloudPlatformDownstream, CloudPlatformsService, CloudPlatformsUnavailableException
from json.decoder import JSONDecodeError
import pytest

@patch('src.cloud_platforms_service.requests', autospec=True)
def test_raise_exception_when_downstream_service_not_returns_200(mock_requests: MagicMock):
	mock_requests.get.return_value.status_code = 500
	service = CloudPlatformsService()

	with pytest.raises(CloudPlatformsUnavailableException):
		service.get_cloud_platforms()
	

@patch('src.cloud_platforms_service.requests', autospec=True)
def test_raise_exception_when_downstream_service_returns_invalid_response(mock_requests: MagicMock):
	mock_requests.get.return_value.json.side_effect = JSONDecodeError('test error', '', 0)
	service = CloudPlatformsService()

	with pytest.raises(CloudPlatformsUnavailableException):
		service.get_cloud_platforms()

@patch('src.cloud_platforms_service.requests', autospec=True)
def test_returns_only_platforms_with_correct_format(mock_requests: MagicMock):
	correct_cloud_platform: CloudPlatformDownstream = {
		'cloud_description': 'Europe, Norway - Azure: Norway West',
		'cloud_name': 'azure-norway-west',
        'geo_latitude': 58.97,
        'geo_longitude': 5.73,
        'geo_region': 'europe'
	}
	wrong_cloud_platform = {
		'cloud_description': 'Europe, Spain - UpCloud: Madrid'
	}
	mock_requests.get.return_value.status_code = 200
	mock_requests.get.return_value.json.return_value = {
		'clouds': [correct_cloud_platform,wrong_cloud_platform]
	}

	
	service = CloudPlatformsService()
	result = service.get_cloud_platforms()

	assert len(result) == 1
	assert result[0] == correct_cloud_platform
