import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import jobRouter from './routes/job.route';
import errorMiddleware from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/jobs', jobRouter);

app.use(errorMiddleware);

export default app;
