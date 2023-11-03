from src.utils.db import get_db
from abc import ABC, abstractmethod
from fastapi import APIRouter
from sqlalchemy.orm import Session
class Repository(ABC):
    def __init__(self, name) -> None:
        self.name = name
        self.db: Session = next(get_db())
        self.router = APIRouter()
        self.addRoutes()
        
    @abstractmethod
    def addRoutes(self) -> None:
        pass
    
    @abstractmethod
    async def create(self, *args, **kwargs) ->None: pass
    @abstractmethod
    async def getAll(self, *args, **kwargs)-> list: pass
    @abstractmethod
    async def getOne(self, *args, **kwargs): pass
    @abstractmethod
    async def update(self, *args, **kwargs) -> None: pass
    @abstractmethod
    async def delete(self, *args, **kwargs) -> None: pass