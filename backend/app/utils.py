from enum import Enum


class MediaTypes(Enum):
    series = "series"
    movie = "movie"


class LinkLanguage(Enum):
    softsub = "softsub"
    dubbed = "dubbed"
    hardcoded = "hardcoded"
