from fastapi import APIRouter
from backend.database import get_connection
from backend.models import Atcc_Data
from psycopg2.extras import RealDictCursor
from datetime import datetime
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/vehicle-count")
def get_summary(start_date_time:datetime, end_date_time:datetime):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = (
        """SELECT vehicle_name, COUNT(*) as vehicle_count
        FROM atcc_data
        WHERE date_time BETWEEN %s AND %s
        GROUP BY vehicle_name
        ORDER BY vehicle_count ASC"""
    )
    params = (start_date_time,end_date_time)

    cursor.execute(query,params)
    barSummary = cursor.fetchall()

    cursor.close()  
    conn.close()

    return barSummary


@router.get("/hourly-vehicle-count")
def get_summary(start_date_time:datetime, end_date_time:datetime):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = (
        """SELECT DATE_PART('hour',date_time) AS hour, COUNT(*) as vehicle_count
        FROM atcc_data
        WHERE date_time BETWEEN %s AND %s
        GROUP BY DATE_PART('hour',date_time)
        ORDER BY hour"""
    )
    params = (start_date_time,end_date_time)

    cursor.execute(query,params)
    lineSummary = cursor.fetchall()

    cursor.close()  
    conn.close()

    return lineSummary

@router.get("/vehicle-percentage")
def get_summary(start_date_time:datetime, end_date_time:datetime):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = (
        """SELECT vehicle_name, COUNT(*) as vehicle_count,
        (COUNT(*) * 100.0 / SUM(COUNT(*)) OVER ()) as percentage
        FROM atcc_data
        WHERE date_time BETWEEN %s AND %s
        GROUP BY vehicle_name
        ORDER BY vehicle_count ASC"""
    )
    params = (start_date_time,end_date_time)

    cursor.execute(query,params)
    PieSummary = cursor.fetchall()

    cursor.close()  
    conn.close()

    return PieSummary

@router.get("/doughnut-percentage")
def get_summary(start_date_time:datetime, end_date_time:datetime):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = (
        """SELECT vehicle_name, COUNT(*) as vehicle_count,
        (COUNT(*) * 100.0 / SUM(COUNT(*)) OVER ()) as percentage
        FROM atcc_data
        WHERE date_time BETWEEN %s AND %s
        GROUP BY vehicle_name
        ORDER BY vehicle_count ASC"""
    )
    params = (start_date_time,end_date_time)

    cursor.execute(query,params)
    dougnutSummary = cursor.fetchall()

    cursor.close()  
    conn.close()

    return dougnutSummary