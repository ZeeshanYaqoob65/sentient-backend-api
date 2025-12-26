# API Monitoring & Dashboard Guide

## 🎯 Available Monitoring Solutions

### 1. **Express Status Monitor** (Integrated ✅)

**Built-in Real-time Dashboard**

- **URL:** `http://localhost:3000/status` or `https://api.sentientapp.pk/status`
- **Features:**
  - Real-time CPU, Memory, Load metrics
  - Response time charts
  - Requests per second (RPS)
  - Status code distribution
  - Heap memory usage
  - Historical data (1min, 5min, 15min intervals)

**Access:** Simply visit `/status` in your browser

---

### 2. **Performance API Endpoint** (Custom ✅)

**JSON API for Programmatic Access**

- **GET** `/api/monitor/performance`
- **Response:**
```json
{
  "success": true,
  "data": {
    "totalRequests": 150,
    "averageResponseTime": 45,
    "slowestAPIs": [
      {
        "endpoint": "POST /api/auth/login",
        "average": 738,
        "max": 1200,
        "min": 200,
        "count": 10
      }
    ],
    "fastestAPIs": [...],
    "byEndpoint": {
      "GET /api/ba/stock": {
        "average": 150,
        "max": 300,
        "min": 50,
        "count": 25
      }
    }
  }
}
```

**Clear Performance Data:**
- **POST** `/api/monitor/clear`

---

### 3. **PM2 Monitoring** (Already Configured ✅)

**PM2 Built-in Monitoring**

```bash
# View real-time monitoring
pm2 monit

# View process list with metrics
pm2 list

# View detailed info
pm2 show sentient-api

# View logs
pm2 logs sentient-api
```

**PM2 Plus (Cloud Dashboard)** - Optional
- Free tier available
- Web-based dashboard
- Historical data
- Alerts

**Setup:**
```bash
pm2 link <secret> <public>
# Get credentials from: https://pm2.io
```

---

### 4. **Third-Party Monitoring Solutions**

#### **Option A: Grafana + Prometheus** (Open Source)
- **Best for:** Advanced monitoring, custom dashboards
- **Setup:** Requires Prometheus exporter
- **Cost:** Free

#### **Option B: New Relic** (Commercial)
- **Best for:** Enterprise monitoring
- **Features:** APM, error tracking, alerts
- **Cost:** Free tier available, paid plans

#### **Option C: Datadog** (Commercial)
- **Best for:** Full-stack monitoring
- **Features:** APM, logs, infrastructure
- **Cost:** Free tier available, paid plans

#### **Option D: PM2 Plus** (Recommended for PM2 users)
- **Best for:** Simple, PM2-native monitoring
- **Features:** Real-time metrics, alerts, logs
- **Cost:** Free tier available

---

## 📊 Current Monitoring Setup

### Express Status Monitor Dashboard

**Access:** `https://api.sentientapp.pk/status`

**What You'll See:**
- **CPU Usage:** Real-time CPU percentage
- **Memory Usage:** Heap and RSS memory
- **Load Average:** System load
- **Response Time:** Average response time chart
- **RPS:** Requests per second
- **Status Codes:** HTTP status code distribution
- **Health Checks:** `/health` endpoint status

### Performance Logs

**File Location:** `logs/performance.log`

**Format:**
```
2025-12-26T18:48:46.582Z | GET /api/ba/stock | 200 | 150ms | User: 1568
2025-12-26T18:48:47.123Z | POST /api/auth/login | 200 | 738ms | User: N/A
```

**Slow Request Alerts:**
- Requests taking > 1000ms are logged to console with ⚠️ warning

---

## 🔍 How to Monitor API Performance

### Method 1: Web Dashboard (Easiest)

1. Open browser: `https://api.sentientapp.pk/status`
2. View real-time metrics
3. Check response time charts
4. Monitor CPU/Memory usage

### Method 2: Performance API

```bash
# Get performance stats
curl https://api.sentientapp.pk/api/monitor/performance

# Find slowest APIs
curl https://api.sentientapp.pk/api/monitor/performance | \
  jq '.data.slowestAPIs'
```

### Method 3: PM2 Monitoring

```bash
# SSH to server
ssh apisentientapp@api.sentientapp.pk

# View real-time monitoring
pm2 monit

# View logs
pm2 logs sentient-api --lines 100
```

### Method 4: Log Files

```bash
# View performance logs
tail -f logs/performance.log

# Find slow requests
grep "ms" logs/performance.log | awk '$NF > 1000'
```

---

## 📈 Performance Metrics Tracked

### Per Endpoint:
- **Average Response Time**
- **Maximum Response Time**
- **Minimum Response Time**
- **Request Count**

### Overall:
- **Total Requests**
- **Average Response Time**
- **Slowest 10 APIs**
- **Fastest 10 APIs**

---

## 🚨 Setting Up Alerts

### Option 1: PM2 Plus Alerts
1. Sign up at https://pm2.io
2. Link PM2: `pm2 link <secret> <public>`
3. Configure alerts in dashboard

### Option 2: Custom Alert Script
Create a cron job to check performance API:

```bash
#!/bin/bash
# check-slow-apis.sh

SLOW_THRESHOLD=1000
RESPONSE=$(curl -s https://api.sentientapp.pk/api/monitor/performance)
AVG_TIME=$(echo $RESPONSE | jq '.data.averageResponseTime')

if [ "$AVG_TIME" -gt "$SLOW_THRESHOLD" ]; then
  echo "⚠️ Alert: Average response time is ${AVG_TIME}ms"
  # Send email/notification
fi
```

---

## 📝 Recommended Monitoring Strategy

1. **Daily:** Check `/status` dashboard
2. **Weekly:** Review `/api/monitor/performance` for slow APIs
3. **Alerts:** Set up PM2 Plus or custom alerts for > 1s responses
4. **Logs:** Monitor `logs/performance.log` for patterns

---

## 🔗 Quick Links

- **Dashboard:** https://api.sentientapp.pk/status
- **Performance API:** https://api.sentientapp.pk/api/monitor/performance
- **Health Check:** https://api.sentientapp.pk/health

---

**Last Updated:** December 26, 2025

