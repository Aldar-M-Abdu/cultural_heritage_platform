from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DB_URL: str
    API_PREFIX: str
    ENVIRONMENT: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 60  # Default to 1 hour
    POSTMARK_TOKEN: str = ""  # Add your Postmark API token here
    FRONTEND_BASE_URL: str = "http://localhost:5173"  # Frontend URL for reset links

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
