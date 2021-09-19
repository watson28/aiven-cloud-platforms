import logging
from fastapi import FastAPI
from fastapi_utils.tasks import repeat_every
from .cloud_platforms_business import CloudPlatformBusiness
from .config import settings


logging.basicConfig(level=logging.INFO)

app = FastAPI()
cloud_platform_business = CloudPlatformBusiness()


@app.on_event("startup")
@repeat_every(seconds=settings.cloud_platforms_hydrate_period_sec)
def on_startup():
	cloud_platform_business.hydrate_cloud_platforms()


@app.get("/cloud-platforms")
def get_cloud_platforms():
	return { 'result': cloud_platform_business.get_cloud_platforms() }
