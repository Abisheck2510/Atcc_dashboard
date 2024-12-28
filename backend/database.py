import psycopg2
from  psycopg2 import sql

def get_connection():
    return psycopg2.connect(
        host = "localhost",
        user = "postgres",
        password = "root",
        database = "Atcc_database"
    )
    return connection