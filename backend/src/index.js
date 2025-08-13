import dotenv from 'dotenv';
import { migrate } from './lib/db.js';
import app from './app.js';

dotenv.config();

const port = process.env.PORT || 4000;

migrate()
  .then(() => {
    app.listen(port, () => {
      console.log(`Finova backend running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Migration failed. Exiting.', err);
    process.exit(1);
  });