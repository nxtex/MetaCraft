from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import Any
import subprocess
import json
import os
import tempfile
import base64

import firebase_admin
from firebase_admin import credentials, auth


# ─────────────────────────
# Firebase Admin Init
# ─────────────────────────
if not firebase_admin._apps:
    cred = credentials.Certificate(os.environ["GOOGLE_APPLICATION_CREDENTIALS"])
    firebase_admin.initialize_app(cred)


# ─────────────────────────
# FastAPI App
# ─────────────────────────
app = FastAPI(title="MetaCraft Metadata Service")


# ─────────────────────────
# CORS Configuration
# ─────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://meta-craft.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Handle preflight explicitly (helps some deployments)
@app.options("/{path:path}")
async def preflight_handler():
    return {"status": "ok"}


# ─────────────────────────
# Authentication
# ─────────────────────────
async def require_auth(authorization: str = Header(default="")) -> str:
    try:
        if not authorization.startswith("Bearer "):
            raise Exception("Invalid token format")

        token = authorization.replace("Bearer ", "")
        decoded = auth.verify_id_token(token)

        return decoded["uid"]

    except Exception:
        raise HTTPException(status_code=401, detail="Unauthorized")


# ─────────────────────────
# ExifTool Helpers
# ─────────────────────────
def exiftool_extract(path: str) -> dict[str, Any]:
    result = subprocess.run(
        ["exiftool", "-j", "-a", "-G1", path],
        capture_output=True,
        text=True,
        timeout=30,
    )

    if result.returncode != 0:
        raise HTTPException(
            status_code=500,
            detail=f"ExifTool error: {result.stderr}"
        )

    data = json.loads(result.stdout)
    return data[0] if data else {}


def exiftool_edit(path: str, edits: dict[str, str]) -> None:
    args = ["exiftool", "-overwrite_original"]

    for key, value in edits.items():
        clean_key = key.split(".")[-1]
        args.append(f"-{clean_key}={value}")

    args.append(path)

    result = subprocess.run(
        args,
        capture_output=True,
        text=True,
        timeout=30,
    )

    if result.returncode not in (0, 1):
        raise HTTPException(
            status_code=500,
            detail=f"ExifTool edit error: {result.stderr}"
        )


# ─────────────────────────
# Routes
# ─────────────────────────

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/extract")
async def extract(
    file: UploadFile = File(...),
    uid: str = Depends(require_auth),
) -> dict[str, Any]:

    suffix = "." + (file.filename or "file").split(".")[-1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        metadata = exiftool_extract(tmp_path)
        return metadata

    finally:
        os.unlink(tmp_path)


@app.post("/edit")
async def edit(
    file: UploadFile = File(...),
    edits: str = Form(...),
    uid: str = Depends(require_auth),
) -> dict[str, Any]:

    edits_dict: dict[str, str] = json.loads(edits)

    suffix = "." + (file.filename or "file").split(".")[-1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        exiftool_edit(tmp_path, edits_dict)

        metadata = exiftool_extract(tmp_path)

        with open(tmp_path, "rb") as f:
            file_b64 = base64.b64encode(f.read()).decode()

        return {
            "metadata": metadata,
            "file_b64": file_b64
        }

    finally:
        os.unlink(tmp_path)
