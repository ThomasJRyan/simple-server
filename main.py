import json

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse

app = FastAPI()

@app.get("/")
async def root():
    return FileResponse("index.html")

@app.get("/config")
async def get_config():
    return FileResponse("static/config.json")

@app.post("/config")
async def set_config(request: Request):
    with open("static/config.json", "w") as f:
        json.dump(await request.json(), f)
        return True
    return False

@app.get("/base_config")
async def base_config():
    return FileResponse("static/base_config.json")

@app.get("/alpine.js")
async def base_config():
    return FileResponse("static/alpine.js")

@app.get("/pure.css")
async def base_config():
    return FileResponse("static/pure.css")