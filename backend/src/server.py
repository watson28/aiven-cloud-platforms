import logging
from src.cloud_platforms_model import CloudPlatform
from typing import List
from fastapi import FastAPI
from fastapi_utils.tasks import repeat_every
from fastapi.middleware.cors import CORSMiddleware
from .cloud_platforms_business import CloudPlatformBusiness
from .config import settings


logging.basicConfig(level=logging.INFO)

app = FastAPI()
cloud_platform_business = CloudPlatformBusiness()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
@repeat_every(seconds=settings.cloud_platforms_hydrate_period_sec)
def on_startup():
    cloud_platform_business.hydrate_cloud_platforms()


@app.get("/cloud-platforms", response_model=List[CloudPlatform])
def get_cloud_platforms():
    return cloud_platform_business.get_cloud_platforms()
