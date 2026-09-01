from fastapi import APIRouter, HTTPException
from core.database import supabase_admin
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/collaborate", tags=["collaborate"])

class Contribution(BaseModel):
    contributor_name: str
    message: str
    image_url: Optional[str] = None
    avatar_seed: Optional[str] = None

@router.get("/{token}")
def get_collaborate(token: str):
    try:
        # Get wish
        wish_res = supabase_admin.table('wishes').select('*').eq('group_token', token).execute()
        if not wish_res.data:
            raise HTTPException(status_code=404, detail="Group board not found")
            
        wish = wish_res.data[0]
        
        # Get contributions
        contrib_res = supabase_admin.table('group_contributions').select('*').eq('wish_id', wish['id']).execute()
        
        return {"wish": wish, "contributions": contrib_res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{token}/contribute")
def post_contribution(token: str, contribution: Contribution):
    try:
        # Verify wish exists
        wish_res = supabase_admin.table('wishes').select('id').eq('group_token', token).execute()
        if not wish_res.data:
            raise HTTPException(status_code=404, detail="Group board not found")
            
        wish_id = wish_res.data[0]['id']
        
        # Insert contribution
        data = contribution.model_dump()
        data['wish_id'] = wish_id
        
        res = supabase_admin.table('group_contributions').insert([data]).execute()
        return {"success": True, "contribution": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
