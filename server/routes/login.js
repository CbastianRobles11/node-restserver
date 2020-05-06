const express= require('express');
const app = express()

var CryptoJS = require("crypto-js");
// console.log(CryptoJS.HmacSHA1("Message", "Key"));

const bcrypt = require('bcrypt');

//json token
const jwt=require('jsonwebtoken')

const Usuario = require('../models/usuario')


app.post('/login',(req,res)=>{


    // res.json({
    //     ok:true,
    //     conectado:"Esta conectado"
    // })

    let body=req.body;

    Usuario.findOne({email:body.email},(error,usuarioDB)=>
    {

        if(error){
            return res.status(500).json({
                ok:false,
                error:"error email "+error
            })
        }

        if(!usuarioDB)
        {
            return res.status(400).json({
                ok:false,
                error:{
                        message:"(Usuario) o password incorrectos "
                    }
                })

        }
        //evaluar contrasena
        //lo que quereos evaluar del body o manda con lo de la bbd
        if(!bcrypt.compareSync(body.password,usuarioDB.password) )
        {
            return res.status(400).json({
                ok:false,
                error:{
                        message:"Usuario o (password) incorrectos "
                    }
                })
        }


        let token=jwt.sign({
            usuario:usuarioDB   
        },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN})
        // expiresIn= seg * min *hor*dias== ejempo se elmininara en 30 dias

        res.json({
            ok:true,
            usuario:usuarioDB,
            token
        })
    })
})   

module.exports=app