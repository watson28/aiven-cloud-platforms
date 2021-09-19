from pydantic import BaseSettings

class AppSettings(BaseSettings):
	aiven_service_url: str
	aiven_auth_token: str

	class Config:
		env_file = '.env'
		env_file_encoding = 'utf-8'


settings = AppSettings()
