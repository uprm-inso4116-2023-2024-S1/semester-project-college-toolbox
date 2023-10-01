# src/models/existing_app.py
from sqlalchemy import Column, Integer, Sequence, String

from src.database import Base


# Define SQLAlchemy model for ExistingApplication table
class ExistingApplication(Base):
    __tablename__ = "ExistingApplication"

    ExistingApplicationId = Column(
        Integer, Sequence("existing_application_id_seq"), primary_key=True, index=True
    )
    Name = Column(String, nullable=False)
    Description = Column(String)
    URL = Column(String)
    Icon = Column(String)
    Type = Column(String)
    Rating = Column(Integer)
    RatingCount = Column(Integer)

    def __init__(
        self,
        Name,
        Description,
        URL,
        Icon,
        Type,
        Rating,
        RatingCount,
    ):
        self.Name = Name
        self.Description = Description
        self.URL = URL
        self.Icon = Icon
        self.Type = Type
        self.Rating = Rating
        self.RatingCount = RatingCount
