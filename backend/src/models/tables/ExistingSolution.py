# src/models/ExistingSolution.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from src.database import Base


# Define SQLAlchemy model for ExistingSolution table
class ExistingSolution(Base):
    __tablename__ = "ExistingSolution"

    ExistingSolutionId = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    Name = Column(String, nullable=False)
    Description = Column(String)
    URL = Column(String)
    Icon = Column(String)
    Type = Column(String)
    Rating = Column(Integer)
    RatingCount = Column(Integer)
    Pros = Column(String)
    Cons = Column(String)
    LastUpdated = Column(DateTime)
    HasMobile = Column(Boolean)
    HasWeb = Column(Boolean)

    # Populate BusinessModel's ExistingSolution attribute with this object
    BusinessModels = relationship("BusinessModel", back_populates="existing_solution", cascade="all, delete-orphan", lazy="joined")


    def __init__(
        self,
        Name,
        Description,
        URL,
        Icon,
        Type,
        Rating,
        RatingCount,
        Pros, 
        Cons,
        LastUpdated,
        HasMobile,
        HasWeb,
    ):
        self.Name = Name
        self.Description = Description
        self.URL = URL
        self.Icon = Icon
        self.Type = Type
        self.Rating = Rating
        self.RatingCount = RatingCount
        self.Pros = Pros
        self.Cons = Cons
        self.LastUpdated = LastUpdated
        self.HasMobile = HasMobile
        self.HasWeb = HasWeb
