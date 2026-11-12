FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# ffmpeg decodes the browser's WebM/Opus recordings for librosa/Praat.
# build-essential is needed because praat-parselmouth ships as a source
# distribution (Praat is compiled during the pip install).
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

# Runs as a non-root user; secrets arrive at runtime, never baked into the image.
RUN useradd --create-home --uid 10001 neulens
USER neulens

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
