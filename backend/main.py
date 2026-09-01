from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env.local"))
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env.example"))

app = FastAPI(title="Chitoria.dev API")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers.wishes import router as wishes_router
from routers.reveal import router as reveal_router
from routers.collaborate import router as collaborate_router
from routers.generate import router as generate_router
from routers.settings import router as settings_router
from routers.storage import router as storage_router

@app.get("/")
def read_root():
    return {"message": "Welcome to chitoria.dev API"}

app.include_router(wishes_router)
app.include_router(reveal_router)
app.include_router(collaborate_router)
app.include_router(generate_router)
app.include_router(settings_router)
app.include_router(storage_router)
