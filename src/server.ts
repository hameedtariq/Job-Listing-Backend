import http from 'http';
import app from './app';
import dotenv from 'dotenv';
dotenv.config();
import BackgroundService from './services/background.service';

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  BackgroundService.startCronJob();
});
