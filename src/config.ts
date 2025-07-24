const API_BASE_URL = "https://typinggenie.com/api"; // Production api relay to https://api.neutralfitgolf.com

// (env) xiangchen@xiangs-MacBook-Pro ProjectXiang % uvicorn main:app --reload
// const API_BASE_URL = "http://localhost:8000"; // Local ProjectXiang

// (venv) xiangchen@xiangs-MacBook-Pro (text-genie/src/) api_relay % uvicorn main:app --host 0.0.0.0 --port 8000
// const API_BASE_URL = "http://localhost:8000/api"; // Local api relay to https://api.neutralfitgolf.com

// (venv) /home/ec2-user/text-genie/src/api_relay % uvicorn main:app --host 0.0.0.0 --port 8000
// const API_BASE_URL = "https://typinggenie.com/api"; // Production api relay to https://api.neutralfitgolf.com
export default API_BASE_URL;