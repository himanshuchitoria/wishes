from fastapi import APIRouter, HTTPException
from core.database import supabase_admin
from datetime import datetime, timezone

router = APIRouter(prefix="/api/reveal", tags=["reveal"])

@router.get("/{token}")
def get_reveal(token: str):
    try:
        # Public endpoint, no auth required
        response = supabase_admin.table('wishes').select('*').eq('reveal_token', token).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Wish not found")
            
        wish = response.data[0]
        
        # Fetch group contributions if this wish has a group board
        contributions = []
        if wish.get('is_group_board') and wish.get('group_token'):
            contrib_res = supabase_admin.table('group_contributions').select('*').eq('wish_id', wish['id']).order('created_at', desc=False).execute()
            contributions = contrib_res.data or []
        
        return {"wish": wish, "contributions": contributions}
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

