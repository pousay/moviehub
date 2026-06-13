import json
from typing import List
from pathlib import Path
from backend.app.models import MediaCreateModel
from backend.app.models.link import RequestCreateLinkModel

data_path = Path(__file__).parent / "data.json"

data: List[dict] = json.load(open(data_path, "r", encoding="utf-8"))

for media in data[1:13:5]:
    mapped = MediaCreateModel(
        type=media["type"],
        title=media["title"],
        year=media["year"],
        rate=media.get("imdb_rate") or media.get("tmdb_rate"),
        detail=media["overview"],
        duration=media["duration"],
        country=media["country"],
    )

    links = [
        RequestCreateLinkModel(
            media_id=0,  # placeholder, real id comes after DB insert
            url=link["url"],
            season=link.get("season"),
            episode=link.get("episode"),
        )
        for link in media.get("links", [])
    ]

    print(mapped)
    print(f"  links ({len(links)}):")
    for link in links:
        print(f"    {link}")
    print()
