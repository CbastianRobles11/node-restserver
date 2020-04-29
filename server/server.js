require('./config/config');

const express = require('express')
const app = express()

var bodyParser = require('body-parser')// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())




app.get('/usuario', function (req, res) {
  //vamos a trabajar con json
    res.json('get Usuario')
})


//crear nuevos registros
app.post('/usuario', function (req, res) {
    
    let body= req.body;
    if(body.nombre === undefined){

        res.status(400).json({
            ok:false,
            mensaje:"El nombre es necesario"
        })

    }
    else{
        //vamos a trabajar con  json
      res.json({
        persona:body
        })
    }


    
  })

//actualizar datos
app.put('/usuario/:id', function (req, res) {

    let id=req.params.id;

    //vamos a trabajar con json
      res.json({
          id
      });
  });

  //el delete para borrar 

  app.delete('/usuario/:id', function (req, res) {
    //vamos a trabajar con json
      res.json('delete Usuario')
  })



 
app.listen(process.env.PORT,()=>{
    console.log(`escuchando desde el puerto ${process.env.PORT}`);
    
})