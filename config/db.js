const mongoose = require('mongoose');

async function connectToDatabase(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado ao MongoDB!");
    } 
    catch (err) {
        console.error("Falha ao conectar ao MongoDB:", err.message);
        process.exit(1);
    }
}

module.exports = connectToDatabase;