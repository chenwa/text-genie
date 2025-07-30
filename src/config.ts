const API_BASE_URL = "https://typinggenie.com/api"; // Production api relay to https://api.neutralfitgolf.com
// const API_BASE_URL = "http://localhost:8000"; // Local ProjectXiang
// const API_BASE_URL = "http://localhost:8000/api"; // Local api relay to https://api.neutralfitgolf.com

// (env) xiangchen@xiangs-MacBook-Pro ProjectXiang % uvicorn main:app --reload
// const API_BASE_URL = "http://localhost:8000"; // Local ProjectXiang

// (venv) xiangchen@xiangs-MacBook-Pro (text-genie/src/) api_relay % uvicorn main:app --host 0.0.0.0 --port 8000
// const API_BASE_URL = "http://localhost:8000/api"; // Local api relay to https://api.neutralfitgolf.com

// (venv) /home/ec2-user/api_relay % uvicorn main:app --host 0.0.0.0 --port 8000
// const API_BASE_URL = "https://typinggenie.com/api"; // Production api relay to https://api.neutralfitgolf.com
export default API_BASE_URL;

/*
# To deploy the React app to the server, follow these steps:
1. npm run build
2. scp -i TypingGenie.pem -r build/*  ec2-user@35.165.90.123:/home/ec2-user/react_build/

# To connect to the server:
3. ssh -i TypingGenie.pem ec2-user@35.165.90.123
4. cd /home/ec2-user/react_build
5. cd /home/ec2-user/api_relay
6. source venv/bin/activate
7. nohup uvicorn main:app --host 0.0.0.0 --port 8000 > log.txt 2>&1 &

# useful commands:
12. sudo systemctl restart nginx
13. sudo systemctl status nginx
14. curl -X 'GET' 'http://localhost:8000/api/reer_string=Chat%20conversation%20from%20x-AI&lines=100&filter_info_debug=true' -H 'accep_debug=true' -H 'accept: application/json'
15. curl -X 'GET' 'https://typinggenie.com/api/read_app_log?filter_string=Chat%20conversation%20from%20x-AI&lines=100&filter_info_debug=true' -H 'accept: application/json'
16. sudo vi /etc/nginx/nginx.conf
*/