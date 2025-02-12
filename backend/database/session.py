import asyncio

from contextlib import contextmanager, asynccontextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

from config import DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER
from database.db_models import Base
from logger import logger

# TODO: consider the async session later

SQLALCHEMY_DATABASE_URL = (
    f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# ASYNC_SQLALCHEMY_DATABASE_URL = (
#     f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
# )


def configure_session(db_url: str, create_schema: bool = False):
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_size=32,
        max_overflow=64,
        echo=False)
    if create_schema:
        Base.metadata.create_all(bind=engine)
    session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return session_local


SessionLocal = configure_session(SQLALCHEMY_DATABASE_URL, False)


@contextmanager
def session_manager():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


# def configure_async_session(db_url: str, create_schema: bool = False):
#     engine = create_async_engine(db_url, pool_size=40, max_overflow=0, echo=False)
#     if create_schema:
#         asyncio.run(Base.metadata.create_all(bind=engine))
#     async_session = sessionmaker(
#         engine, expire_on_commit=False, class_=AsyncSession
#     )
#     return async_session
#
#
# @asynccontextmanager
# async def async_session_manager(db_url: str = ASYNC_SQLALCHEMY_DATABASE_URL, create_schema: bool = False):
#     async with configure_async_session(db_url, create_schema)() as session:
#         try:
#             yield session
#         finally:
#             await session.close()


if __name__ == "__main__":
    with session_manager() as db:
        logger.info('With create_schema True you can substitute alembic migration -> faster prototyping')