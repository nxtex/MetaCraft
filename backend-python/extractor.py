import json
import subprocess
from pathlib import Path
from typing import Any

import mutagen
import mutagen.mp3
import mutagen.flac
import mutagen.mp4
from pypdf import PdfReader
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS


def extract(path: str, mime: str) -> dict[str, Any]:
    """Route extraction by MIME type."""
    if mime.startswith("image/"):
        return _extract_image(path)
    elif mime.startswith("audio/"):
        return _extract_audio(path)
    elif mime == "application/pdf":
        return _extract_pdf(path)
    elif mime.startswith("video/"):
        return _extract_video(path)
    return _exiftool_fallback(path)


def _extract_image(path: str) -> dict:
    result = {}
    try:
        img = Image.open(path)
        result["format"] = img.format
        result["mode"] = img.mode
        result["width"], result["height"] = img.size

        exif_data = img._getexif()
        if exif_data:
            exif = {}
            gps_info = {}
            for tag_id, value in exif_data.items():
                tag = TAGS.get(tag_id, tag_id)
                if tag == "GPSInfo":
                    for gps_tag_id, gps_value in value.items():
                        gps_tag = GPSTAGS.get(gps_tag_id, gps_tag_id)
                        gps_info[gps_tag] = str(gps_value)
                    exif["GPS"] = gps_info
                elif isinstance(value, bytes):
                    exif[str(tag)] = value.hex()
                else:
                    exif[str(tag)] = str(value)
            result["exif"] = exif
    except Exception as e:
        result["error"] = str(e)
    return result


def _extract_audio(path: str) -> dict:
    result = {}
    try:
        audio = mutagen.File(path, easy=True)
        if audio:
            result["tags"] = {k: list(v) for k, v in audio.tags.items() if audio.tags}
            result["length_seconds"] = round(audio.info.length, 2) if hasattr(audio, "info") else None
            result["bitrate"] = getattr(audio.info, "bitrate", None)
            result["sample_rate"] = getattr(audio.info, "sample_rate", None)
    except Exception as e:
        result["error"] = str(e)
    return result


def _extract_pdf(path: str) -> dict:
    result = {}
    try:
        reader = PdfReader(path)
        meta = reader.metadata or {}
        result["title"] = meta.get("/Title", "")
        result["author"] = meta.get("/Author", "")
        result["subject"] = meta.get("/Subject", "")
        result["creator"] = meta.get("/Creator", "")
        result["producer"] = meta.get("/Producer", "")
        result["creation_date"] = str(meta.get("/CreationDate", ""))
        result["modification_date"] = str(meta.get("/ModDate", ""))
        result["pages"] = len(reader.pages)
        result["encrypted"] = reader.is_encrypted
    except Exception as e:
        result["error"] = str(e)
    return result


def _extract_video(path: str) -> dict:
    return _exiftool_fallback(path)


def _exiftool_fallback(path: str) -> dict:
    try:
        result = subprocess.run(
            ["exiftool", "-json", "-coordFormat", "%+.6f", path],
            capture_output=True, text=True, timeout=30,
        )
        data = json.loads(result.stdout)
        return data[0] if data else {}
    except Exception as e:
        return {"error": str(e)}
