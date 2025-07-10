from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import json

load_dotenv()

router = APIRouter()

# Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
    
    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
    
    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)
    
    async def send_to_room(self, message: str, room_id: str, sender_id: str):
        # Get room participants
        participants = supabase.table("chat_participants").select("user_id").eq("room_id", room_id).execute()
        
        for participant in participants.data:
            user_id = participant["user_id"]
            if user_id != sender_id and user_id in self.active_connections:
                await self.active_connections[user_id].send_text(message)

manager = ConnectionManager()

class MessageCreate(BaseModel):
    room_id: str
    sender_id: str
    message_type: str
    content: str
    attachments: Optional[List[str]] = None

class MessageResponse(BaseModel):
    id: str
    room_id: str
    sender_id: str
    message_type: str
    content: str
    attachments: Optional[List[str]]
    is_read: bool
    created_at: str
    updated_at: str

class RoomCreate(BaseModel):
    name: str
    type: str
    participants: List[str]
    created_by: str

class RoomResponse(BaseModel):
    id: str
    name: str
    type: str
    created_by: str
    created_at: str
    updated_at: str

class ParticipantResponse(BaseModel):
    id: str
    room_id: str
    user_id: str
    role: str
    joined_at: str

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """WebSocket endpoint for real-time messaging"""
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Save message to database
            message_response = supabase.table("messages").insert({
                "room_id": message_data["room_id"],
                "sender_id": user_id,
                "message_type": message_data.get("message_type", "text"),
                "content": message_data["content"],
                "attachments": message_data.get("attachments", []),
                "is_read": False
            }).execute()
            
            # Send to room participants
            await manager.send_to_room(
                json.dumps(message_response.data[0]),
                message_data["room_id"],
                user_id
            )
            
    except WebSocketDisconnect:
        manager.disconnect(user_id)

@router.get("/rooms/", response_model=List[RoomResponse])
async def get_rooms(user_id: Optional[str] = None, room_type: Optional[str] = None, limit: int = 50, offset: int = 0):
    """Get chat rooms"""
    try:
        if user_id:
            # Get rooms where user is a participant
            participant_rooms = supabase.table("chat_participants").select("room_id").eq("user_id", user_id).execute()
            room_ids = [p["room_id"] for p in participant_rooms.data]
            
            if not room_ids:
                return []
            
            query = supabase.table("chat_rooms").select("*").in_("id", room_ids)
        else:
            query = supabase.table("chat_rooms").select("*")
        
        if room_type:
            query = query.eq("type", room_type)
        
        response = query.range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/rooms/{room_id}", response_model=RoomResponse)
async def get_room(room_id: str):
    """Get room by ID"""
    try:
        response = supabase.table("chat_rooms").select("*").eq("id", room_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Room not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rooms/", response_model=RoomResponse)
async def create_room(room: RoomCreate):
    """Create new chat room"""
    try:
        # Create room
        room_response = supabase.table("chat_rooms").insert({
            "name": room.name,
            "type": room.type,
            "created_by": room.created_by
        }).execute()
        
        room_id = room_response.data[0]["id"]
        
        # Add participants
        participants_data = []
        for participant_id in room.participants:
            participants_data.append({
                "room_id": room_id,
                "user_id": participant_id,
                "role": "admin" if participant_id == room.created_by else "member"
            })
        
        supabase.table("chat_participants").insert(participants_data).execute()
        
        return room_response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/rooms/{room_id}")
async def delete_room(room_id: str):
    """Delete chat room"""
    try:
        # Delete participants
        supabase.table("chat_participants").delete().eq("room_id", room_id).execute()
        
        # Delete messages
        supabase.table("messages").delete().eq("room_id", room_id).execute()
        
        # Delete room
        response = supabase.table("chat_rooms").delete().eq("id", room_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Room not found")
        
        return {"message": "Room deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/rooms/{room_id}/messages", response_model=List[MessageResponse])
async def get_room_messages(room_id: str, limit: int = 50, offset: int = 0):
    """Get messages in a room"""
    try:
        response = supabase.table("messages").select("*").eq("room_id", room_id).range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/messages/", response_model=MessageResponse)
async def send_message(message: MessageCreate):
    """Send a message"""
    try:
        response = supabase.table("messages").insert({
            "room_id": message.room_id,
            "sender_id": message.sender_id,
            "message_type": message.message_type,
            "content": message.content,
            "attachments": message.attachments,
            "is_read": False
        }).execute()
        
        # Send to WebSocket connections
        await manager.send_to_room(
            json.dumps(response.data[0]),
            message.room_id,
            message.sender_id
        )
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/messages/{message_id}", response_model=MessageResponse)
async def get_message(message_id: str):
    """Get message by ID"""
    try:
        response = supabase.table("messages").select("*").eq("id", message_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Message not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/messages/{message_id}")
async def update_message(message_id: str, content: str):
    """Update message content"""
    try:
        response = supabase.table("messages").update({
            "content": content
        }).eq("id", message_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Message not found")
        
        return {"message": "Message updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/messages/{message_id}")
async def delete_message(message_id: str):
    """Delete message"""
    try:
        response = supabase.table("messages").delete().eq("id", message_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Message not found")
        
        return {"message": "Message deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/messages/{message_id}/read")
async def mark_message_read(message_id: str):
    """Mark message as read"""
    try:
        response = supabase.table("messages").update({
            "is_read": True
        }).eq("id", message_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Message not found")
        
        return {"message": "Message marked as read"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/rooms/{room_id}/participants", response_model=List[ParticipantResponse])
async def get_room_participants(room_id: str):
    """Get room participants"""
    try:
        response = supabase.table("chat_participants").select("*").eq("room_id", room_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rooms/{room_id}/participants")
async def add_participant(room_id: str, user_id: str, role: str = "member"):
    """Add participant to room"""
    try:
        response = supabase.table("chat_participants").insert({
            "room_id": room_id,
            "user_id": user_id,
            "role": role
        }).execute()
        
        return {"message": "Participant added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/rooms/{room_id}/participants/{user_id}")
async def remove_participant(room_id: str, user_id: str):
    """Remove participant from room"""
    try:
        response = supabase.table("chat_participants").delete().eq("room_id", room_id).eq("user_id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Participant not found")
        
        return {"message": "Participant removed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}/unread-count")
async def get_unread_count(user_id: str):
    """Get user's unread message count"""
    try:
        # Get user's rooms
        participant_rooms = supabase.table("chat_participants").select("room_id").eq("user_id", user_id).execute()
        room_ids = [p["room_id"] for p in participant_rooms.data]
        
        if not room_ids:
            return {"unread_count": 0}
        
        # Get unread messages count
        unread_messages = supabase.table("messages").select("id").in_("room_id", room_ids).eq("is_read", False).neq("sender_id", user_id).execute()
        
        return {"unread_count": len(unread_messages.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search")
async def search_messages(query: str, room_id: Optional[str] = None, user_id: Optional[str] = None, limit: int = 50):
    """Search messages"""
    try:
        search_query = supabase.table("messages").select("*").ilike("content", f"%{query}%")
        
        if room_id:
            search_query = search_query.eq("room_id", room_id)
        if user_id:
            search_query = search_query.eq("sender_id", user_id)
        
        response = search_query.limit(limit).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
