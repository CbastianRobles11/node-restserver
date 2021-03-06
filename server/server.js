require('./config/config');

const express = require('express')
const app = express()

//para las carpetas
const path =require('path')

//mongo
// Using Node.js `require()`
const mongoose = require('mongoose');



//======================================================================
//hace que las vaiables de una url se guarde en un json

var bodyParser = require('body-parser')// parse application/x-www-form-urlencoded
// ..son midelwares

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// habilitar ;a carpeta public public
app.use(express.static(path.resolve(__dirname,'../public')))
console.log(path.resolve(__dirname,'../public'))



//===================================================================================

////importamos el app como midelware
// app.use( require('./routes/index'));

//configuracion lobal de rutas
app.use(require('./routes/index'))


//la funcon de conexion a mongo
  let conecxion=async ()=>{

    try {
      await mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      console.log("Conectado a la bbd");
      

    } catch (error) {
        console.log("Error de coneccion",error);
    }

  }

  conecxion()
 
app.listen(process.env.PORT,()=>{
    console.log(`escuchando desde el puerto ${process.env.PORT}`);
    
})

