from sqlalchemy.sql import text


def get_existing_application_insert_query(expected_responses):
    # Define a text string that represents the SQL query
    query = "INSERT INTO ExistingApplication (Name, Description, URL, Icon, Type, Rating, RatingCount) VALUES "
    for i, response in enumerate(expected_responses):
        query += f"('{response.Name}', '{response.Description}', '{response.URL}', '{response.Icon}', '{response.Type}', {response.Rating}, {response.RatingCount})"
        # Add a comma if the current tuple is not the last tuple
        if i != len(expected_responses) - 1:
            query += ", "
    return text(query)
