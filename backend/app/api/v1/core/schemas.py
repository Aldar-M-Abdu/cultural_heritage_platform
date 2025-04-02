from datetime import datetime
from enum import Enum
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


### AUTH SCHEMAS
class TokenSchema(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


### USER SCHEMAS
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    is_active: bool = True
    is_admin: bool = False

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    password: str


class UserRegisterSchema(BaseModel):
    email: EmailStr
    username: Optional[str] = None
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

    class Config:
        from_attributes = True


class UserOutSchema(UserBase):
    id: UUID

    class Config:
        from_attributes = True


class UserSchema(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    disabled: bool = False
    created_at: datetime
    company_id: int | None = None
    course_enrollments: list["UserCourseEnrollmentSchema"] | None = []
    is_superuser: bool

    model_config = ConfigDict(from_attributes=True)


class UserUpdateSchema(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr | None = None
    model_config = ConfigDict(from_attributes=True)


class PasswordChangeSchema(BaseModel):
    current_password: str
    new_password: str


### COURSE SCHEMAS
class EnrollmentStatus(str, Enum):
    ENROLLED = "enrolled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    DROPPED = "dropped"


class CourseBase(BaseModel):
    name: str
    description: str | None = None
    is_active: bool = True


class CourseSchema(CourseBase):
    id: int
    created_at: datetime
    student_enrollments: list["UserCourseEnrollmentSchema"] | None = []
    model_config = ConfigDict(from_attributes=True)


class CourseCreateSchema(BaseModel):
    """Base schema for course data"""
    name: str = Field(
        ..., min_length=1, max_length=200, description="The name of the course"
    )
    description: str = Field(None, max_length=1000, description="Course description")
    is_active: bool = Field(
        True, description="Whether the course is active and available for enrollment"
    )


class CourseUpdate(CourseBase):
    name: str | None = None
    is_active: bool | None = None


### ENROLLMENT SCHEMAS
class UserCourseEnrollmentBase(BaseModel):
    course_id: int
    user_id: int
    status: EnrollmentStatus = EnrollmentStatus.ENROLLED
    grade: float | None = None
    model_config = ConfigDict(from_attributes=True)


class UserCourseEnrollmentSchema(UserCourseEnrollmentBase):
    enrolled_at: datetime
    completion_date: datetime | None = None
    model_config = ConfigDict(from_attributes=True)


class UserCourseEnrollmentCreate(BaseModel):
    course_id: int
    user_id: int
    model_config = ConfigDict(
        json_schema_extra={"example": {"course_id": 1, "user_id": 1}}
    )


class UserCourseEnrollmentUpdate(BaseModel):
    status: EnrollmentStatus | None = None
    grade: float | None = Field(None, ge=0, le=100)
    model_config = ConfigDict(
        json_schema_extra={"example": {"status": "completed", "grade": 95.5}}
    )


### COMPANY SCHEMAS
class CompanySchema(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="The name of the company, unique and required.",
    )
    postal_code: str = Field(
        min_length=1,
        max_length=20,
        description="The postal code for the company's address. Optional.",
    )
    email: EmailStr = Field(
        description="The contact email for the company. Optional and must be a valid email format."
    )
    description: str = Field(description="A description of the company. Optional.")
    analytics_module: bool = Field(
        default=None,
        description="Indicates whether the company uses the analytics module. Required.",
    )
    company_type_id: int

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "name": "Tech University",
                "postal_code": "12345",
                "email": "info@techuniversity.com",
                "description": "A leading institution in technology education and research.",
                "analytics_module": True,
            }
        },
    )


class CompanySlimSchema(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="The name of the company, unique and required.",
    )
    email: EmailStr = Field(
        description="The contact email for the company. Optional and must be a valid email format."
    )
    company_type_id: int


class CompanyOutSchema(CompanySchema):
    id: int


class CompanyTypeSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    model_config = ConfigDict(from_attributes=True)


class CompanyTypeFullSchema(CompanyTypeSchema):
    companies: list[CompanySchema]


class CompanyAndTypeSchema(CompanySchema):
    company_type_id: int


### COMMENT SCHEMAS
class CommentBase(BaseModel):
    text: str
    cultural_item_id: UUID


class CommentCreate(BaseModel):
    text: str = Field(..., max_length=500)
    cultural_item_id: UUID
    model_config = ConfigDict(from_attributes=True)


class CommentSchema(CommentBase):
    id: UUID
    created_at: datetime
    user_id: Optional[UUID] = None
    model_config = ConfigDict(from_attributes=True)


### CULTURAL ITEM SCHEMAS
class TagBase(BaseModel):
    name: str
    model_config = ConfigDict(from_attributes=True)


class Tag(BaseModel):
    id: UUID
    name: str
    model_config = ConfigDict(from_attributes=True)


class MediaType(str, Enum):
    """Valid media types for cultural item media"""
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    DOCUMENT = "document"


class MediaBase(BaseModel):
    url: str
    type: str
    caption: Optional[str] = None
    cultural_item_id: UUID


class Media(BaseModel):
    id: UUID
    url: str
    media_type: str
    title: str | None = None
    description: str | None = None
    model_config = ConfigDict(from_attributes=True)


class MediaCreate(BaseModel):
    url: str
    media_type: MediaType  # Using the enum for validation
    title: str | None = None
    description: str | None = None
    cultural_item_id: UUID
    model_config = ConfigDict(from_attributes=True)


class CulturalItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    region: Optional[str] = None
    time_period: Optional[str] = None


class CulturalItemCreate(BaseModel):
    title: str
    description: str | None = None
    time_period: str | None = None
    region: str | None = None
    image_url: str | None = None
    video_url: str | None = None
    audio_url: str | None = None
    historical_significance: str | None = None
    tags: List[str] | None = []


class CulturalItemUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    time_period: str | None = None
    region: str | None = None
    image_url: str | None = None
    video_url: str | None = None
    audio_url: str | None = None
    historical_significance: str | None = None
    tags: List[str] | None = []
    model_config = ConfigDict(from_attributes=True)


class CulturalItem(BaseModel):
    id: UUID
    title: str
    description: str | None = None
    time_period: str | None = None
    region: str | None = None
    image_url: str | None = None
    video_url: str | None = None
    audio_url: str | None = None
    historical_significance: str | None = None
    tags: List[Tag] = []
    media: List[Media] = []
    model_config = ConfigDict(from_attributes=True)


class CulturalItemDetail(CulturalItem):
    media: List[Media] = []
    comments: List[CommentSchema] = []

    class Config:
        from_attributes = True


### ARTIFACT SCHEMAS
class ArtifactSchema(BaseModel):
    id: int
    title: str
    description: str
    region: str
    time_period: str
    category: str
    image_url: str | None = None
    tags: list[str] = []
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ArtifactCreateSchema(BaseModel):
    title: str = Field(..., max_length=200)
    description: str = Field(..., max_length=1000)
    region: str = Field(..., max_length=100)
    time_period: str = Field(..., max_length=100)
    category: str = Field(..., max_length=50)
    image_url: str | None = None
    tags: list[str] = Field(default=[])


### NOTIFICATION SCHEMAS
class NotificationSchema(BaseModel):
    id: int
    user_id: int
    message: str
    is_read: bool = False
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class NotificationCreateSchema(BaseModel):
    user_id: int
    message: str = Field(..., max_length=255)


### ITEM SCHEMAS (GENERIC)
class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


class Item(ItemBase):
    id: int
    owner_id: Optional[UUID] = None

    class Config:
        from_attributes = True


class PasswordResetRequestSchema(BaseModel):
    email: EmailStr = Field(..., description="Email address for password reset")

    model_config = ConfigDict(
        json_schema_extra={"example": {"email": "user@example.com"}}
    )