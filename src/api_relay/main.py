from fastapi import FastAPI, Request
from fastapi.responses import Response
import httpx
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your frontend URL(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Replace with your actual backend URL
BACKEND_URL = "https://api.neutralfitgolf.com"

@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def relay_request(path: str, request: Request):
    # Build the target URL
    target_url = f"{BACKEND_URL}/{path}"

    # Extract query params
    query_params = str(request.query_params)

    # Extract headers
    headers = dict(request.headers)

    # Read request body
    body = await request.body()

    # Use httpx to forward the request
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=target_url + (f"?{query_params}" if query_params else ""),
            headers=headers,
            content=body
        )

    # Return the backend’s response with the original status code
    return Response(
        content=response.content,
        status_code=response.status_code,
        headers=dict(response.headers),
        media_type=response.headers.get("content-type")
    )
