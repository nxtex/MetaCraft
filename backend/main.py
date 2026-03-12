from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Any
import subprocess, json, os, tempfile, base64
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Header

# ── Firebase Admin init ──
if not firebase_admin._apps:
    cred = credentials.Certificate(os.environ["GOOGLE_APPLICATION_CREDENTIALS"])
    firebase_admin.initialize_app(cred)

app = FastAPI(title="MetaCraft Metadata Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth ──
async def require_auth(authorization: str = Header(default="")) -> str:
    try:
        token = authorization.removeprefix("Bearer ")
        decoded = auth.verify_id_token(token)
        return decoded["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Unauthorized")

# ── ExifTool helpers ──
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
        clean_key = k.split(".")[-1]
        args.append(f"-{clean_key}={v}")
    args.append(path)
    result = subprocess.run(args, capture_output=True, text=True, timeout=30)
    if result.returncode not in (0, 1):
        raise HTTPException(status_code=500, detail=f"ExifTool edit error: {result.stderr}")

# ── Routes ──
@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/extract")
async def extract(
    file: UploadFile = File(...),
    uid: str = Depends(require_auth),
) -> dict[str, Any]:
    suffix = "." + (file.filename or "file").rsplit(".", 1)[-1]
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        return exiftool_extract(tmp_path)
    finally:
        os.unlink(tmp_path)

@app.post("/edit")
async def edit(
    file: UploadFile = File(...),
    edits: str = Form(...),
    uid: str = Depends(require_auth),
) -> dict[str, Any]:
    edits_dict: dict[str, str] = json.loads(edits)
    suffix = "." + (file.filename or "file").rsplit(".", 1)[-1]
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        exiftool_edit(tmp_path, edits_dict)
        metadata = exiftool_extract(tmp_path)
        with open(tmp_path, "rb") as f:
            file_b64 = base64.b64encode(f.read()).decode()
        return {"metadata": metadata, "file_b64": file_b64}
    finally:
        os.unlink(tmp_path)
