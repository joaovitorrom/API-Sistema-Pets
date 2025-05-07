const moongose = require('moongose');

async function connectToDatabase(){
    try{
        await moongose.connect(process.env.MONGO_URI);
        console.log("Conectado ao MongoDB!");
    } 
    catch (err) {
        console.error("Falha ao conectar ao MongoDB:", err.message);
        process.exit(1);
    }
}

module.exports = connectToDatabase;