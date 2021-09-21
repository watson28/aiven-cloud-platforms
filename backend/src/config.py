from pydantic import BaseSettings


class AppSettings(BaseSettings):
    aiven_service_url: str
    aiven_auth_token: str
    cloud_platforms_hydrate_period_sec: int = 1800

    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'


settings = AppSettings()
