import json
import os
import logging
from json.decoder import JSONDecodeError
from typing import Sequence, Optional
from src.cloud_platforms_model import CloudPlatform
from pathlib import Path


class CloudPlatformNotFoundException(BaseException):
    pass


class CloudPlatformsRepository:
    _CACHE_FILE_PATH = os.path.join(os.getcwd(), '.cache/cloud_platforms')
    platforms: Optional[Sequence[CloudPlatform]]

    def __init__(self) -> None:
        self.platforms = None
        try:
            Path(os.path.basename(self._CACHE_FILE_PATH)).mkdir(exist_ok=True)
            with open(self._CACHE_FILE_PATH) as cache_file:
                self.platforms = [CloudPlatform(**p) for p in json.load(cache_file)]
        except JSONDecodeError:
            logging.error('Failed to load cloud platform cache')
        except FileNotFoundError:
            logging.info('Cache file not found')

    def save_cloud_platforms(self, platforms: Sequence[CloudPlatform]):
        self.platforms = platforms
        with open(self._CACHE_FILE_PATH, 'w') as file:
            json.dump([p.dict() for p in platforms], file)

    def get_cloud_platforms(self) -> Sequence[CloudPlatform]:
        if self.platforms is None:
            raise CloudPlatformNotFoundException()
        return self.platforms
