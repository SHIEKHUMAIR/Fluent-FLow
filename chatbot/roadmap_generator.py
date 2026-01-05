import os
import json
import argparse
import requests

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)
from xml.sax.saxutils import escape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.lib.utils import ImageReader
from google import genai
from dotenv import load_dotenv

load_dotenv()

# GEMINI CLIENT
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

# =========================
# PATHS
# =========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

LOCAL_DATA = os.path.join(BASE_DIR, 'data')
INTEGRATED_DATA = os.path.join(BASE_DIR, '..', 'data')

def get_data_file(filename):
    local_path = os.path.join(LOCAL_DATA, filename)
    integrated_path = os.path.join(INTEGRATED_DATA, filename)
    base_path = os.path.join(BASE_DIR, filename)

    if os.path.exists(local_path):
        return local_path
    if os.path.exists(base_path):
        return base_path
    return integrated_path

LESSONS_FILE = get_data_file('lessons.json')

# =========================
# FLUENT FLOW THEME - Professional Color Palette
# =========================

FF_DARK_BLUE = colors.HexColor("#143D6B")
FF_ACCENT = colors.HexColor("#143D6B") # Map accent to Dark Blue
FF_ACCENT_LIGHT = colors.HexColor("#64748B") # Map light accent to Gray
FF_TEXT = colors.HexColor("#64748B") # Map text to Gray
FF_MUTED = colors.HexColor("#64748B")
FF_BACKGROUND = colors.HexColor("#F8FAFC")
FF_SUCCESS = colors.HexColor("#143D6B") # Map success to Dark Blue
FF_WARNING = colors.HexColor("#64748B") # Map warning to Gray
FF_BORDER = colors.HexColor("#E2E8F0")
FF_CARD_BG = colors.HexColor("#FFFFFF")

# Hex strings for HTML use
FF_DARK_BLUE_HEX = "#143D6B"
FF_ACCENT_HEX = "#143D6B" 
FF_ACCENT_LIGHT_HEX = "#64748B"
FF_TEXT_HEX = "#64748B"
FF_MUTED_HEX = "#64748B"
FF_BACKGROUND_HEX = "#F8FAFC"
FF_SUCCESS_HEX = "#143D6B"
FF_WARNING_HEX = "#64748B"
FF_BORDER_HEX = "#E2E8F0"
FF_CARD_BG_HEX = "#FFFFFF"

# Place your logo PNG here
LOGO_PATH = os.path.join(BASE_DIR, "logo.png")
QUESTIONS_FILE = get_data_file('roadmapQuestions.json')

# =========================
# DATA HELPERS
# =========================

def load_json_data(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

def get_user_progress_from_api(backend_url, user_id):
    try:
        url = f"{backend_url}/api/progress/dashboard?userId={user_id}"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                # Return the whole data object (stats + progress)
                return data["data"]
    except Exception as e:
        print(f"Error fetching user progress: {e}")
    return {}

# =========================
# BUSINESS LOGIC
# =========================

def get_time_label(time_value):
    """Map time value to display label"""
    time_mapping = {
        "casual": "5-10 mins",
        "regular": "20-30 mins",
        "intense": "1+ hour"
    }
    return time_mapping.get(time_value.lower(), time_value)

def analyze_profile(answers, questions_data=None):
    """Analyze profile and return formatted data with labels"""
    goal_value = answers.get("goal", "General Learning")
    level_value = answers.get("selfLevel", "Beginner")
    time_value = answers.get("time", "casual")
    
    # Get goal label if questions_data is available
    goal_label = goal_value.capitalize()
    if questions_data:
        goal_question = next((q for q in questions_data.get("profile", []) if q.get("id") == "goal"), None)
        if goal_question:
            # Try to find by value first
            goal_option = next((opt for opt in goal_question.get("options", []) if opt.get("value") == goal_value), None)
            # If not found, try to find by label (in case label was sent)
            if not goal_option:
                goal_option = next((opt for opt in goal_question.get("options", []) if opt.get("label") == goal_value), None)
            if goal_option:
                goal_label = goal_option.get("label", goal_value.capitalize())
    
    # Get level label
    level_label = level_value.capitalize()
    if questions_data:
        level_question = next((q for q in questions_data.get("profile", []) if q.get("id") == "selfLevel"), None)
        if level_question:
            # Try to find by value first
            level_option = next((opt for opt in level_question.get("options", []) if opt.get("value") == level_value), None)
            # If not found, try to find by label (in case label was sent)
            if not level_option:
                level_option = next((opt for opt in level_question.get("options", []) if opt.get("label") == level_value), None)
            if level_option:
                level_label = level_option.get("label", level_value.capitalize())
    
    return {
        "goal": goal_label,
        "level": level_label,
        "time_commitment": get_time_label(time_value)
    }

def score_assessment(user_answers, questions_data):
    """
    Compare user answers against correct options in roadmapQuestions.json.
    Returns a dict with scores per level and a summary string.
    """
    scores = {}
    total_correct = 0
    total_questions = 0
    
    # questions_data['assessment'] has keys: beginner, intermediate, advanced
    assessment_sections = questions_data.get("assessment", {})

    for level, questions in assessment_sections.items():
        level_correct = 0
        level_total = len(questions)
        
        for q in questions:
            qid = q["id"]
            user_choice = user_answers.get(qid) # The value selected by user
            
            # Find the correct option for this question
            correct_option = next((opt for opt in q["options"] if opt.get("correct")), None)
            
            if correct_option and user_choice:
                # We compare values. Note: The frontend might send back the 'label' or 'value'. 
                # Based on roadmapQuestions.json, options have 'label'. 
                # Some have 'value' (profile), but assessment options only have 'label' and 'correct'.
                # We assume user_answers contains the *label* of the selected option for simplicity,
                # or we match loosely.
                if user_choice == correct_option["label"]:
                    level_correct += 1
        
        scores[level] = f"{level_correct}/{level_total}"
        total_correct += level_correct
        total_questions += level_total

    summary = f"Total Score: {total_correct}/{total_questions}. Breakdown: " + ", ".join([f"{k}: {v}" for k,v in scores.items()])
    return summary

def generate_recommendations(user_progress, all_lessons, profile, answers):
    completed_ids = {
        p["lesson_id"] for p in user_progress if p.get("completed")
    }

    lessons = sorted(all_lessons.get("lessons", []), key=lambda x: x["id"])
    recommendations = []

    next_lesson = next(
        (l for l in lessons if l["id"] not in completed_ids),
        None
    )

    if next_lesson:
        recommendations.append({
            "type": "Immediate Next Step",
            "title": next_lesson["title"],
            "desc": next_lesson["desc"],
            "duration": next_lesson["duration"]
        })
    else:
        recommendations.append({
            "type": "Completion",
            "title": "All lessons completed",
            "desc": "Excellent work! Review lessons to maintain your streak.",
            "duration": "N/A"
        })

    return recommendations

def get_ai_roadmap(profile, user_progress, lessons, user_name, assessment_score="Not available"):
    """Fetch personalized roadmap from Gemini"""
    if not client:
        return None

    try:
        # Filter available lessons (not completed)
        completed_ids = {p["lesson_id"] for p in user_progress if p.get("completed")}
        all_lessons_list = lessons.get("lessons", [])
        
        # Get incomplete lessons (candidates for recommendation)
        available_curriculum = [
            f"{l['title']} ({l['category']}): {l['desc']}" 
            for l in all_lessons_list 
            if l['id'] not in completed_ids
        ]

        # Get completed lessons names for context
        completed_lessons_names = [
             l['title'] for l in all_lessons_list if l['id'] in completed_ids
        ]
        completed_text = ", ".join(completed_lessons_names[:15]) # Limit to last 15 to save tokens
        if len(completed_lessons_names) > 15:
            completed_text += "..."
        
        # Limit context if too large (though 47 is fine, let's take first 20 available)
        available_curriculum_text = "\n".join(available_curriculum[:20])

        prompt = f"""
        Prompt:
        Act as an expert language learning coach for Chinese.
        Create a personalized roadmap for a user named {user_name}.
        
        Profile:
        - Goal: {profile['goal']}
        - Level: {profile['level']}
        - Time Commitment: {profile['time_commitment']}
        - Assessment Result: {assessment_score}
        
        What the user has ALREADY completed (Do NOT recommend these):
        {completed_text}

        Available Curriculum (Choose immediate next steps ONLY from this list):
        {available_curriculum_text}
        
        Return a JSON object with this structure:
        {{
            "summary": " motivational summary...",
            "focus_areas": ["area 1", "area 2", "area 3"],
            "next_steps": [
                {{ "lesson_number": "e.g. 12", "title": "Lesson Title", "desc": "Brief overview of what they will learn", "reason": "Why this specific lesson fits their goal/level" }},
                {{ "lesson_number": "e.g. 13", "title": "Lesson Title", "desc": "Brief overview...", "reason": "Why this..." }}
            ],
            "study_tip": "Specific tip..."
        }}
        """
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={
                'response_mime_type': 'application/json'
            }
        )
        
        return json.loads(response.text)
    except Exception as e:
        print(f"AI Error: {e}")
        return None

# =========================
# HEADER / FOOTER
# =========================

def draw_header_footer(canvas, doc):
    width, height = letter
    canvas.saveState()

    # Professional gradient header background
    canvas.setFillColor(FF_DARK_BLUE)
    canvas.rect(0, height - 90, width, 90, fill=1, stroke=0)
    
    # Accent gradient overlay
    canvas.setFillColor(FF_ACCENT)
    canvas.setFillAlpha(0.3)
    canvas.rect(0, height - 90, width, 30, fill=1, stroke=0)
    canvas.setFillAlpha(1.0)

    # Logo with better positioning
    if os.path.exists(LOGO_PATH):
        try:
            img = ImageReader(LOGO_PATH)
            iw, ih = img.getSize()
            aspect = ih / float(iw)
            
            # Max dimensions
            max_w = 140
            max_h = 50
            
            # Fit within box
            logo_w = max_w
            logo_h = max_w * aspect
            
            if logo_h > max_h:
                logo_h = max_h
                logo_w = max_h / aspect
                
            canvas.drawImage(
                LOGO_PATH,
                50,
                height - 70,
                width=logo_w,
                height=logo_h,
                mask="auto",
                preserveAspectRatio=True
            )
        except Exception as e:
            print(f"Error loading logo: {e}")

    # Header title with better typography
    canvas.setFillColor(colors.white)
    canvas.setFont(font_bold, 18)
    canvas.drawRightString(
        width - 50,
        height - 55,
        "Personalized Learning Roadmap"
    )
    
    # Subtitle
    canvas.setFont(font_regular, 10)
    canvas.setFillColor(colors.HexColor("#B8D4FF"))
    canvas.drawRightString(
        width - 50,
        height - 75,
        "Your Path to Chinese Mastery"
    )

    # Professional accent line
    canvas.setStrokeColor(FF_ACCENT_LIGHT)
    canvas.setLineWidth(4)
    canvas.line(0, height - 92, width, height - 92)
    
    # Subtle bottom border
    canvas.setStrokeColor(FF_BORDER)
    canvas.setLineWidth(1)
    canvas.line(0, height - 90, width, height - 90)

    # Enhanced footer with better styling
    canvas.setFillColor(FF_MUTED)
    canvas.setFont(font_regular, 9)
    
    # Footer background
    canvas.setFillColor(FF_BACKGROUND)
    canvas.rect(0, 0, width, 50, fill=1, stroke=0)
    
    # Footer content
    canvas.setFillColor(FF_MUTED)
    canvas.setFont(font_regular, 9)
    canvas.drawString(50, 35, "Fluent Flow • Chinese Learning Hub")
    canvas.drawRightString(width - 50, 35, f"Page {doc.page}")
    
    # Footer accent line
    canvas.setStrokeColor(FF_ACCENT)
    canvas.setLineWidth(2)
    canvas.line(50, 50, width - 50, 50)

    canvas.restoreState()

# =========================
# FONT REGISTRATION
# =========================

font_regular = "Helvetica"
font_bold = "Helvetica-Bold"

def register_fonts():
    global font_regular, font_bold
    # Try to register Poppins
    poppins_reg = os.path.join(BASE_DIR, "Poppins-Regular.ttf")
    poppins_bold = os.path.join(BASE_DIR, "Poppins-Bold.ttf")
    
    if os.path.exists(poppins_reg) and os.path.exists(poppins_bold):
        try:
            pdfmetrics.registerFont(TTFont('Poppins-Regular', poppins_reg))
            pdfmetrics.registerFont(TTFont('Poppins-Bold', poppins_bold))
            font_regular = 'Poppins-Regular'
            font_bold = 'Poppins-Bold'
            print("Successfully registered Poppins fonts.")
        except Exception as e:
            print(f"Error registering fonts: {e}")

register_fonts()

# =========================
# PDF CREATION
# =========================

def create_pdf(output_file, profile, progress_stats, recommendations, ai_data=None, user_name="Learner"):
    doc = SimpleDocTemplate(
        output_file,
        pagesize=letter,
        topMargin=100,
        bottomMargin=60
    )

    styles = getSampleStyleSheet()

    # Enhanced Title Style
    styles.add(ParagraphStyle(
        name="FF_Title",
        fontSize=28,
        fontName=font_bold,
        textColor=FF_DARK_BLUE,
        spaceAfter=20,
        leading=34,
        alignment=0  # Left align
    ))
    
    # Subtitle Style
    styles.add(ParagraphStyle(
        name="FF_Subtitle",
        fontSize=14,
        fontName=font_regular,
        textColor=FF_MUTED,
        spaceAfter=30,
        leading=20,
        fontStyle='italic'
    ))

    # Enhanced Heading Style
    styles.add(ParagraphStyle(
        name="FF_Heading",
        fontSize=20,
        fontName=font_bold,
        textColor=FF_DARK_BLUE,
        spaceBefore=32,
        spaceAfter=16,
        leading=24,
        borderWidth=0,
        borderPadding=0
    ))
    
    # Section Heading Style
    styles.add(ParagraphStyle(
        name="FF_SectionHeading",
        fontSize=16,
        fontName=font_bold,
        textColor=FF_DARK_BLUE,
        spaceBefore=24,
        spaceAfter=10,
        leading=20
    ))

    # Enhanced Normal Text
    styles.add(ParagraphStyle(
        name="FF_Normal",
        fontSize=11,
        leading=16,
        textColor=FF_TEXT,
        fontName=font_regular,
        spaceAfter=8
    ))
    
    # Large Normal Text
    styles.add(ParagraphStyle(
        name="FF_NormalLarge",
        fontSize=12,
        leading=20,
        textColor=FF_TEXT,
        fontName=font_regular,
        spaceAfter=12
    ))

    # Enhanced Muted Text
    styles.add(ParagraphStyle(
        name="FF_Muted",
        fontSize=10,
        textColor=FF_MUTED,
        fontName=font_regular,
        leading=14
    ))
    
    # Highlight Style
    styles.add(ParagraphStyle(
        name="FF_Highlight",
        fontSize=11,
        fontName=font_bold,
        textColor=FF_ACCENT,
        leading=16
    ))
    
    # Success Style
    styles.add(ParagraphStyle(
        name="FF_Success",
        fontSize=11,
        fontName=font_bold,
        textColor=FF_SUCCESS,
        leading=16
    ))

    story = []

    # Title Section
    story.append(Paragraph(
        f"{user_name}'s Personalized Chinese Learning Roadmap",
        styles["FF_Title"]
    ))
    story.append(Spacer(1, 30))

    # Profile Section
    profile_data = [
        ["Goal", profile["goal"]],
        ["Current Level", profile["level"]],
        ["Daily Commitment", profile["time_commitment"]],
        ["Lessons Completed", str(progress_stats["completed_count"])]
    ]

    table = Table(profile_data, colWidths=[180, 270])
    table.setStyle(TableStyle([
        # Header row styling
        ("BACKGROUND", (0, 0), (0, -1), FF_DARK_BLUE),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.white),
        ("FONTNAME", (0, 0), (0, -1), font_bold),
        ("FONTSIZE", (0, 0), (0, -1), 11),
        
        # Data column styling
        ("BACKGROUND", (1, 0), (1, -1), FF_CARD_BG),
        ("TEXTCOLOR", (1, 0), (1, -1), FF_TEXT),
        ("FONTNAME", (1, 0), (1, -1), font_regular),
        ("FONTSIZE", (1, 0), (1, -1), 11),
        
        # Padding
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 14),
        ("LEFTPADDING", (0, 0), (-1, -1), 16),
        ("RIGHTPADDING", (0, 0), (-1, -1), 16),
        
        # Borders
        ("GRID", (0, 0), (-1, -1), 1, FF_BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        
        # First row special styling
        ("BACKGROUND", (0, 0), (0, 0), FF_ACCENT),
        
        # Last row special styling
        ("LINEBELOW", (0, -1), (-1, -1), 2, FF_ACCENT),
    ]))

    story.append(table)
    story.append(Spacer(1, 35))

    if ai_data:
        # Fluent Flow's Recommended Path Section
        story.append(Paragraph("Fluent Flow's Recommended Path", styles["FF_Heading"]))
        
        # Summary in a highlighted box
        summary_text = ai_data.get("summary", "")
        if summary_text:
            safe_summary = escape(summary_text)
            story.append(Paragraph(
                f'<para backColor="{FF_BACKGROUND_HEX}" borderWidth="1" borderColor="{FF_BORDER_HEX}" '
                f'borderPadding="12" leading="18">{safe_summary}</para>',
                styles["FF_NormalLarge"]
            ))
            story.append(Spacer(1, 20))
        
        # Next Steps Section
        next_steps = ai_data.get("next_steps", [])
        if next_steps:
            story.append(Paragraph("Your Next Steps", styles["FF_SectionHeading"]))
            story.append(Spacer(1, 12))
            
            for idx, step in enumerate(next_steps, 1):
                lesson_num = step.get("lesson_number", "")
                if lesson_num:
                    title_text = f"Step {idx}: Lesson {lesson_num} - {step.get('title', 'Unknown Title')}"
                else:
                    title_text = f"Step {idx}: {step.get('title', 'Next Step')}"
                
                # Step card
                step_desc = step.get('desc', '')
                step_reason = step.get('reason', '')
                
                # Sanitize content
                safe_title = escape(title_text)
                safe_desc = escape(step_desc)
                safe_reason = escape(step_reason)
                
                # Construct single paragraph content with internal styling
                content = (
                    f'<para backColor="{FF_CARD_BG_HEX}" borderWidth="1" borderColor="{FF_ACCENT_HEX}" '
                    f'borderPadding="14" leading="18">'
                    f'<font name="{font_bold}" color="{FF_ACCENT_HEX}" size="11">{safe_title}</font>'
                    f'<br/><br/>'
                    f'{safe_desc}'
                    f'<br/><br/>'
                    f'<font color="{FF_ACCENT_HEX}" size="10"><i>💡 Why this fits:</i></font> '
                    f'<font color="{FF_MUTED_HEX}" size="10"><i>{safe_reason}</i></font>'
                    f'</para>'
                )
                
                story.append(Paragraph(content, styles["FF_Normal"]))
                story.append(Spacer(1, 14))

        story.append(Spacer(1, 16))
        
        # Focus Areas Section
        focus_areas = ai_data.get("focus_areas", [])
        if focus_areas:
            story.append(Paragraph("🎯 Focus Areas", styles["FF_SectionHeading"]))
            
            # Focus areas in a styled list
            focus_table_data = []
            for area in focus_areas:
                focus_table_data.append([f"✓ {area}"])
            
            focus_table = Table(focus_table_data, colWidths=[450])
            focus_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), FF_BACKGROUND),
                ("TEXTCOLOR", (0, 0), (-1, -1), FF_TEXT),
                ("FONTNAME", (0, 0), (-1, -1), font_regular),
                ("FONTSIZE", (0, 0), (-1, -1), 11),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]))
            story.append(focus_table)
            story.append(Spacer(1, 16))
        
        # Study Tip Section
        study_tip = ai_data.get('study_tip', '')
        if study_tip:
            safe_tip = escape(study_tip)
            story.append(Paragraph(
                f'<para backColor="{FF_ACCENT_HEX}" textColor="white" borderWidth="0" '
                f'borderPadding="14" leading="18"><b>💡 Pro Tip:</b> {safe_tip}</para>',
                styles["FF_Normal"]
            ))
            story.append(Spacer(1, 20))

    else:
        # Fallback to static recommendations if AI failed
        story.append(Paragraph("📚 Recommended Next Steps", styles["FF_Heading"]))
        story.append(Spacer(1, 12))
        
        for idx, rec in enumerate(recommendations, 1):
            # Recommendation card
            # Sanitize content
            safe_type = escape(rec["type"])
            safe_title = escape(rec["title"])
            safe_desc = escape(rec["desc"])
            safe_duration = escape(rec["duration"])

            content = (
                f'<para backColor="{FF_CARD_BG_HEX}" borderWidth="1" borderColor="{FF_BORDER_HEX}" '
                f'borderPadding="14" leading="18">'
                f'<font color="{FF_ACCENT_HEX}" name="{font_bold}" size="11"><b>Step {idx}: {safe_type}</b></font>'
                f'<br/>'
                f'<font size="12"><b>{safe_title}</b></font>'
                f'<br/><br/>'
                f'{safe_desc}'
                f'<br/><br/>'
                f'<font color="{FF_MUTED_HEX}" size="10">⏱ Duration: {safe_duration}</font>'
                f'</para>'
            )
            story.append(Paragraph(content, styles["FF_Normal"]))
            story.append(Spacer(1, 14))

    # Professional Closing Section
    story.append(Spacer(1, 30))
    
    # Closing message in a styled box
    closing_text = (
        f'<para backColor="{FF_DARK_BLUE_HEX}" textColor="white" borderWidth="0" '
        f'borderPadding="20" leading="20" alignment="center">'
        f'<b><font size="14">Keep Building Your Learning Streak! 🚀</font></b><br/>'
        f'<font size="11">Stay consistent, track your progress, and achieve your Chinese learning goals with Fluent Flow.</font>'
        f'</para>'
    )
    story.append(Paragraph(closing_text, styles["FF_Normal"]))
    
    story.append(Spacer(1, 20))
    
    # Footer note
    footer_note = (
        f'<para alignment="center"><font color="{FF_MUTED_HEX}" size="9">'
        f'This roadmap is personalized for you. Revisit it anytime to track your progress.<br/>'
        f'Generated by Fluent Flow • {user_name}\'s Learning Journey'
        f'</font></para>'
    )
    story.append(Paragraph(footer_note, styles["FF_Muted"]))

    doc.build(
        story,
        onFirstPage=draw_header_footer,
        onLaterPages=draw_header_footer
    )

    print(f"PDF generated successfully: {output_file}")

# =========================
# MAIN
# =========================

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--user_id", required=True)
    parser.add_argument("--answers", required=True)
    parser.add_argument("--output", default="roadmap.pdf")
    parser.add_argument("--backend_url", required=True)
    parser.add_argument("--user_name", default="Learner")
    parser.add_argument("--gemini_api_key", required=False, help="DEPRECATED: Use .env file GOOGLE_API_KEY")
    args = parser.parse_args()


    # Priority: CLI arg > Environment Variable (Optional override)
    # But we rely on global CLIENT for now as per user request pattern.
    if args.gemini_api_key:
       print("Note: Using CLI API Key override")
       global client
       client = genai.Client(api_key=args.gemini_api_key)

    lessons = load_json_data(LESSONS_FILE)
    answers_data = load_json_data(args.answers)
    questions_data = load_json_data(QUESTIONS_FILE)
    
    if not lessons or not answers_data:
        print("Failed to load required data.")
        return

    # Extract answers dict if wrapped
    answers = answers_data.get("answers", answers_data) if answers_data else {}

    # Get full response data to access stats
    api_data = get_user_progress_from_api(args.backend_url, args.user_id)
    
    # Extract progress list and stats
    progress = api_data.get('progress', [])
    stats = api_data.get('stats', {})
    
    # Use stats for completed count if available, otherwise calculate
    if 'lessonsCompleted' in stats:
        completed_count = stats['lessonsCompleted']
    else:
        completed_count = sum(1 for p in progress if p.get("completed"))

    profile = analyze_profile(answers, questions_data)
    
    # Score the assessment
    assessment_score = "No assessment taken"
    if questions_data:
        assessment_score = score_assessment(answers, questions_data)
        print(f"Assessment Score: {assessment_score}")

    recommendations = generate_recommendations(
        progress, lessons, profile, answers
    )

    ai_data = None
    if client:
        print("Contacting Gemini...")
        ai_data = get_ai_roadmap(
            profile, 
            progress, # Pass full progress list 
            lessons, 
            args.user_name,
            assessment_score=assessment_score
        )
    else:
        print("Skipping AI generation: No Gemini Client (check .env GOOGLE_API_KEY)")

    create_pdf(
        args.output,
        profile,
        {"completed_count": completed_count},
        recommendations,
        ai_data=ai_data,
        user_name=args.user_name
    )

if __name__ == "__main__":
    main()

