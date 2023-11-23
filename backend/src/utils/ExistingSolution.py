from src.models.requests.resources import (
    applyAllFilterRequest,
)

from src.models.responses.existing_solution import (
    ExistingSolutionResponse,
)


def filter_apps_by_prefix(
    search_prefix: str, apps: list[ExistingSolutionResponse]
) -> list[ExistingSolutionResponse]:
    """Filter out applications based on their name prefix."""
    return [app for app in apps if app.Name.lower().startswith(search_prefix.lower())]


def filter_apps_by_criteria(
    filters: applyAllFilterRequest, apps: list[ExistingSolutionResponse]
) -> list[ExistingSolutionResponse]:
    """Filter out applications based on the given filters."""
    type_set = set(filter.lower() for filter in filters.type)
    sort_set = set(filter.lower() for filter in filters.sort)

    filtered_apps = apps

    if type_set:
        filtered_apps = [
            app
            for app in apps
            if any(app_type.lower() in type_set for app_type in app.Type)
        ]

    filtered_apps.sort(key=lambda app: app.Name, reverse=("high to low" in sort_set))

    return filtered_apps
