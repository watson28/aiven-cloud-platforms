import os


def pytest_sessionstart(session):
    os.environ['AIVEN_SERVICE_URL'] = ''
