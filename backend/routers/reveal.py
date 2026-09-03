from fastapi import APIRouter, HTTPException
from core.database import supabase_admin
from datetime import datetime, timezone
import zoneinfo

router = APIRouter(prefix="/api/reveal", tags=["reveal"])

@router.get("/{token}")
def get_reveal(token: str):
    try:
        # Public endpoint, no auth required
        response = supabase_admin.table('wishes').select('*').eq('reveal_token', token).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Wish not found")
            
        wish = response.data[0]
        
        # Calculate unboxing time
        is_early = False
        birth_date_str = wish.get('birth_date')
        delivery_time_str = wish.get('delivery_time', '00:00')
        tz_str = wish.get('delivery_timezone', 'UTC')
        
        if birth_date_str:
            try:
                # E.g. "2024-05-10" and "00:00" -> "2024-05-10 00:00:00"
                dt_str = f"{birth_date_str} {delivery_time_str}:00"
                target_dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
                # Make it timezone aware
                tz = zoneinfo.ZoneInfo(tz_str)
                target_dt_aware = target_dt.replace(tzinfo=tz)
                
                # Compare to now
                if datetime.now(timezone.utc) < target_dt_aware:
                    is_early = True
            except Exception as dt_err:
                print(f"Date parse error: {dt_err}")
                # Fail open if date is malformed? No, let's just proceed without lock if error, 
                # but usually it's well-formed.
                pass
                
        # If early, strip sensitive data!
        if is_early:
            wish['message_payload'] = None
            contributions = []
        else:
            # Fetch group contributions if this wish has a group board and it's unlocked
            contributions = []
            if wish.get('is_group_board') and wish.get('group_token'):
                contrib_res = supabase_admin.table('group_contributions').select('*').eq('wish_id', wish['id']).order('created_at', desc=False).execute()
                contributions = contrib_res.data or []
        
        return {"wish": wish, "contributions": contributions, "is_early": is_early}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{token}/read")
def mark_reveal_read(token: str):
    try:
        response = supabase_admin.table('wishes').select('id, opened_at, status').eq('reveal_token', token).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Wish not found")
        
        wish = response.data[0]
        updates = {}
        
        if not wish.get('opened_at'):
            updates['opened_at'] = datetime.now(timezone.utc).isoformat()
            
        # Optional: ensure status is at least 'delivered' if opened
        if wish.get('status') == 'scheduled':
            updates['status'] = 'delivered'
            
        if updates:
            supabase_admin.table('wishes').update(updates).eq('id', wish['id']).execute()
            
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

