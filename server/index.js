const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const cors = require('cors')

//Import Routes
const authRoute = require('./routes/auth');
const spotifyRoute = require('./routes/spotify');
const cmcRoute = require('./routes/cmc');
const wheatherRoute = require('./routes/weather');
const aboutRoute = require('./routes/about');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => console.log('Connected to DB !'));
//Middleware
app.use(cors({credentials:true, origin:"http://localhost:3000"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//Routes Middlewares
app.use('/api/user', authRoute);
app.use('/api/spotify', spotifyRoute);
app.use('/api/cmc', cmcRoute);
app.use('/api/weather', wheatherRoute);
app.use('/', aboutRoute);
app.listen(8080, () => console.log('Server Up and running'));