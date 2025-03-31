import random
import uuid
from sqlalchemy.orm import Session
from app.db_setup import get_db_context
from app.api.v1.core.models import CulturalItem, Tag

# Mock data for cultural items
TITLES = [
    "Ancient Vase", "Medieval Sword", "Renaissance Painting", "Historic Document",
    "Bronze Statue", "Ancient Coin", "Traditional Mask", "Historic Flag",
    "Ancient Scroll", "Ceremonial Drum"
]
TITLES.extend([
    "Ancient Pottery", "Historic Sword", "Baroque Sculpture", "Vintage Map",
    "Golden Crown", "Ancient Jewelry", "Traditional Garment", "Historic Painting",
    "Ancient Manuscript", "Ceremonial Spear", "Ancient Amulet", "Historic Shield",
    "Traditional Instrument", "Ancient Relic", "Historic Medal", "Traditional Headdress"
])

DESCRIPTIONS = [
    "A rare artifact from ancient times.", "A weapon used in medieval battles.",
    "A masterpiece from the Renaissance era.", "A document that shaped history.",
    "A statue crafted from bronze.", "A coin from an ancient civilization.",
    "A mask used in traditional ceremonies.", "A flag with historical significance.",
    "A scroll containing ancient knowledge.", "A drum used in rituals."
]
DESCRIPTIONS.extend([
    "An exquisite piece of ancient pottery.", "A sword with a rich history.",
    "A sculpture from the Baroque period.", "A map from a bygone era.",
    "A crown made of gold from ancient times.", "Jewelry from an ancient civilization.",
    "A garment worn in traditional ceremonies.", "A painting with historical importance.",
    "A manuscript containing ancient writings.", "A spear used in ceremonial rituals.",
    "An amulet believed to have mystical powers.", "A shield used in historic battles.",
    "An instrument used in traditional music.", "A relic from ancient times.",
    "A medal awarded for historic achievements.", "A headdress worn in traditional events."
])

REGIONS = ["Europe", "Asia", "Africa", "Americas", "Oceania"]
REGIONS.extend(["Middle East", "Arctic", "Caribbean", "Central Asia", "Polynesia"])

TIME_PERIODS = ["Ancient", "Medieval", "Renaissance", "Modern"]
TIME_PERIODS.extend(["Prehistoric", "Industrial Revolution", "Victorian Era", "Postmodern"])

TAGS = ["artifact", "historic", "rare", "cultural", "ancient"]
TAGS.extend(["unique", "antique", "ceremonial", "religious", "symbolic", "decorative", "archaeological"])

def generate_mock_data(db: Session, num_items: int = 100):
    for _ in range(num_items):
        title = random.choice(TITLES)
        description = random.choice(DESCRIPTIONS)
        region = random.choice(REGIONS)
        time_period = random.choice(TIME_PERIODS)
        image_url = f"https://example.com/images/{uuid.uuid4()}.jpg"
        video_url = f"https://example.com/videos/{uuid.uuid4()}.mp4"
        audio_url = f"https://example.com/audio/{uuid.uuid4()}.mp3"
        historical_significance = f"This item is significant for {region} during the {time_period} period."

        # Create cultural item
        cultural_item = CulturalItem(
            title=title,
            description=description,
            region=region,
            time_period=time_period,
            image_url=image_url,
            video_url=video_url,
            audio_url=audio_url,
            historical_significance=historical_significance,
        )

        # Add random tags
        for _ in range(random.randint(1, 3)):
            tag_name = random.choice(TAGS)
            tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.add(tag)
                db.flush()
            cultural_item.tags.append(tag)

        db.add(cultural_item)

    db.commit()
    print(f"Inserted {num_items} cultural items into the database.")

if __name__ == "__main__":
    with get_db_context() as db:
        generate_mock_data(db)
