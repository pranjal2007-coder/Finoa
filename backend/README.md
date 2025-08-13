# Finova Backend

Environment variables:

- `OPENAI_API_KEY`
- `DATABASE_URL` (e.g. postgres://postgres:postgres@localhost:5432/finova)
- `PORT` (default 4000)

Scripts:

- `npm run dev` – start with nodemon
- `npm start` – start server

Endpoints:

- `POST /ask` { userId?, question }
- `GET /transactions?userId=&from=&to=`
- `POST /transactions` { userId, date, category, description?, amount }
- `GET /summary?userId=&from=&to=`