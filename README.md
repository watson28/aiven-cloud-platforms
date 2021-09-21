# Aiven cloud platforms

This is an example project that uses (Aiven API)[https://api.aiven.io/doc/#tag/Cloud]
to display a list of avilable cloud platforms.

## features
- Display list of cloud platforms
- Filter by cloud provider
- Filter by distance from user's current location


## Getting started

The application consist of both a frontend and a backend api service which can be executed
using docker.

```bash
mkdir -p .data
docker compose -p aiven up
```

The first line create a `.data` folder used to cache the cloud platforms.

## Main technologies
- React
- Typescript
- Python
- FastAPI
- Poetry


## Tests run

After running the containers, you will be able to also run the test suite.

```sh
docker exec aiven_web_service_1 pytest
```

```sh
docker exec aiven_frontend_service_1 sh -c "npm test -- --watchAll=false"
```
