from pydantic import BaseModel
from datetime import datetime


class Atcc_Data(BaseModel):
    id : int
    date_time : datetime
    vehicle_id : int
    vehicle_class_id : int
    vehicle_name :str
    # ai_class: str
    # audited_class: str
    direction: int
    # cross_line: int
    # x1_coords: int
    # y1_coords: int
    # x2_coords: int
    # y2_coords: int
    frame_number: int
    # image_path: str
    # play_stream_id: int
    # is_audit: int
    # kit_id: int
    # last_modified: str
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()  # Serialize datetime as ISO string
        }
