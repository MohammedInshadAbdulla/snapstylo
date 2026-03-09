import sqlite3

try:
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Check current columns
    cursor.execute("PRAGMA table_info(user)")
    columns = [col[1] for col in cursor.fetchall()]
    print(f"Current columns (user): {columns}")

    # Add columns if they don't exist
    if 'is_verified' not in columns:
        cursor.execute("ALTER TABLE user ADD COLUMN is_verified BOOLEAN DEFAULT 0")
        print("Added is_verified")
    
    if 'verification_code' not in columns:
        cursor.execute("ALTER TABLE user ADD COLUMN verification_code TEXT")
        print("Added verification_code")

    # Mark all existing as verified
    cursor.execute("UPDATE user SET is_verified = 1")
    
    conn.commit()
    conn.close()
    print("Migration complete!")
except Exception as e:
    print(f"An error occurred: {e}")
