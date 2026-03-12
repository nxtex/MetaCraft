from typing import Any
import mutagen
from pypdf import PdfReader, PdfWriter
from PIL import Image
import piexif
import shutil
import os


def edit(path: str, mime: str, edits: dict[str, Any]):
    """Apply metadata edits in-place."""
    if mime.startswith("audio/"):
        _edit_audio(path, edits)
    elif mime == "application/pdf":
        _edit_pdf(path, edits)
    elif mime.startswith("image/"):
        _edit_image(path, edits)
    # video: skip for now (complex, would use ffmpeg)


def _edit_audio(path: str, edits: dict):
    audio = mutagen.File(path, easy=True)
    if not audio:
        return
    for key, value in edits.items():
        audio[key] = [value] if isinstance(value, str) else value
    audio.save()


def _edit_pdf(path: str, edits: dict):
    reader = PdfReader(path)
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    writer.add_metadata({
        f"/{k.title()}": str(v) for k, v in edits.items()
    })
    tmp = path + ".tmp"
    with open(tmp, "wb") as f:
        writer.write(f)
    shutil.move(tmp, path)


def _edit_image(path: str, edits: dict):
    # Only supports JPEG EXIF editing
    try:
        exif_dict = piexif.load(path)
        ifd = exif_dict.get("0th", {})
        tag_map = {"artist": piexif.ImageIFD.Artist, "copyright": piexif.ImageIFD.Copyright,
                   "imagedescription": piexif.ImageIFD.ImageDescription}
        for k, v in edits.items():
            tag_id = tag_map.get(k.lower())
            if tag_id:
                ifd[tag_id] = v.encode() if isinstance(v, str) else v
        exif_dict["0th"] = ifd
        exif_bytes = piexif.dump(exif_dict)
        piexif.insert(exif_bytes, path)
    except Exception:
        pass  # Non-fatal, image without EXIF
