import mysql.connector

def get_db_connection():
    db_config = {
        "host": "103.148.77.238",
        "user": "admin",
        "password": "K4t@SandiKu",
        "database": "manageasset",
    }
    db = mysql.connector.connect(**db_config)
    lmd = db.cursor()
    return db, lmd