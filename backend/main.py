import uvicorn
from jose import jwt
from logger import logger
from fastapi import FastAPI
from fastapi.security import HTTPBearer
from routes import (network, node, connection, tag, manage_scenario, prefect_routes, user, file_management,
                    cleaning_dashboard, simulation_dashboard, parameter_routes, analytics_dashboard, mpc_dashboard)
from config import ENV, JWT_SECRET, API_KEY

app = FastAPI()
http_bearer = HTTPBearer()

# Network
app.include_router(network.router, prefix="/api", tags=["Network"], dependencies=[])
app.include_router(node.router, prefix="/api", tags=["Node"], dependencies=[])
app.include_router(connection.router, prefix="/api", tags=["Connection"], dependencies=[])
app.include_router(tag.router, prefix="/api", tags=["Tag"], dependencies=[])

# Uploads
app.include_router(file_management.router, prefix="/api", tags=["File Management"],
                   dependencies=[])

# Scenario
app.include_router(manage_scenario.router, prefix="/api", tags=["Scenario"], dependencies=[])

# Parameter
app.include_router(parameter_routes.router, prefix="/api", tags=["Parameters"], dependencies=[])


@app.get("/health", tags=["Other"])
async def health():
    return {"msg": "ok"}


def main():
    if ENV == 'dev':
        uvicorn.run('main:app', host="0.0.0.0", port=3333, reload=True, reload_dirs=['/app'])
    uvicorn.run('main:app', host="0.0.0.0", port=3333)


if __name__ == "__main__":
    main()