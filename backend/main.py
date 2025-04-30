import os   
import multiprocessing
from typing import Union

from pydantic import BaseModel
from datetime import datetime
import uvicorn

class FileInfo(BaseModel):
    fileName: str

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有 HTTP 方法
    allow_headers=["*"],  # 允许所有请求头
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/dir")
def read_dir(file_info:FileInfo):
    dir_path = file_info.fileName

    file_list = []
    try:
        for entry in os.scandir(dir_path):
            file_info = {
                'name': entry.name,
                'path': entry.path,
                'size': entry.stat().st_size,
                'created': datetime.fromtimestamp(entry.stat().st_ctime),
                'modified': datetime.fromtimestamp(entry.stat().st_mtime),
                'type': 'file'
            }
            if entry.is_dir():
                file_info['type'] = 'directory'

            file_list.append(file_info)
    except OSError as e:
        print(f"Error accessing directory: {e}")

    return {'fileInfo':file_list}

if __name__ == "__main__":
    multiprocessing.freeze_support()
    
    # 获取配置文件路径
    base_dir = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    log_config_path = os.path.join(base_dir, "uvicorn_log.ini")
    
    uvicorn.run("__main__:app",
                host="127.0.0.1",
                port=8080,
                log_config=log_config_path)