from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os
import logging
import uvicorn

# Import logic from roadmap_generator
from roadmap_generator import (
    load_json_data, 
    get_user_progress_from_api, 
    analyze_profile, 
    score_assessment, 
    generate_recommendations, 
    get_ai_roadmap, 
    create_pdf,
    LESSONS_FILE,
    QUESTIONS_FILE
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS - Allow frontend to connect
# Enable CORS - Allow frontend to connect
# ==========================================
# CONFIGURATION
# ==========================================

# FRONTEND URLs (For CORS)
FRONTEND_URL_LOCAL = "http://localhost:3000"
FRONTEND_URL_DEPLOYED = "https://fluent-flow.vercel.app"

# BACKEND URLs (For User Progress API)
BACKEND_URL_LOCAL = "http://localhost:4000"
BACKEND_URL_DEPLOYED = "https://fluent-flow-backend.onrender.com"

# 1. CORS Configuration
# We allow both local and deployed frontend origins by default to make it work in all environments
# You can override this with the ALLOWED_ORIGINS environment variable
env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    ALLOWED_ORIGINS = env_origins.split(",")
else:
    ALLOWED_ORIGINS = [
        FRONTEND_URL_LOCAL,
        FRONTEND_URL_DEPLOYED
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Backend URL Configuration
# Use environment variable first, then fallback to LOCAL (as per preference)
DEFAULT_BACKEND_URL = os.getenv("BACKEND_URL", BACKEND_URL_LOCAL)

class RoadmapRequest(BaseModel):
    userId: str
    answers: Dict[str, Any]
    userName: Optional[str] = "Learner"
    backendUrl: Optional[str] = DEFAULT_BACKEND_URL

@app.get("/")
async def read_root():
    return {"message": "Fluent Flow Chatbot API is running. Check /health for status."}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "roadmap-generator-api"}

@app.post("/api/generate-roadmap")
async def generate_roadmap(request: RoadmapRequest, background_tasks: BackgroundTasks):
    try:
        user_id = request.userId
        answers = request.answers
        user_name = request.userName
        backend_url = request.backendUrl

        # Validate required fields
        if not user_id:
            raise HTTPException(status_code=400, detail="userId is required")
        if not answers:
            raise HTTPException(status_code=400, detail="answers are required")

        logger.info(f"Generating roadmap for user {user_id} ({user_name})")

        # 1. Load Data
        lessons = load_json_data(LESSONS_FILE)
        questions_data = load_json_data(QUESTIONS_FILE)
        
        if not lessons:
             logger.error("Failed to load lessons.json")
             raise HTTPException(status_code=500, detail="Internal server error: Could not load lessons")

        # 2. Get User Progress
        api_data = get_user_progress_from_api(backend_url, user_id)
        progress = api_data.get('progress', [])
        stats = api_data.get('stats', {})
        
        if 'lessonsCompleted' in stats:
            completed_count = stats['lessonsCompleted']
        else:
            completed_count = sum(1 for p in progress if p.get("completed"))

        # 3. Analyze & Score
        logger.info(f"Answers received: {answers}")
        profile = analyze_profile(answers, questions_data)
        logger.info(f"Profile generated: {profile}")
        
        assessment_score = "No assessment taken"
        if questions_data:
            assessment_score = score_assessment(answers, questions_data)
        
        # 4. Generate Recommendations
        recommendations = generate_recommendations(progress, lessons, profile, answers)

        # 5. AI Generation
        ai_data = get_ai_roadmap(
            profile, 
            progress, 
            lessons, 
            user_name, 
            assessment_score=assessment_score
        )

        # 6. Create PDF
        # We'll save it to a temporary file or a fixed path with timestamp to avoid caching
        import time
        timestamp = int(time.time())
        output_filename = f"roadmap_{user_id}_{timestamp}.pdf"
        output_dir = os.path.join(os.path.dirname(__file__), "generated_roadmaps")
        output_path = os.path.join(output_dir, output_filename)
        
        # Ensure directory exists
        try:
            os.makedirs(output_dir, exist_ok=True)
        except Exception as e:
            logger.error(f"Failed to create output directory: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to create output directory: {e}")
        
        try:
            create_pdf(
                output_path,
                profile,
                {"completed_count": completed_count},
                recommendations,
                ai_data=ai_data,
                user_name=user_name
            )
        except Exception as e:
            logger.error(f"Failed to create PDF: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to create PDF: {e}")

        logger.info(f"PDF generated at {output_path}")

        # 7. Return File
        # Schedule file deletion after response is sent
        background_tasks.add_task(remove_file, output_path)
        return FileResponse(output_path, filename="my_roadmap.pdf", media_type='application/pdf')

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        error_msg = str(e)
        logger.exception(f"Error generating roadmap: {error_msg}")
        # Return detailed error message
        raise HTTPException(status_code=500, detail=f"Error generating roadmap: {error_msg}")

def remove_file(path: str):
    try:
        if os.path.exists(path):
            os.remove(path)
            logger.info(f"Deleted temporary file: {path}")
    except Exception as e:
        logger.error(f"Error deleting file {path}: {e}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    uvicorn.run(app, host='0.0.0.0', port=port)
