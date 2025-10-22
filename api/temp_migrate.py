from sqlalchemy import create_engine, text
from database import DATABASE_URL

def run_migration():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        connection.execute(text("""ALTER TABLE "user_settings" ADD COLUMN "custom_subjects" text[] DEFAULT '{"Math","Physics","Chemistry","Biology","History","English","Computer Science","Other"}'"""))
        connection.commit()
    print("Migration applied successfully!")

if __name__ == "__main__":
    run_migration()
