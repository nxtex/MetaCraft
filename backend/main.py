from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
import subprocess, json, os, tempfile
import firebase_admin
from firebase_admin import credentials, auth, storage

# ── Firebase Admin init ──
if not firebase_admin._apps:
    cred = credentials.Certificate(os.environ["GOOGLE_APPLICATION_CREDENTIALS"])
    firebase_admin.initialize_app(cred, {"storageBucket": os.environ["FIREBASE_STORAGE_BUCKET"]})

app = FastAPI(title="MetaCraft Metadata Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("ALLOWED_ORIGIN", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth ──
async def get_uid(authorization: str = "") -> str:
    try:
        token = authorization.removeprefix("Bearer ")
        decoded = auth.verify_id_token(token)
        return decoded["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Unauthorized")

from fastapi import Header

async def require_auth(authorization: str = Header(default="")) -> str:
    return await get_uid(authorization)

# ── Helpers ──
bucket = storage.bucket

def download_from_storage(storage_path: str) -> tuple[str, str]:
    """→ (local_tmp_path, suffix)"""
    suffix = "." + storage_path.rsplit(".", 1)[-1]
    tmp = tempfile.NamedTemporaryFile(suffix=suffix, delete=False)
    blob = bucket().blob(storage_path)
    blob.download_to_filename(tmp.name)
    return tmp.name, suffix

def upload_to_storage(local_path: str, storage_path: str) -> None:
    blob = bucket().blob(storage_path)
    blob.upload_from_filename(local_path)

def exiftool_extract(path: str) -> dict[str, Any]:
    result = subprocess.run(
        ["exiftool", "-j", "-a", "-G1", path],
        capture_output=True, text=True, timeout=30,
    )
    if result.returncode != 0:
        raise HTTPException(status_code=500, detail=f"ExifTool error: {result.stderr}")
    data = json.loads(result.stdout)
    return data[0] if data else {}

def exiftool_edit(path: str, edits: dict[str, str]) -> None:
    args = ["exiftool", "-overwrite_original"]
    for k, v in edits.items():
        args.append(f"-{k}={v}")
    args.append(path)
    result = subprocess.run(args, capture_output=True, text=True, timeout=30)
    if result.returncode not in (0, 1):
        raise HTTPException(status_code=500, detail=f"ExifTool edit error: {result.stderr}")

# ── Schemas ──
class ExtractRequest(BaseModel):
    storage_path: str
    mime_type: str

class EditRequest(BaseModel):
    storage_path: str
    mime_type: str
    edits: dict[str, str]

# ── Routes ──
@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/extract")
async def extract(
    req: ExtractRequest,
    uid: str = Depends(require_auth),
) -> dict[str, Any]:
    local, _ = download_from_storage(req.storage_path)
    try:
        return exiftool_extract(local)
    finally:
        os.unlink(local)

@app.post("/edit")
async def edit(
    req: EditRequest,
    uid: str = Depends(require_auth),
) -> dict[str, Any]:
    local, _ = download_from_storage(req.storage_path)
    try:
        exiftool_edit(local, req.edits)
        upload_to_storage(local, req.storage_path)
        return exiftool_extract(local)
    finally:
        os.unlink(local)
