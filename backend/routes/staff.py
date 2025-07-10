from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

class StaffCreate(BaseModel):
    user_id: str
    department: str
    position: str
    salary: float
    hire_date: str
    permissions: List[str]

class StaffUpdate(BaseModel):
    department: Optional[str] = None
    position: Optional[str] = None
    salary: Optional[float] = None
    permissions: Optional[List[str]] = None
    is_active: Optional[bool] = None

class StaffResponse(BaseModel):
    id: str
    user_id: str
    department: str
    position: str
    salary: float
    hire_date: str
    permissions: List[str]
    is_active: bool
    created_at: str
    updated_at: str

class TaskCreate(BaseModel):
    assigned_to: str
    assigned_by: str
    title: str
    description: str
    priority: str
    due_date: Optional[str] = None
    category: str

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = None

class TaskResponse(BaseModel):
    id: str
    assigned_to: str
    assigned_by: str
    title: str
    description: str
    priority: str
    status: str
    progress: int
    due_date: Optional[str]
    category: str
    created_at: str
    updated_at: str

@router.get("/", response_model=List[StaffResponse])
async def get_staff(
    department: Optional[str] = None,
    position: Optional[str] = None,
    is_active: Optional[bool] = None,
    limit: int = 50,
    offset: int = 0
):
    """Get staff members with filtering"""
    try:
        query = supabase.table("staff").select("*")
        
        if department:
            query = query.eq("department", department)
        if position:
            query = query.eq("position", position)
        if is_active is not None:
            query = query.eq("is_active", is_active)
        
        response = query.range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{staff_id}", response_model=StaffResponse)
async def get_staff_member(staff_id: str):
    """Get staff member by ID"""
    try:
        response = supabase.table("staff").select("*").eq("id", staff_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Staff member not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=StaffResponse)
async def create_staff_member(staff: StaffCreate):
    """Create new staff member"""
    try:
        response = supabase.table("staff").insert({
            "user_id": staff.user_id,
            "department": staff.department,
            "position": staff.position,
            "salary": staff.salary,
            "hire_date": staff.hire_date,
            "permissions": staff.permissions,
            "is_active": True
        }).execute()
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{staff_id}", response_model=StaffResponse)
async def update_staff_member(staff_id: str, staff: StaffUpdate):
    """Update staff member"""
    try:
        update_data = {k: v for k, v in staff.dict().items() if v is not None}
        
        response = supabase.table("staff").update(update_data).eq("id", staff_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Staff member not found")
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{staff_id}")
async def delete_staff_member(staff_id: str):
    """Delete staff member"""
    try:
        response = supabase.table("staff").update({"is_active": False}).eq("id", staff_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Staff member not found")
        
        return {"message": "Staff member deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tasks", response_model=List[TaskResponse])
async def get_tasks(
    assigned_to: Optional[str] = None,
    assigned_by: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    """Get tasks with filtering"""
    try:
        query = supabase.table("staff_tasks").select("*")
        
        if assigned_to:
            query = query.eq("assigned_to", assigned_to)
        if assigned_by:
            query = query.eq("assigned_by", assigned_by)
        if status:
            query = query.eq("status", status)
        if priority:
            query = query.eq("priority", priority)
        if category:
            query = query.eq("category", category)
        
        response = query.range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str):
    """Get task by ID"""
    try:
        response = supabase.table("staff_tasks").select("*").eq("id", task_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tasks", response_model=TaskResponse)
async def create_task(task: TaskCreate):
    """Create new task"""
    try:
        response = supabase.table("staff_tasks").insert({
            "assigned_to": task.assigned_to,
            "assigned_by": task.assigned_by,
            "title": task.title,
            "description": task.description,
            "priority": task.priority,
            "due_date": task.due_date,
            "category": task.category,
            "status": "pending",
            "progress": 0
        }).execute()
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, task: TaskUpdate):
    """Update task"""
    try:
        update_data = {k: v for k, v in task.dict().items() if v is not None}
        
        response = supabase.table("staff_tasks").update(update_data).eq("id", task_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    """Delete task"""
    try:
        response = supabase.table("staff_tasks").delete().eq("id", task_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return {"message": "Task deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/departments")
async def get_departments():
    """Get available departments"""
    try:
        response = supabase.table("staff").select("department").execute()
        departments = list(set([item["department"] for item in response.data]))
        return {"departments": departments}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/positions")
async def get_positions():
    """Get available positions"""
    try:
        response = supabase.table("staff").select("position").execute()
        positions = list(set([item["position"] for item in response.data]))
        return {"positions": positions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{staff_id}/tasks", response_model=List[TaskResponse])
async def get_staff_tasks(staff_id: str, limit: int = 50, offset: int = 0):
    """Get tasks assigned to a staff member"""
    try:
        response = supabase.table("staff_tasks").select("*").eq("assigned_to", staff_id).range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{staff_id}/performance")
async def get_staff_performance(staff_id: str):
    """Get staff performance metrics"""
    try:
        # Get task statistics
        tasks = supabase.table("staff_tasks").select("*").eq("assigned_to", staff_id).execute()
        
        total_tasks = len(tasks.data)
        completed_tasks = len([t for t in tasks.data if t["status"] == "completed"])
        pending_tasks = len([t for t in tasks.data if t["status"] == "pending"])
        in_progress_tasks = len([t for t in tasks.data if t["status"] == "in_progress"])
        
        return {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "in_progress_tasks": in_progress_tasks,
            "completion_rate": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
