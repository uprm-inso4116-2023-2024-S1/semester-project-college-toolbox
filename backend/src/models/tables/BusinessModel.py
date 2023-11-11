# src/models/ExistingSolution.py
from sqlalchemy import Column, Integer, String, Double, ForeignKey
from sqlalchemy.orm import relationship
from src.database import Base


# Define SQLAlchemy model for BusinessModel table
class BusinessModel(Base):
    __tablename__ = "BusinessModel"

    BusinessModelId = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    ExistingSolutionId = Column(Integer, ForeignKey("ExistingSolution.ExistingSolutionId"), nullable=False)
    BusinessModelType = Column(String, nullable=False)
    Price = Column(Double)
    Description = Column(String)

    # Populate ExistingSolution's BusinessModels attribute with these objects
    existing_solution = relationship("ExistingSolution", back_populates="BusinessModels")


    def __init__(
        self,
        ExistingSolutionId,
        BusinessModelType,
        Price,
        Description,
    ):
        self.ExistingSolutionId = ExistingSolutionId
        self.BusinessModelType = BusinessModelType
        self.Price = Price
        self.Description = Description
