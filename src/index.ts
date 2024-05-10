import express from 'express';
import './db/mongoose.js';
import { customerRouter } from './routers/customer_router.js';
import { providerRouter } from './routers/provider_router.js';
import { furnitureRouter } from './routers/furniture_router.js';
import { transactionRouter } from './routers/transaction_router.js';
import { defaultRouter } from './routers/default.js';

// Ejecutar la app con:

// sudo /home/usuario/mongodb/bin/mongod --dbpath /home/usuario/mongodb-data/
// node dist/index.js

export const app = express();
app.disable('x-powered-by');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(customerRouter);
app.use(providerRouter);
app.use(furnitureRouter);
app.use(transactionRouter);
app.use(defaultRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
