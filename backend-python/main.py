import os
import json
import tempfile
from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel
from typing import Any
import minio_client as mc
import extractor
import editor

app = FastAPI(title="MetaCraft Python Service", version="1.0.0")

INTERNAL_KEY = os.environ["INTERNAL_API_KEY"]


def verify_internal_key(x_internal_key: str = Header(...)):
    if x_internal_key != INTERNAL_KEY:
        raise HTTPException(status_code=403, detail="Forbidden")


class ExtractRequest(BaseModel):
    object_key: str
    mime_type: str


class EditRequest(BaseModel):
    object_key: str
    mime_type: str
    edits: dict[str, Any]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/extract", dependencies=[Depends(verify_internal_key)])
def extract_metadata(req: ExtractRequest):
    """Download file from MinIO, extract metadata, return as JSON."""
    with tempfile.NamedTemporaryFile(suffix=_ext(req.object_key), delete=False) as tmp:
        mc.download(req.object_key, tmp.name)
        metadata = extractor.extract(tmp.name, req.mime_type)
    return metadata


@app.post("/edit", dependencies=[Depends(verify_internal_key)])
def edit_metadata(req: EditRequest):
    """Download file, apply metadata edits, re-upload, return updated metadata."""
    with tempfile.NamedTemporaryFile(suffix=_ext(req.object_key), delete=False) as tmp:
        mc.download(req.object_key, tmp.name)
        editor.edit(tmp.name, req.mime_type, req.edits)
        mc.upload(req.object_key, tmp.name, req.mime_type)
        updated = extractor.extract(tmp.name, req.mime_type)
    return updated


def _ext(key: str) -> str:
    import os
    return os.path.splitext(key)[1] or ".bin"
