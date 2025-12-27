import json
import os
import sqlite3
from datetime import datetime, timedelta

import pika
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

APP_PORT = int(os.getenv("APP_PORT", "8010"))
DB_PATH = os.getenv("LOG_DB_PATH", "/app/logs.db")

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "guest")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "guest")
RABBITMQ_EXCHANGE = os.getenv("RABBITMQ_EXCHANGE", "logs-exchange")
RABBITMQ_QUEUE = os.getenv("RABBITMQ_QUEUE", "logs-queue")
RABBITMQ_ROUTING_KEY = os.getenv("RABBITMQ_ROUTING_KEY", "logs.route")

app = FastAPI(title="Logging Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db_conn():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                level TEXT,
                url TEXT,
                correlation_id TEXT,
                service TEXT,
                message TEXT,
                raw TEXT
            )
            """
        )
        conn.commit()


def parse_timestamp(raw):
    if not raw:
        return datetime.utcnow()
    try:
        return datetime.fromisoformat(str(raw).replace("Z", "+00:00"))
    except Exception:
        return datetime.utcnow()


def get_rabbit_channel():
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
    params = pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
        credentials=credentials,
        heartbeat=0,
    )
    connection = pika.BlockingConnection(params)
    channel = connection.channel()
    channel.exchange_declare(
        exchange=RABBITMQ_EXCHANGE, exchange_type="direct", durable=True
    )
    channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)
    channel.queue_bind(
        queue=RABBITMQ_QUEUE, exchange=RABBITMQ_EXCHANGE, routing_key=RABBITMQ_ROUTING_KEY
    )
    return connection, channel


def save_log(entry: dict):
    with get_db_conn() as conn:
        conn.execute(
            """
            INSERT INTO logs (timestamp, level, url, correlation_id, service, message, raw)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                entry.get("timestamp", datetime.utcnow().isoformat()),
                entry.get("level"),
                entry.get("url") or entry.get("path"),
                entry.get("correlation_id"),
                entry.get("service"),
                entry.get("message"),
                json.dumps(entry, default=str),
            ),
        )
        conn.commit()


@app.on_event("startup")
def on_startup():
    init_db()


@app.post("/logs")
def pull_logs():
    """
    Connect to RabbitMQ and persist all pending logs into the service database.
    """
    connection, channel = get_rabbit_channel()
    saved = 0
    try:
        while True:
            method_frame, header_frame, body = channel.basic_get(
                queue=RABBITMQ_QUEUE, auto_ack=False
            )
            if method_frame is None:
                break
            try:
                payload = json.loads(body.decode("utf-8"))
                payload["timestamp"] = parse_timestamp(payload.get("timestamp")).isoformat()
            except Exception:
                payload = {
                    "timestamp": datetime.utcnow().isoformat(),
                    "level": "INFO",
                    "message": body.decode("utf-8"),
                    "raw": body.decode("utf-8"),
                }
            save_log(payload)
            channel.basic_ack(method_frame.delivery_tag)
            saved += 1
    finally:
        connection.close()

    return {"message": "Logs pulled", "count": saved}


def _parse_date(value: str, end: bool = False) -> datetime:
    try:
        dt = datetime.fromisoformat(value)
    except Exception:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {value}")

    if end:
        return dt + timedelta(hours=23, minutes=59, seconds=59, microseconds=999999)
    return dt


@app.get("/logs/{datumOd}/{datumDo}")
def get_logs_between(datumOd: str, datumDo: str):
    start = _parse_date(datumOd)
    end = _parse_date(datumDo, end=True)
    with get_db_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, timestamp, level, url, correlation_id, service, message, raw
            FROM logs
            WHERE timestamp BETWEEN ? AND ?
            ORDER BY timestamp ASC
            """,
            (start.isoformat(), end.isoformat()),
        ).fetchall()

    results = []
    for r in rows:
        try:
            raw_payload = json.loads(r["raw"]) if r["raw"] else None
        except Exception:
            raw_payload = r["raw"]
        results.append(
            {
                "id": r["id"],
                "timestamp": r["timestamp"],
                "level": r["level"],
                "url": r["url"],
                "correlation_id": r["correlation_id"],
                "service": r["service"],
                "message": r["message"],
                "raw": raw_payload,
            }
        )

    return results


@app.delete("/logs")
def delete_logs():
    with get_db_conn() as conn:
        conn.execute("DELETE FROM logs")
        conn.commit()
    return {"message": "All logs deleted"}
