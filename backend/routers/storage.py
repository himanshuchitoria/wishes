from fastapi import APIRouter, HTTPException, UploadFile, File
from core.database import supabase_admin
import uuid
import os
import mimetypes

router = APIRouter(prefix="/api/storage", tags=["storage"])

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Validate mime type
        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail=f"File type {file.content_type} not allowed. Allowed types: {', '.join(ALLOWED_TYPES)}")
            
        # Read file content
        file_bytes = await file.read()
        
        # Validate file size
        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")
            
        # Generate unique filename
        ext = mimetypes.guess_extension(file.content_type) or ""
        filename = f"{uuid.uuid4()}{ext}"
        
        # Upload to Supabase Storage
        res = supabase_admin.storage.from_("wish-media").upload(
            file=file_bytes,
            path=filename,
            file_options={"content-type": file.content_type}
        )
        
        # Get public URL
        public_url = supabase_admin.storage.from_("wish-media").get_public_url(filename)
        
        return {"success": True, "url": public_url}
        
    except HTTPException:
        raise
    except Exception as e:
        print("Upload error:", e)
        raise HTTPException(status_code=500, detail=str(e))
