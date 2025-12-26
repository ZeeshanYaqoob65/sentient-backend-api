# Sentient BA API Documentation

**Base URL:** `https://api.sentientapp.pk`  
**Version:** 1.0.0

---

## Table of Contents

1. [Authentication](#authentication)
2. [Stock Management](#stock-management)
3. [Price Management](#price-management)
4. [Sale Management](#sale-management)
5. [Usership Management](#usership-management)
6. [Competition Sales](#competition-sales)
7. [Deals Management](#deals-management)
8. [Samples Management](#samples-management)
9. [Dashboard](#dashboard)
10. [Attendance](#attendance)

---

## Authentication

### Login

**POST** `/api/auth/login`

Authenticates a user and creates necessary records (attendance, assignment_sale, usership, usership_detail).

**Request Body:**

```json
{
  "userName": "nimra_ba2417",
  "password": "sentient_ba",
  "app_id": "optional_device_id"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "userId": "1568",
    "userName": "Nimra",
    "userEmail": "nimrar23@gmail.com",
    "userPhone": "",
    "userType": "BA",
    "userCNIC": "2417",
    "assignedStoreName": "PCC - PWD - Rawalpindi",
    "storeLatitude": 31.439647,
    "storeLongitude": 74.340775,
    "profilePicture": "image.jpg"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Creates on Login:**

- `user_attendance` record
- `assignment_sale` records (one per product)
- `usership` record
- `usership_detail` records (one per competitor brand)

---

## Stock Management

### Get Stock Quantities

**GET** `/api/ba/stock`

Returns all stock quantities that need to be updated for today.

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "pending",
    "productStatus": ["A", "L", "Z"],
    "products": [
      {
        "assid": 2180794,
        "company": "Molfix",
        "product_name": "Good Care - Open Diaper Natural - Mega - Size 2",
        "variant": "",
        "size": "Mega",
        "qty": 0,
        "status": "A"
      }
    ]
  },
  "isPosted": false
}
```

**Status Values:**

- `A` - Available (Green)
- `L` - Low Stock (Orange)
- `Z` - Zero/Out of Stock (Red)

---

### Save Stock Quantities

**POST** `/api/ba/stock/save`

Saves stock quantities without locking (can be edited later).

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "products": [
    {
      "assid": 2180794,
      "qty": 10,
      "status": "A"
    },
    {
      "assid": 2180795,
      "qty": 5,
      "status": "L"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Stock data saved successfully"
}
```

---

### Post Stock Quantities

**POST** `/api/ba/stock/post`

Saves and locks stock quantities (cannot be edited after posting).

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "products": [
    {
      "assid": 2180794,
      "qty": 10,
      "status": "A"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Stock data posted successfully"
}
```

**Note:** This also updates `user_attendance.stock_status = 1`

---

## Price Management

### Get Prices

**GET** `/api/ba/price`

Returns all product prices for today.

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "pending",
    "products": [
      {
        "assid": 2180794,
        "company": "Molfix",
        "product_name": "Good Care - Open Diaper Natural - Mega - Size 2",
        "variant": "",
        "size": "Mega",
        "price": 500
      }
    ]
  },
  "isPosted": false
}
```

---

### Save Prices

**POST** `/api/ba/price/save`

Saves prices without locking.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "products": [
    {
      "assid": 2180794,
      "price": 500
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Price data saved successfully"
}
```

---

### Post Prices

**POST** `/api/ba/price/post`

Saves and locks prices.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "products": [
    {
      "assid": 2180794,
      "price": 500
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Price data posted successfully"
}
```

**Note:** Updates `user_attendance.price_status = 1`

---

## Sale Management

### Get Sales

**GET** `/api/ba/sale`

Returns all sales quantities for today.

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "pending",
    "products": [
      {
        "assid": 2180794,
        "company": "Molfix",
        "product_name": "Good Care - Open Diaper Natural - Mega - Size 2",
        "variant": "",
        "size": "Mega",
        "soldItem": 0
      }
    ]
  },
  "isPosted": false
}
```

---

### Save Sales

**POST** `/api/ba/sale/save`

Saves sales quantities without locking.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "products": [
    {
      "assid": 2180794,
      "soldItem": 5
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Sale data saved successfully"
}
```

---

### Post Sales

**POST** `/api/ba/sale/post`

Saves and locks sales quantities.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "products": [
    {
      "assid": 2180794,
      "soldItem": 5
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Sale data posted successfully"
}
```

**Note:** Updates `user_attendance.sale_status = 1`

---

## Usership Management

### Get Usership

**GET** `/api/ba/usership`

Returns usership data (interception and productive customers) for competitor brands.

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "brand": "Molfix",
    "postDate": "23-12-2025",
    "products": [
      {
        "asudid": 845789,
        "productId": "14",
        "productName": "Shield Diapers",
        "interceptedCustomer": 0,
        "productiveCustomer": 0
      }
    ]
  },
  "isPosted": false,
  "usershipStatus": 0
}
```

---

### Save Usership

**POST** `/api/ba/usership/save`

Saves usership data without locking.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "products": [
    {
      "asudid": 845789,
      "interceptedCustomer": 10,
      "productiveCustomer": 5
    }
  ]
}
```

**Validation:**

- `productiveCustomer` cannot be greater than `interceptedCustomer`

**Response:**

```json
{
  "success": true,
  "message": "Usership data saved successfully"
}
```

---

### Post Usership

**POST** `/api/ba/usership/post`

Saves and locks usership data.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "products": [
    {
      "asudid": 845789,
      "interceptedCustomer": 10,
      "productiveCustomer": 5
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Usership data posted successfully"
}
```

**Note:** Updates:

- `usership.asustatus = 1`
- `user_attendance.usership_status = 1`

---

## Competition Sales

### Get Competition Sales

**GET** `/api/ba/competition-sales`

Returns competition sales data for competitor brands.

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "brand": "Molfix",
    "postDate": "23-12-2025",
    "competitors": [
      {
        "asudid": 845789,
        "competitorId": "14",
        "competitorName": "Shield Diapers",
        "salesValue": 0
      }
    ]
  },
  "isPosted": false
}
```

---

### Save Competition Sales

**POST** `/api/ba/competition-sales/save`

Saves competition sales without locking.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "competitors": [
    {
      "asudid": 845789,
      "salesValue": 100
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Competition sales saved successfully"
}
```

---

### Post Competition Sales

**POST** `/api/ba/competition-sales/post`

Saves and locks competition sales.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "competitors": [
    {
      "asudid": 845789,
      "salesValue": 100
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Competition sales posted successfully"
}
```

**Note:** Updates `user_attendance.comsale_status = 1`

---

## Deals Management

### Get Deals

**GET** `/api/ba/deals`

Returns deals data for today.

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "pending",
    "title": "",
    "data": ""
  },
  "isPosted": false
}
```

---

### Save Deals

**POST** `/api/ba/deals/save`

Saves deals data without locking.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Special Offer",
  "data": "Buy 2 Get 1 Free"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Deals data saved successfully"
}
```

---

### Post Deals

**POST** `/api/ba/deals/post`

Saves and locks deals data.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Special Offer",
  "data": "Buy 2 Get 1 Free"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Deals data posted successfully"
}
```

**Note:** Updates `user_attendance.deals_sold_status = 1`

---

## Samples Management

### Get Samples

**GET** `/api/ba/samples`

Returns samples data for today.

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "pending",
    "title": "",
    "data": ""
  },
  "isPosted": false
}
```

---

### Save Samples

**POST** `/api/ba/samples/save`

Saves samples data without locking.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Sample Distribution",
  "data": "Distributed 10 samples"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Samples data saved successfully"
}
```

---

### Post Samples

**POST** `/api/ba/samples/post`

Saves and locks samples data.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Sample Distribution",
  "data": "Distributed 10 samples"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Samples data posted successfully"
}
```

**Note:** Updates `user_attendance.samples_status = 1`

---

## Dashboard

### Get Dashboard

**GET** `/api/ba/dashboard`

Returns dashboard data with performance metrics and today's status.

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "profile": {
    "name": "Nimra",
    "brand": "Molfix",
    "store": "PCC - PWD - Rawalpindi",
    "city": "Rawalpindi"
  },
  "performance": {
    "targetPerDay": 100,
    "monthlyTarget": 2600,
    "targetTillDate": 2000,
    "totalSale": 1500,
    "dailyAchievement": 75,
    "monthlyAchievement": 58,
    "perDayAvg": 75,
    "remainingTarget": 1100,
    "workingDays": 20,
    "avgUsership": 50
  },
  "todayStatus": {
    "stockStatus": 0,
    "priceStatus": 0,
    "saleStatus": 0,
    "usershipStatus": 0,
    "comsaleStatus": 0,
    "dealsSoldStatus": 0,
    "samplesStatus": 0
  }
}
```

---

## Attendance

### Get Attendance History

**GET** `/api/ba/attendance`

Returns attendance history with pagination.

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)

**Example:**

```
GET /api/ba/attendance?page=1&pageSize=10
```

**Response:**

```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "90502",
        "date": "23-12-2025",
        "timeIn": "2025-12-23T08:00:00.000Z",
        "timeOut": null,
        "qtyStatus": "pending",
        "priceStatus": "pending",
        "salesStatus": "pending",
        "usershipStatus": "pending",
        "competitionStatus": "pending",
        "samplesStatus": "pending",
        "dealsStatus": "pending"
      }
    ],
    "total": 50
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "success": false,
  "message": "Products array is required"
}
```

### 401 Unauthorized

```json
{
  "error": "No token provided"
}
```

or

```json
{
  "error": "Invalid token"
}
```

### 403 Forbidden

```json
{
  "error": "Access denied. BA only."
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "No usership record found for today"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Authentication

All BA endpoints (except `/api/auth/login`) require authentication via JWT token.

**Header Format:**

```
Authorization: Bearer {token}
```

The token is obtained from the login endpoint and is valid for 7 days.

---

## Status Codes Reference

### Stock Status

- `0` = Pending (not posted)
- `1` = Posted (locked)

### Stock Type

- `A` = Available (Green)
- `L` = Low Stock (Orange)
- `Z` = Zero/Out of Stock (Red)

### Attendance Status Fields

- `stock_status`: Stock quantity posted status
- `price_status`: Price posted status
- `sale_status`: Sale posted status
- `usership_status`: Usership posted status
- `comsale_status`: Competition sales posted status
- `deals_sold_status`: Deals posted status
- `samples_status`: Samples posted status

---

## Notes

1. **Date Format:** All dates use `dd-mm-yyyy` format (e.g., `23-12-2025`)

2. **Record Creation:** Login automatically creates:

   - `user_attendance` record
   - `assignment_sale` records (one per product in assignment)
   - `usership` record
   - `usership_detail` records (one per competitor brand)

3. **Save vs Post:**

   - **Save:** Updates data but allows further edits
   - **Post:** Updates data and locks it (sets status = 1)

4. **Validation:**

   - Usership: `productiveCustomer` ≤ `interceptedCustomer`
   - All arrays must not be empty

5. **Pagination:**
   - Default page size: 10
   - Page numbers start at 1

---

## Example Usage

### Complete Workflow

```bash
# 1. Login
curl -X POST https://api.sentientapp.pk/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName": "nimra_ba2417", "password": "sentient_ba"}'

# 2. Get Stock
curl -X GET https://api.sentientapp.pk/api/ba/stock \
  -H "Authorization: Bearer {token}"

# 3. Save Stock
curl -X POST https://api.sentientapp.pk/api/ba/stock/save \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"products": [{"assid": 2180794, "qty": 10, "status": "A"}]}'

# 4. Post Stock
curl -X POST https://api.sentientapp.pk/api/ba/stock/post \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"products": [{"assid": 2180794, "qty": 10, "status": "A"}]}'
```

---

**Last Updated:** December 22, 2025  
**API Version:** 1.0.0

