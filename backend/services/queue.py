from arq import create_pool
from arq.connections import RedisSettings
from config import settings
import urllib.parse

# Parse the rediss:// URL for arq
# Example: rediss://default:password@host:6379
url = urllib.parse.urlparse(settings.REDIS_URL)

redis_settings = RedisSettings(
    host=url.hostname,
    port=url.port,
    password=url.password,
    # Upstash uses SSL/TLS for rediss://
    ssl=url.scheme == 'rediss'
)

async def get_redis():
    return await create_pool(redis_settings)
