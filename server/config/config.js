



/////////////////nuevo


//=========================================================
//Puerto
//=====================================================

process.env.PORT=process.env.PORT || 3000

//=========================================================
//Vencimiento del token
//=====================================================
//60 se x 60 min x 24 h x 30 dias
process.env.CADUCIDAD_TOKEN=60*60*24*30



//=========================================================
//SEED =semilla de autenticacion
//=====================================================
process.env.SEED=process.env.SEED || 'este-es-el-seed-desarrollo';



//=========================================================
//Entorno
//=====================================================

//si existe esto  es en produccion de heroku
process.env.NODE_ENV=process.env.NODE_ENV || 'dev';


//=========================================================
//Entorno
//=====================================================

let urlDB

if(process.env.NODE_ENV === 'dev')
{
    urlDB='mongodb://localhost:27017/cafe'
}
else{

//la variable guardada en heroku config
    urlDB=process.env.MONGO_URL;

}


process.env.URLDB=urlDB
