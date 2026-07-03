from enum import Enum, StrEnum


class MediaTypes(Enum):
    series = "series"
    movie = "movie"


class MediaFilter(StrEnum):
    all = "all"
    movie = "movie"
    series = "series"


class LinkLanguage(Enum):
    softsub = "softsub"
    dubbed = "dubbed"
    hardcoded = "hardcoded"
