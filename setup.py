from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in ht/__init__.py
from ht import __version__ as version

setup(
	name="ht",
	version=version,
	description="HT",
	author="hammad",
	author_email="hammad@srp.ai",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
