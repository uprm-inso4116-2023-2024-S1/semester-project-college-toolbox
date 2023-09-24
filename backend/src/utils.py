from src.models.tables.user import User


def get_full_name(user: User) -> str:
    name = ""
    if user.FirstName:
        name += f"{user.FirstName}"
    if user.Initial:
        name += f" {user.Initial}."
    if user.FirstLastName:
        name += f" {user.FirstLastName}"
    if user.SecondLastName:
        name += f" {user.SecondLastName}"
    return name
