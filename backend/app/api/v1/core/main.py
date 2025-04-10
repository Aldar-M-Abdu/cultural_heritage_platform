from fastapi import FastAPI
from app.api.v1.core.endpoints import blog_posts

app = FastAPI()

# Mount the blog_posts router directly at /api/v1/blog-posts
app.include_router(
    blog_posts.router,
    prefix="/api/v1/blog-posts",
    tags=["blog"]
)

# Other routers would be included here
# ...
