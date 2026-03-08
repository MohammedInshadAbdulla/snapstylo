import asyncio
from arq import create_pool
from services.queue import redis_settings
from worker import WorkerSettings
from arq.worker import run_worker

async def test_worker():
    print("Testing Redis Connection...")
    try:
        redis = await create_pool(redis_settings)
        print("Redis Connection Successful!")
        await redis.close()
    except Exception as e:
        print(f"Redis Connection Failed: {e}")
        return

    print("Attempting to run worker...")
    try:
        await run_worker(WorkerSettings)
    except Exception as e:
        print(f"Worker crashed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_worker())
