from typing import Union
import uuid

from fastapi import FastAPI, File, UploadFile, Body
from parse_resumes import parse_resume
from spacy_similarity import similarity_match
import os


app = FastAPI()

@app.post("/parse-resume")
async def upload_pdf(file: UploadFile = File()):
    # Validate file type
    if not file.filename.endswith(".pdf"):
        return {"error": "Only PDF files allowed!"}

    # Generate unique filename
    filename = f"{uuid.uuid4()}.pdf"

    # Create directory if it doesn't exist
    upload_dir = os.path.join(os.getcwd(), "Data", "Resumes")
    os.makedirs(upload_dir, exist_ok=True)

    # Save the file
    file_path = os.path.join(upload_dir, filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Parse the resume
    json = parse_resume(file_path)
    return json

@app.post('/rank-resume')
async def rank_resume(job_keywords = Body(), resume_keywords = Body()):
    result = similarity_match(job_keywords, resume_keywords)
    return { "percantage": result }

@app.get("/hello")
def hello():
    return {"hello": "world"}