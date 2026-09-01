import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from core.security import get_current_user
from google import genai
from google.genai import types

router = APIRouter(prefix="/api/generate", tags=["generate"])

class GenerateRequest(BaseModel):
    vibe: str
    recipientName: str
    facts: list[str]
    insideJoke: str = ""

@router.post("/")
def generate_message(request: GenerateRequest, user=Depends(get_current_user)):
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")
            
        client = genai.Client(api_key=api_key)
        
        prompt = f"""
        You are a world-class, highly creative, and witty birthday message writer. 
        Your task is to write a highly engaging, unique, and personalized birthday message for {request.recipientName}.
        
        The vibe MUST BE absolutely: {request.vibe.upper()}. Fully commit to this vibe (if roast, be hilariously ruthless; if sentimental, be deeply moving; if casual, be cool and breezy).
        
        Mandatory facts to creatively weave into the story (do not just list them, make them part of the narrative):
        {', '.join(request.facts)}
        
        Inside joke to reference subtly or hilariously: {request.insideJoke if request.insideJoke else 'None provided, just be creative!'}
        
        Return the response in strictly valid JSON format exactly like this:
        {{
            "headline": "A short, punchy, extremely catchy title/headline for the message (under 10 words, MUST match the vibe)",
            "body": "The actual detailed birthday message (around 2-3 paragraphs, highly engaging, no boring cliché 'happy birthday' intros, hook the reader immediately!)"
        }}
        """
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.9
            )
        )
        
        # The response text should be valid JSON as requested by response_mime_type
        import json
        result = json.loads(response.text)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

