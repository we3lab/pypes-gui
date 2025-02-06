import sys

import loguru

logger = loguru.logger
logger.configure(extra={"ip_address": "", "request_id": ""})
logger.remove()
logger.add(
    sys.stdout,
    format="{time} - {level} - {extra[ip_address]} - {extra[request_id]} - {message} ",
    level="DEBUG",
)