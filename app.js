require('dotenv').config();
const express = require('express');
const connectToDatabase = require('./config/db');
const app = express();
const UserRoutes = require('./routes/UserRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/users', UserRoutes);

// Inicialização do servidor após conectar ao bd
connectToDatabase()
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`Servidor rodando na porta ${process.env.PORT}`));
    });