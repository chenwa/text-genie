const API_BASE_URL = "https://typinggenie.com/api"; // Production api relay to https://api.neutralfitgolf.com
// const API_BASE_URL = "http://localhost:8000"; // Local ProjectXiang
// const API_BASE_URL = "http://localhost:8000/api"; // Local api relay to https://api.neutralfitgolf.com

// (env) xiangchen@xiangs-MacBook-Pro ProjectXiang % uvicorn main:app --reload
// const API_BASE_URL = "http://localhost:8000"; // Local ProjectXiang

// (venv) xiangchen@xiangs-MacBook-Pro (text-genie/src/) api_relay % uvicorn main:app --host 0.0.0.0 --port 8000
// const API_BASE_URL = "http://localhost:8000/api"; // Local api relay to https://api.neutralfitgolf.com

// (venv) /home/ec2-user/text-genie/src/api_relay % uvicorn main:app --host 0.0.0.0 --port 8000
// const API_BASE_URL = "https://typinggenie.com/api"; // Production api relay to https://api.neutralfitgolf.com
export default API_BASE_URL;

/*
1. npm run build
2. scp -i TypingGenie.pem -r build/*  ec2-user@35.165.90.123:/home/ec2-user/react_build/
3. ssh -i TypingGenie.pem ec2-user@35.165.90.123
4. cd /home/ec2-user/react_build

15. sudo vi /etc/nginx/nginx.conf
*/