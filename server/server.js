require('./config/config');

const express = require('express')
const app = express()

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

//===================================================================================

////importamos el app como midelware
// app.use( require('./routes/usuario'));

app.use(require('./routes/usuario'))


//la funcon de conexion a mongo
  let conecxion=async ()=>{

    try {
      await mongoose.connect('mongodb://localhost:27017/cafe', {
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

