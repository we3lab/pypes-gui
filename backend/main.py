import uvicorn
from datetime import datetime

from fastapi import FastAPI, Depends, Request, Security
from fastapi.exceptions import HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security.api_key import APIKeyHeader

from jose import jwt

from logger import logger
from routes import (network, node, connection, tag, manage_scenario, prefect_routes, user, file_management,
                    cleaning_dashboard, simulation_dashboard, parameter_routes, analytics_dashboard, mpc_dashboard)
from config import ENV, JWT_SECRET, API_KEY

app = FastAPI()

# TODO: change this later in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

http_bearer = HTTPBearer()

api_key_header_obj = APIKeyHeader(name="x-api-key", auto_error=False)


async def get_api_key(api_key: str = Security(api_key_header_obj)):
    if api_key not in API_KEY:
        raise HTTPException(
            status_code=403,
            detail={"state": "error", "message": "Invalid or missing auth key."},
        )
    return api_key


def verify_token(request: Request, token: HTTPAuthorizationCredentials = Depends(http_bearer)) -> None:
    try:
        decoded_token = jwt.decode(token.credentials, JWT_SECRET, algorithms=["HS256"])
        exp = decoded_token.get('exp')
        user_id = decoded_token.get('sub')
        if exp is None or user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        if datetime.utcnow() > datetime.fromtimestamp(exp):
            raise HTTPException(status_code=401, detail="Token has expired")
    except Exception as e:
        msg = f"Failed to verify token: {e.detail if hasattr(e, 'detail') else e}"
        logger.error(msg)
        raise HTTPException(status_code=401, detail=msg)
    else:
        request.state.user_id = user_id


app.include_router(user.router, prefix="/api", tags=["User"], dependencies=[Depends(get_api_key)])

# Network

app.include_router(network.router, prefix="/api", tags=["Network"], dependencies=[Depends(verify_token)])
app.include_router(node.router, prefix="/api", tags=["Node"], dependencies=[Depends(verify_token)])
app.include_router(connection.router, prefix="/api", tags=["Connection"], dependencies=[Depends(verify_token)])
app.include_router(tag.router, prefix="/api", tags=["Tag"], dependencies=[Depends(verify_token)])

# Uploads

app.include_router(file_management.router, prefix="/api", tags=["File Management"],
                   dependencies=[Depends(verify_token)])

# Scenario

app.include_router(manage_scenario.router, prefix="/api", tags=["Scenario"], dependencies=[Depends(verify_token)])

# Prefect

app.include_router(prefect_routes.router, prefix="/api", tags=["Prefect"], dependencies=[Depends(verify_token)])

# Dashboard

app.include_router(cleaning_dashboard.router, prefix="/api", tags=["Cleaning Dashboard"],
                   dependencies=[Depends(verify_token)])
app.include_router(simulation_dashboard.router, prefix="/api", tags=["Simulation Dashboard"],
                   dependencies=[Depends(verify_token)])
app.include_router(analytics_dashboard.router, prefix="/api", tags=["Analytics Dashboard"],
                   dependencies=[Depends(verify_token)])

# Parameter

app.include_router(parameter_routes.router, prefix="/api", tags=["Parameters"], dependencies=[Depends(verify_token)])

#MPC
app.include_router(mpc_dashboard.router, prefix="/api", tags=["MPC"], dependencies=[Depends(verify_token)])

@app.get("/health", tags=["Other"])
async def health():
    return {"msg": "ok"}


def main():
    if ENV == 'dev':
        uvicorn.run('main:app', host="0.0.0.0", port=3333, reload=True, reload_dirs=['/app'])
    uvicorn.run('main:app', host="0.0.0.0", port=3333)

# Last deployment: 07-03-2024
if __name__ == "__main__":
    main()