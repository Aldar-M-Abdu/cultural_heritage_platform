from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field


### NEW SCHEMAS
# We use this for our auth
class TokenSchema(BaseModel):
    access_token: str
    token_type: str


# Add these schemas to your existing schemas.py file
class UserUpdateSchema(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr | None = None
    model_config = ConfigDict(from_attributes=True)


class PasswordChangeSchema(BaseModel):
    current_password: str
    new_password: str


# We use this when registering users
class UserRegisterSchema(BaseModel):
    email: str
    first_name: str
    last_name: str
    password: str
    model_config = ConfigDict(from_attributes=True)

    # TODO ADD VALIDATION


# We use this to return user data
class UserOutSchema(BaseModel):
    id: int
    email: str
    last_name: str
    first_name: str
    is_superuser: bool
    model_config = ConfigDict(from_attributes=True)


#### OLD SCHEMAS
class EnrollmentStatus(str, Enum):
    ENROLLED = "enrolled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    DROPPED = "dropped"


# Base schemas for minimal representation
class CourseBase(BaseModel):
    name: str
    description: str | None = None
    is_active: bool = True


class UserCourseEnrollmentBase(BaseModel):
    course_id: int
    user_id: int
    status: EnrollmentStatus = EnrollmentStatus.ENROLLED
    grade: float | None = None
    model_config = ConfigDict(from_attributes=True)


# Extended schemas for full representation
class UserCourseEnrollmentSchema(UserCourseEnrollmentBase):
    enrolled_at: datetime
    completion_date: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class CourseSchema(CourseBase):
    id: int
    created_at: datetime
    student_enrollments: list[UserCourseEnrollmentSchema] | None = []

    model_config = ConfigDict(from_attributes=True)


class UserSchema(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    disabled: bool = False
    created_at: datetime
    company_id: int | None = None
    course_enrollments: list[UserCourseEnrollmentSchema] | None = []

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


# Company related schemas (kept from original)
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


# New schemas for Artifact, Comment, and Notification
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


class CommentSchema(BaseModel):
    id: int
    text: str
    user_id: int
    artifact_id: int
    created_at: datetime
    replies: list["CommentSchema"] = []

    model_config = ConfigDict(from_attributes=True)


class CommentCreateSchema(BaseModel):
    text: str = Field(..., max_length=500)
    artifact_id: int


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
