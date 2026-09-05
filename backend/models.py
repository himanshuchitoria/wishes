from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import date, time, datetime

class WishPayload(BaseModel):
    headline: Optional[str] = None
    body: str
    theme: Optional[str] = None
    aiPromptInputs: Optional[Dict[str, Any]] = None
    revealType: Optional[str] = None
    mediaUrl: Optional[str] = None
    musicTrack: Optional[str] = None

class WishCreate(BaseModel):
    id: str
    user_id: str
    recipient_name: str
    recipient_email: str
    recipient_phone: Optional[str] = None
    birth_date: str
    delivery_time: str
    delivery_timezone: str
    vibe: str
    is_anonymous: bool
    sender_alias: Optional[str] = None
    sender_email_prefix: str
    message_payload: WishPayload
    status: str
    group_token: str
    is_group_board: bool
    reveal_token: str
    created_at: str
    updated_at: str
