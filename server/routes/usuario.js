const express = require('express')
 const app = express()

const Usuario = require('../models/usuario')

//verifica el token
const {verificaToken,verificaAdmin_Role }=require('../middlewares/autenticacion')

const bcrypt = require('bcrypt');

// crypto-js encipta password
var CryptoJS = require("crypto-js");
// console.log(CryptoJS.HmacSHA1("Message", "Key"));

//underscore=para los campos que no quiren ser modificados
const _=require('underscore')





app.get('/usuario', verificaToken ,function (req, res) {
    // //vamos a trabajar con json
    //   res.json('get Usuario')

    // ==============filtraciones==============================
    //a des lo recibe como string
    let desde = req.query.desde || 0
    //convertitn a numero
    desde=Number(desde)

    // lo missmo para limite
    let limite=req.query.limite ||5
    limite=Number(limite)

//=============================================================

    //executa todos
    // find( todo los campos ejemplo google:true, strinng solo los campos que quieor devolver)
    //estado:true ==solo traera usuarios activos
    Usuario.find({estado:true},'nombre email role estado google img')
    //skip=salte los primeros n  registros         
            .skip(desde)
    //limit=poner limite de cuantos regustros se muestr        
            .limit(limite)
            .exec((err,usuarios)=>{
                if(err)
                {
                    return res.status(400).json({
                        ok:false,
                        error:`Algo salio mal al obtenr datos ${err}` 
                    })
                }

                // numero de registros
                Usuario.count({estado:true},(err,conteo)=>{   
                    res.json({
                        ok:true,
                        usuarios,
                        cuantos:conteo
                    });
                })

            })


  })
  
  
  //crear nuevos registros
  app.post('/usuario',[verificaToken,verificaAdmin_Role], function (req, res) {
  
    ///aki se usa el body
    // el req.body va a parecer cada vez que hagaos una peticion 
  
      let body= req.body;
  // ==================================================================
      // postman
      // {{url}}/usuario
      // body- x-www.orm-undecoded
      // dentro estara estos oparametros
      
  // KEY
  // VALUE            // DESCRIPTION
  // nombre            // apellido      // correo
  // Sebastian         // Robles       // aksjh@gmail.com
  // donde nombre appellido crreo son el body
  // ===================================================================
      
    let usuario=new Usuario({
        nombre:body.nombre,
        email:body.email,
        password:bcrypt.hashSync(body.password,10),
        role:body.role,
        img:body.img
    });

    //gurdar en la bbd
    usuario.save( (err,usuarioDB)=>{
        if(err){
           return res.status(400).json({
                ok:false,
                error:"Ocurrio un error",err
            })
        }


        //PARA QUE NO SE VEA EL CAMPPO password en unsuarioy salga null
        //orta manera esta en el modelo usuario
         usuarioDB.password="";
        
        res.json({
            ok:true,
            usuario:usuarioDB
        });
        console.log(res);
        
    })
  
    })


  
  //actualizar datos
  app.put('/usuario/:id',[verificaToken,verificaAdmin_Role], function (req, res) {
  //agregamos el id de la ruta
      let id=req.params.id;

///=======================================================
      // pick_.pick(object, *keys)
// Return a copy of the object, filtered to only have values for the whitelisted keys (or array of valid keys). Alternatively accepts a predicate indicating which keys to pick.
//ponems .pick( objeto , los elementos que se pueden actualizar)
        let body=_.pick(req.body, ['nombre','email','img','role','estado']) ;
    

//==============================================================================

//una manera para que no se puedan mpodificar siertos campos seria
        // delete body.password;
        // delete body.google;


    //     //pueden ser 4 argumentos (id, el objeto a cambiar , opc: si queremo que se muestr el nuevo actualizado , callback)
    //    new:se mestre el usuario nuevo,
    //    ruValidators: para que las validaciones que pusimos en models tambien se acaten aki
        Usuario.findByIdAndUpdate(id,body,{new :true, runValidators:true},(err,usuarioDB)=>{
                if (err)
                {
                    return res.status(400).json({
                        ok:false,
                        err: " Ocurrio un error "+err
                    })
                }
                //vamos a trabajar con json
                res.json({
                    ok:true,
                    usuario:usuarioDB
                });    

        })

    });
  
    //el delete para borrar registo
  
app.delete('/usuario/:id', [verificaToken,verificaAdmin_Role], function (req, res) {
      //vamos a trabajar con json
      // res.json('delete Usuario')

    ///////BORRAR FISICAMENTE EL REGISTO====================================

//obtener id
        let id = req.params.id;

// //eliminadcion fisicamente 
//         Usuario.findByIdAndRemove(id,(err, usuarioBorrado)=>{

//                 if (err)
//                 {
//                     return res.status(400).json({
//                         ok:false,
//                         err: " Ocurrio un error "+err
//                     })
//                 };

//                 if(usuarioBorrado===null)
//                 {
//                     return res.status(400).json({
//                         ok:false,
//                         err: {
//                             mesage:"Usuario no existe "
//                         }
//                     })

//                 };

//                 res.json({
//                     ok:true,
//                     usuario:usuarioBorrado
//                 })

//         })

////////////////////////////////////========================================

////////////ELIMINACION POR CAMBIO DE ESTADO

    let cambioEstado={
            estado:false
        }

         Usuario.findByIdAndUpdate(id,cambioEstado,{new: true},(err, usuarioBorrado)=>{
           
                if (err)
                {
                    return res.status(400).json({
                        ok:false,
                        err: " Ocurrio un error "+err
                    })
                }

                if(usuarioBorrado===null)
                {
                    return res.status(400).json({
                        ok:false,
                        err: {
                            mesage:"Usuario no existe "
                        }
                    })

                };

                res.json({
                    ok:true,
                    usuario:usuarioBorrado
                })


         })
////////////////==================================

    })
  

    module.exports=app;