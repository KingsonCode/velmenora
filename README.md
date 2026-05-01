)
🔁 Backend lifecycle

# restart backend (after build)

sudo systemctl restart velmenora-funded-backend

# check status

systemctl status velmenora-funded-backend

# stop service

sudo systemctl stop velmenora-funded-backend

# start service

sudo systemctl start velmenora-funded-backend
📊 Logs (live debugging)

# live logs (real-time)

journalctl -u velmenora-funded-backend -f

# last 100 lines

journalctl -u velmenora-funded-backend -n 100

# logs since last boot

journalctl -u velmenora-funded-backend -b
🧪 Health & connectivity

# local VPS check

curl <http://localhost:8002/api/health>

# external check (from laptop)

curl http://YOUR_VPS_IP:8002/api/health
🚀 Deploy flow (DAILY USE)
cd /opt/velmenora/backend/backend

npm run build
sudo systemctl restart velmenora-funded-backend
🧠 Port management (when things break)

# check who is using port 8002

lsof -i :8002

# kill process on port 8002

kill -9 $(lsof -t -i:8002)
⚙️ System debugging

# top memory usage

ps aux --sort=-%mem | head -10

# RAM overview

free -h

# real-time monitor

htop
🔐 Future (after Nginx setup)

# reload nginx after config changes

sudo systemctl reload nginx

# test nginx config

sudo nginx -t

🚀 Next Phase (when ready)

Tutafanya:

Domain (api.velmenora.com)
Nginx reverse proxy
HTTPS (Let’s Encrypt)
Close port 8002 externally (security)
