# API Quick Reference Guide

**Base URL:** `https://api.sentientapp.pk`

---

## 🔐 Authentication

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| POST   | `/api/auth/login` | Login and get token |

---

## 📦 Stock Management

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| GET    | `/api/ba/stock`      | Get stock quantities  |
| POST   | `/api/ba/stock/save` | Save stock (editable) |
| POST   | `/api/ba/stock/post` | Post stock (locked)   |

**Request Body:**

```json
{
  "products": [{ "assid": 123, "qty": 10, "status": "A" }]
}
```

---

## 💰 Price Management

| Method | Endpoint             | Description |
| ------ | -------------------- | ----------- |
| GET    | `/api/ba/price`      | Get prices  |
| POST   | `/api/ba/price/save` | Save prices |
| POST   | `/api/ba/price/post` | Post prices |

**Request Body:**

```json
{
  "products": [{ "assid": 123, "price": 500 }]
}
```

---

## 🛒 Sale Management

| Method | Endpoint            | Description |
| ------ | ------------------- | ----------- |
| GET    | `/api/ba/sale`      | Get sales   |
| POST   | `/api/ba/sale/save` | Save sales  |
| POST   | `/api/ba/sale/post` | Post sales  |

**Request Body:**

```json
{
  "products": [{ "assid": 123, "soldItem": 5 }]
}
```

---

## 👥 Usership Management

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| GET    | `/api/ba/usership`      | Get usership data |
| POST   | `/api/ba/usership/save` | Save usership     |
| POST   | `/api/ba/usership/post` | Post usership     |

**Request Body:**

```json
{
  "products": [
    {
      "asudid": 123,
      "interceptedCustomer": 10,
      "productiveCustomer": 5
    }
  ]
}
```

**Validation:** `productiveCustomer ≤ interceptedCustomer`

---

## 🏆 Competition Sales

| Method | Endpoint                         | Description            |
| ------ | -------------------------------- | ---------------------- |
| GET    | `/api/ba/competition-sales`      | Get competition sales  |
| POST   | `/api/ba/competition-sales/save` | Save competition sales |
| POST   | `/api/ba/competition-sales/post` | Post competition sales |

**Request Body:**

```json
{
  "competitors": [{ "asudid": 123, "salesValue": 100 }]
}
```

---

## 🎁 Deals Management

| Method | Endpoint             | Description |
| ------ | -------------------- | ----------- |
| GET    | `/api/ba/deals`      | Get deals   |
| POST   | `/api/ba/deals/save` | Save deals  |
| POST   | `/api/ba/deals/post` | Post deals  |

**Request Body:**

```json
{
  "title": "Special Offer",
  "data": "Buy 2 Get 1 Free"
}
```

---

## 🧪 Samples Management

| Method | Endpoint               | Description  |
| ------ | ---------------------- | ------------ |
| GET    | `/api/ba/samples`      | Get samples  |
| POST   | `/api/ba/samples/save` | Save samples |
| POST   | `/api/ba/samples/post` | Post samples |

**Request Body:**

```json
{
  "title": "Sample Distribution",
  "data": "Distributed 10 samples"
}
```

---

## 📊 Dashboard & Reports

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| GET    | `/api/ba/dashboard`         | Get dashboard data     |
| GET    | `/api/ba/attendance`        | Get attendance history |
| GET    | `/api/ba/sales-performance` | Get sales performance  |

---

## 🔑 Authentication Header

All BA endpoints require:

```
Authorization: Bearer {token}
```

---

## 📝 Status Values

### Stock Type

- `A` = Available (Green)
- `L` = Low Stock (Orange)
- `Z` = Zero/Out of Stock (Red)

### Posted Status

- `0` = Pending (not posted)
- `1` = Posted (locked)

---

## ⚠️ Common Errors

| Status | Error                   | Solution                       |
| ------ | ----------------------- | ------------------------------ |
| 401    | No token provided       | Include Authorization header   |
| 401    | Invalid token           | Login again to get new token   |
| 403    | Access denied           | User must be BA (utype = 4)    |
| 400    | Products array required | Include products array in body |
| 404    | No record found         | Records created on login       |

---

## 🚀 Quick Test

```bash
# Login
TOKEN=$(curl -s -X POST https://api.sentientapp.pk/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName": "nimra_ba2417", "password": "sentient_ba"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Get Stock
curl -X GET https://api.sentientapp.pk/api/ba/stock \
  -H "Authorization: Bearer $TOKEN"
```

---

**See `API_DOCUMENTATION.md` for detailed documentation.**

