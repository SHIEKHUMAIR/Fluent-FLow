# Use official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Create data directory
RUN mkdir -p data

# Note: You must ensure lessons.json and roadmapQuestions.json are present
# either by copying them to this directory before building, or mounting them.
# The server checks for data/lessons.json relative to the script.

# Expose port 7860 (Hugging Face Spaces default)
EXPOSE 7860

# Define environment variable
ENV PORT=7860

# Run server.py when the container launches
CMD ["python", "server.py"]
