from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.get("/")
async def root():
  return FileResponse('index.html')
