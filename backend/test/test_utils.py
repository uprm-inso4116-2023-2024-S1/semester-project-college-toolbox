from sqlalchemy.sql import text

def list_to_string(list):
    return ",".join(list)

def get_business_model_insert_query(business_models):
    query = "INSERT INTO BusinessModel (ExistingSolutionId, BusinessModelType, Price, Description) VALUES "
    for i, business_model in enumerate(business_models):
        query += f"({business_model.ExistingSolutionId}, '"
        query += f"{business_model.BusinessModelType}', "
        query += f"{business_model.Price}, '"
        query += f"{business_model.Description}')"

        # Add a comma if the current tuple is not the last tuple
        if i != len(business_models) - 1:
            query += ", "

    return text(query)


def get_existing_solution_insert_query(expected_responses):
    # Define a text string that represents the SQL query
    query = "INSERT INTO ExistingSolution (Name, Description, URL, Icon, Type, Rating, RatingCount, Pros, Cons, LastUpdated, HasMobile, HasWeb) VALUES "
    for i, response in enumerate(expected_responses):
        query += f"('{response.Name}', '"
        query += f"{response.Description}', '"
        query += f"{response.URL}', '"
        query += f"{response.Icon}', '"
        query += f"{response.Type}', "
        query += f"{response.Rating}, "
        query += f"{response.RatingCount}, '"
        query += f"{list_to_string(response.Pros)}', '"
        query += f"{list_to_string(response.Cons)}', '"
        query += f"{response.LastUpdated}', "
        query += f"{response.HasMobile}, "
        query += f"{response.HasWeb})"

        # Add a comma if the current tuple is not the last tuple
        if i != len(expected_responses) - 1:
            query += ", "
    return text(query)
