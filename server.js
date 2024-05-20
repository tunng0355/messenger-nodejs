import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import online from './app/middleware/online';
import chat from './app/middleware/chat';
import http from 'http';
import { Server } from "socket.io";
import path from 'path'; // Import path module to resolve file paths

import routes from './routes/web';

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Use path.join() to resolve file paths
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', routes);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Use path.join() to resolve file paths


mongoose.connect(MONGODB_URI).then(result => {
    server.listen(PORT, () => {
        console.clear(); 
        console.info(`Server is running on port ${PORT}.`);
    });
}).catch(err => console.log(err));

online(io);
chat(io);