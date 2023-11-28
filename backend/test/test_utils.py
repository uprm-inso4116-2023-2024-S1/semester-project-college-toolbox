from backend.src.models.responses.existing_solution import ExistingSolutionResponse
from backend.src.models.responses.business_model import BusinessModelResponse
from src.models.tables import User


def business_model_model_to_business_model_response(model):
    return BusinessModelResponse(
        ExistingSolutionId=model.ExistingSolutionId,
        BusinessModelType=model.BusinessModelType,
        Price=model.Price,
        Description=model.Description,
    )


def existing_solution_model_to_existing_solution_response(model, business_models):
    return ExistingSolutionResponse(
        Name=model.Name,
        Description=model.Description,
        URL=model.URL,
        Icon=model.Icon,
        Type=model.Type.split(","),
        Rating=model.Rating,
        RatingCount=model.RatingCount,
        Pros=model.Pros.split(","),
        Cons=model.Cons.split(","),
        LastUpdated=model.LastUpdated.strftime("%Y-%m-%d"),
        HasMobile=model.HasMobile,
        HasWeb=model.HasWeb,
        BusinessModels=[
            business_model_model_to_business_model_response(business_model).model_dump()
            for business_model in business_models
        ],
    )


def mock_check_token_expiration():
    # Return a dummy user object for testing purposes
    return User(
        FirstName="Test",
        Initial="",
        FirstLastName="User",
        SecondLastName="",
        Email="test@example.com",
        Password="foo",
        ProfileImageUrl="",
    )
