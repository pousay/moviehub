"""
!NOTICE :

YOU SHALL CHANGE THIS AND WRITE IT BASED ON YOUR DATA AND YOUR NEED
THIS IS ONLY FOR MY DATA IN THIS COMMIT LIVING IN THE backend/scripts/data.json
WHICH YOU ARE ALLOWED TO USE

GOOD LUCK :)
"""

import asyncio
import json
from pathlib import Path

from sqlalchemy import select, or_

from backend.app.database.connection import async_local
from backend.app.database.schema import Media
from backend.app.database.schema import Link
from backend.app.utils import LinkLanguage, MediaTypes


def parse_media(item: dict) -> Media:
    is_series = item["type"] == "series"

    return Media(
        imdb_id=item.get("imdb_id"),
        tmdb_id=item.get("tmdb_id"),
        type=MediaTypes.series if is_series else MediaTypes.movie,
        title=item["title"],
        year=item["year"],
        duration=item["duration"],
        country=item.get("country"),
        imdb_rate=item.get("imdb_rate"),
        tmdb_rate=item.get("vote_average"),
        imdb_votes=item.get("imdb_votes"),
        tmdb_votes=item.get("vote_count"),
        popularity=item.get("popularity"),
        overview=item.get("overview"),
        tagline=item.get("movie_:_tagline"),
        genres=",".join(item["genres"]) if item.get("genres") else None,
        poster=item.get("poster_path"),
        backdrop=item.get("backdrop_path"),
        total_seasons=item.get("series_:_total_seasons"),
        total_episodes=item.get("series_:_total_episodes"),
    )


def parse_links(item: dict, media_id: int) -> list[Link]:
    links = []
    for link_data in item.get("links", []):

        url = link_data.get("url", "").strip()
        if not url:
            continue

        raw_lang = link_data.get("language", "").strip().lower()
        try:
            language = LinkLanguage(raw_lang) if raw_lang else None
        except ValueError:
            language = None

        size = link_data.get("size", "").strip() or None

        links.append(
            Link(
                media_id=media_id,
                url=url,
                season=link_data.get("season"),
                quality=link_data.get("quality"),
                codec=link_data.get("codec"),
                language=language,
                size=size,
            )
        )

    return links


async def seed(json_path: str):
    path = Path(__file__).parent / json_path
    if not path.exists():
        raise FileNotFoundError(f"JSON file not found: {path}")

    with open(path, "r", encoding="utf-8") as f:
        items: list[dict] = json.load(f)

    async with async_local() as session:
        try:
            for item in items:
                imdb_id = item.get("imdb_id")

                if imdb_id:
                    result = await session.execute(
                        select(Media).where(
                            or_(
                                Media.imdb_id == imdb_id,
                                Media.tmdb_id == item.get("tmdb_id"),
                            )
                        )
                    )
                    existing = result.scalar_one_or_none()
                    if existing:
                        print(
                            f"[SKIP] '{item['title']}' already exists (imdb_id={imdb_id})"
                        )
                        continue

                media = parse_media(item)
                session.add(media)
                await session.flush()

                links = parse_links(item, media.id)
                session.add_all(links)

                print(
                    f"[INSERT] '{media.title}' ({media.type.value}) with {len(links)} links"
                )

            await session.commit()
            print("\nDone.")

        except Exception as e:
            await session.rollback()
            print(f"[ERROR] {e}")
            raise


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python seed.py <json_filename_next_to_this_script>")
        "e.g. data.json"
        sys.exit(1)

    asyncio.run(seed(sys.argv[1]))
