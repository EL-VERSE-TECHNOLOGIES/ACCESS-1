from motor.motor_asyncio import AsyncIOMotorClient
import os
import datetime

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://supremeelyon606_db_user:mqZd5xcCdMvtVPE1@eee.osa2knp.mongodb.net/?appName=EEE")

client = AsyncIOMotorClient(MONGODB_URI)
db = client.elaccess

async def log_audit(action: str, user_id: str, details: str):
    await db.audit_logs.insert_one({
        "action": action,
        "user_id": user_id,
        "details": details,
        "timestamp": datetime.datetime.now()
    })

async def check_mongo_connection():
    try:
        # The ismaster command is cheap and does not require auth.
        await client.admin.command('ismaster')
        print("MongoDB connection successful")
        return True
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        return False
