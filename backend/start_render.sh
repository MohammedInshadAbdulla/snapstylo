#!/bin/bash
# Move to backend directory
cd backend

# Start the ARQ worker in the background
echo "Starting ARQ Worker..."
python -m arq worker.WorkerSettings &

# Start the FastAPI web application
echo "Starting FastAPI Web Server..."
python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
