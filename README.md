# NestJS + Encore Qompa

## 1. Tecnologías utilizadas
- Nest
- Encore
- Postgress

## 2.Obtener Url de la BD
```bash
encore db conn-uri appDB --shadow
```

## 3. Agregar en .env
```bash
DATABASE_URL=
OPENAI_API_KEY=
```

## 4. Endpoints (Curl)
```bash
curl --location 'http://localhost:4000/vouchers?page=1&limit=10&status=PENDING&documentType=BOLETA&from=2025-06-01&to=2025-06-30'
```

```bash
curl --location 'http://localhost:4000/vouchers' \
--header 'Content-Type: application/json' \
--data '{
  "companyUuid": "44b40809-451e-489e-afb5-36e35cc63e87",
  "amount": 130.00,
  "documentType": "FACTURA",
  "supplierRuc": "20123456789"
}'
```

```bash
curl --location --request PATCH 'http://localhost:4000/vouchers/ae73438a-c9eb-4702-9416-5b5e735b6fc4/validate' \
--data ''
```

```bash
curl --location 'http://localhost:4000/vouchers/export'
```

```bash
curl --location 'http://localhost:4000/vouchers/ai' \
--header 'Content-Type: application/json' \
--data '{
  "prompt": "Cuál fue el total de comprobantes pendientes en junio"
}'
```