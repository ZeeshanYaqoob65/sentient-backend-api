# Sentient BA API

Node.js REST API for Sentient Brand Ambassador application built with TypeORM and Express.

## Features

- ✅ User Authentication (BA & Supervisor)
- ✅ Location-based Check-in/Check-out
- ✅ Selfie Upload for Attendance
- ✅ Stock Quantity Management
- ✅ Price Management
- ✅ Daily Sales Recording
- ✅ Usership Tracking
- ✅ Competition Sales Tracking
- ✅ Dashboard with Performance Metrics
- ✅ JWT Authentication
- ✅ TypeORM with MySQL
- ✅ File Upload with Multer
- ✅ Distance Calculation (Haversine Formula)

## Prerequisites

- Node.js >= 16.x
- MySQL >= 5.7
- npm or yarn

## Installation

### 1. Clone and Install Dependencies

```bash
cd api
npm install
```

### 2. Setup Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE hnd440_sentient CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

# Import the SQL dump
mysql -u root -p hnd440_sentient < ../hnd440_sentient.sql
```

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

Update the following variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=hnd440_sentient
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Create Upload Directory

```bash
mkdir -p uploads
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
# Build TypeScript
npm run build

# Start server
npm start
```

## API Endpoints

### Authentication

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "ba_username",
  "password": "password",
  "utype": 4,
  "app_id": "unique_device_id",
  "latitude": "31.5204",
  "longitude": "74.3587"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "uid": 1,
    "username": "ba_username",
    "fullname": "John Doe",
    "utype": 4,
    "asid": 25,
    "store": {...},
    "brand": {...}
  },
  "requiresSelfie": true,
  "attendance": {...}
}
```

#### Upload Selfie

```http
POST /api/auth/upload-selfie
Content-Type: multipart/form-data

{
  "uid": 1,
  "latitude": "31.5204",
  "longitude": "74.3587",
  "image": <file>
}
```

#### Logout

```http
POST /api/auth/logout
Content-Type: application/json

{
  "uid": 1,
  "latitude": "31.5204",
  "longitude": "74.3587"
}
```

### BA Endpoints (Requires Authentication)

All BA endpoints require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

#### Get Dashboard

```http
GET /api/ba/dashboard
```

**Response:**

```json
{
  "success": true,
  "profile": {
    "name": "John Doe",
    "brand": "Brand Name",
    "store": "Store Name",
    "city": "Lahore"
  },
  "performance": {
    "targetPerDay": 100,
    "monthlyTarget": 2600,
    "targetTillDate": 1500,
    "totalSale": 1200,
    "dailyAchievement": 80,
    "monthlyAchievement": 46,
    "perDayAvg": 80,
    "remainingTarget": 1400,
    "workingDays": 15,
    "avgUsership": 75
  },
  "todayStatus": {
    "stockStatus": 1,
    "priceStatus": 1,
    "saleStatus": 0,
    "usershipStatus": 0,
    "comsaleStatus": 0
  }
}
```

#### Get Stock Data

```http
GET /api/ba/stock
```

#### Save Stock (without locking)

```http
POST /api/ba/stock/save
Content-Type: application/json

{
  "items": [
    {
      "assid": 1,
      "stock_qty": 50,
      "stock_type": "A"
    },
    {
      "assid": 2,
      "stock_qty": 10,
      "stock_type": "L"
    }
  ]
}
```

#### Post Stock (with locking)

```http
POST /api/ba/stock/post
Content-Type: application/json

{
  "items": [...]
}
```

#### Get Price Data

```http
GET /api/ba/price
```

#### Save Price

```http
POST /api/ba/price/save
Content-Type: application/json

{
  "items": [
    {
      "assid": 1,
      "sale_price": 250.50
    }
  ]
}
```

#### Post Price

```http
POST /api/ba/price/post
```

#### Get Sale Data

```http
GET /api/ba/sale
```

#### Save Sale

```http
POST /api/ba/sale/save
Content-Type: application/json

{
  "items": [
    {
      "assid": 1,
      "sale_qty": 45
    }
  ]
}
```

#### Post Sale

```http
POST /api/ba/sale/post
```

#### Get Attendance History

```http
GET /api/ba/attendance
```

## Project Structure

```
api/
├── src/
│   ├── config/
│   │   └── database.ts          # Database configuration
│   ├── controllers/
│   │   ├── auth.controller.ts   # Authentication logic
│   │   └── ba.controller.ts     # BA operations
│   ├── entities/                # TypeORM entities
│   │   ├── User.ts
│   │   ├── Assignment.ts
│   │   ├── AssignmentSale.ts
│   │   ├── UserAttendance.ts
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT authentication
│   │   └── upload.middleware.ts # File upload
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── ba.routes.ts
│   ├── utils/
│   │   └── distance.util.ts     # Distance calculation
│   └── index.ts                 # Application entry point
├── uploads/                     # Uploaded files
├── .env                         # Environment variables
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Key Features Explained

### Location Validation

The API validates that the BA is within 100 meters of the assigned store location using the Haversine formula. Test accounts (UIDs: 430, 431, 432, 446) bypass this check.

### Posting vs Saving

- **Save**: Allows multiple updates throughout the day
- **Post**: Locks the data by setting status flag to 1, preventing further edits

### Stock Types

- **A** (Adequate): Green - Good stock level
- **L** (Low): Orange - Low stock warning
- **Z** (Zero): Red - Out of stock

### Authentication Flow

1. User logs in with credentials and location
2. System validates location against store coordinates
3. If valid, user must upload selfie
4. After selfie upload, JWT token is issued
5. Token is used for all subsequent API calls

## Error Codes

- `1`: Invalid username or password
- `2`: Not assigned to any store
- `3`: Logged out successfully
- `4`: Location validation failed

## Security

- JWT tokens expire after 18 hours
- Passwords are hashed with MD5 (matching PHP implementation)
- File uploads are restricted to images only
- Maximum file size: 5MB
- CORS enabled (configurable)
- Helmet.js for security headers

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Database Migrations

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Build and start
npm run build
pm2 start dist/index.js --name sentient-api

# Monitor
pm2 monit

# Logs
pm2 logs sentient-api
```

### Using Docker

```bash
# Build image
docker build -t sentient-api .

# Run container
docker run -p 3000:3000 --env-file .env sentient-api
```

## Support

For issues or questions, please contact the development team.

## License

Proprietary - All rights reserved

//source /home/nksaccountancy/nodevenv/dev.nksaccountancy.com/18/bin/activate && cd /home/nksaccountancy/dev.nksaccountancy.com
# sentient-backend-api
