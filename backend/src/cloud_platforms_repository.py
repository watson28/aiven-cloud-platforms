from typing import Sequence
from src.cloud_platforms_model import CloudPlatform


class CloudPlatformsRepository:
	platforms: Sequence[CloudPlatform]

	def __init__(self) -> None:
		self.platforms = []
	
	def save_cloud_platforms(self, platforms: Sequence[CloudPlatform]):
		self.platforms = platforms

	def get_cloud_platforms(self) -> Sequence[CloudPlatform]:
		return self.platforms
