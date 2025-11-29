FROM python:3.11-alpine

WORKDIR /app

RUN pip install --no-cache-dir flask flask-cors supabase pydantic[email] python-dotenv requests

COPY . /app

EXPOSE 8001

CMD ["python", "app.py"]

