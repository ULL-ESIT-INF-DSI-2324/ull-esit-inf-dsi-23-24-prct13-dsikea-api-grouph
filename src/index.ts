import express from 'express';
import './db/mongoose.js';
import { defaultRouter } from './routers/default.js';
import { customerRouter } from './routers/customer_router.js';

export const app = express();
app.disable('x-powered-by');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(customerRouter);
app.use(defaultRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
