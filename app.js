require('dotenv').config();
const express = require('express');
const connectToDatabase = require('./config/db');
const app = express();
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const UserRoutes = require('./routes/UserRoutes');
const PetRoutes = require('./routes/PetRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/users', UserRoutes);
app.use('/pets', PetRoutes);

// Documentação
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Inicialização do servidor após conectar ao bd
connectToDatabase()
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`Servidor rodando na porta ${process.env.PORT}`));
    });