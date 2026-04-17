# Profile Intelligence Service

A RESTful API service that enriches profile data using external APIs (Genderize, Agify, Nationalize) and stores it in PostgreSQL.

## Features

- ✅ Multi-API integration (Genderize, Agify, Nationalize)
- ✅ Data persistence with PostgreSQL
- ✅ Idempotency handling (duplicate name prevention)
- ✅ RESTful endpoints with proper HTTP status codes
- ✅ Filtering capabilities (gender, country_id, age_group)
- ✅ UUID v7 for unique identifiers
- ✅ UTC ISO 8601 timestamps
- ✅ CORS enabled for all origins

## Tech Stack

- NestJS 10
- PostgreSQL
- TypeORM
- UUID v7
- Axios

## API Endpoints

### POST /api/profiles
Create a new profile or retrieve existing one

**Request:**
```json
{
  "name": "ella"
}