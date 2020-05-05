

//=========================================================
//Puerto
//=====================================================

process.env.PORT=process.env.PORT || 3000




//=========================================================
//Entorno
//=====================================================

//si existe esto  es en produccion de heroku
process.env.NODE_ENV=process.env.NODE_ENV || 'dev';


//=========================================================
//Entorno
//=====================================================

let urlDB

// if(process.env.NODE_ENV === 'dev')
// {
//     urlDB='mongodb://localhost:27017/cafe'
// }
// else{

//la variable guardada en heroku config
    urlDB=process.env.MONGO_URL;

// }


process.env.URLDB=urlDB
