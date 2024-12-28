from fastapi import APIRouter, HTTPException, UploadFile,File, Form
from backend.database import get_connection
from backend.models import Atcc_Data
from psycopg2.extras import RealDictCursor
from fastapi import Request

router = APIRouter()

@router.get ("/data")
def get_data (start_date_time:str, end_date_time:str):
    conn =get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = "SELECT * FROM atcc_data WHERE datetime BETWEEN %s AND %s"
    params = [start_date_time,end_date_time]

    cursor.execute(query,params)
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data

@router.post ("/submit")
# async def insert_data (image_file: UploadFile=File(...),  newData : Atcc_Data=Form(...)):
async def insert_data (newData : Atcc_Data):
    conn = get_connection()
    cursor = conn.cursor()

    query = (
        "INSERT INTO atcc_data (id,date_time, vehicle_id, vehicle_class_id, vehicle_name,direction,frame_number,image_path)"
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    )
    data = newData.dict()

    data['image_path'] = ""
    keys_order = [
    "id", "date_time", "vehicle_id", "vehicle_class_id",
    "vehicle_name", "direction", "frame_number", "image_path"
    ]

# Convert dictionary to tuple based on the key order
    data_tuple = tuple(data[key] for key in keys_order)
    cursor.execute(query,data_tuple)
    conn.commit()

    cursor.close()
    conn.close()

    return {"message" : "Data inserted successfully"}