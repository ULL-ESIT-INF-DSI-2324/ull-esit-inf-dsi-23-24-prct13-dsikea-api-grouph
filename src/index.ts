import express from 'express';
import './db/mongoose.js';
import { defaultRouter } from './routers/default.js';
import { customerRouter } from './routers/customer_router.js';
import { providerRouter } from './routers/provider_router.js';
import { furnitureRouter } from './routers/furniture_router.js';

export const app = express();
app.disable('x-powered-by');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(customerRouter);
app.use(providerRouter);
app.use(furnitureRouter);
app.use(defaultRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
