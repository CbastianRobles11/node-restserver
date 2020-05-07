const express= require('express');
const app = express()

var CryptoJS = require("crypto-js");
// console.log(CryptoJS.HmacSHA1("Message", "Key"));

const bcrypt = require('bcrypt');

//json token
const jwt=require('jsonwebtoken')

//==============google librerias de google sing in website=====
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
//=========================================================



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

//configuracion de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        //mandamos el token por parametro
        idToken: token,
        //ponerlo el client id
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    //para ver en consola
    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);
  
    return {
        nombre:payload.name,
        email:payload.email,
        img:payload.picture,
        google:true
    }
}
  





//autentcar con goole
//hacemos una funcion asyn por que debemos eperar el token
//ademas el verify es un async 
app.post('/google',async (req,res)=>{
    
    let token=req.body.idtoken

    let googleUser=await verify(token)
    .catch(e=>{
        return res.status(403).json({
            ok:false,
            err:e
        })
    })

    //revisar primero si el correo ya esta en la bd
    Usuario.findOne({email:googleUser.email},(err,usuarioDBB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        //si existe el usuario de bbd
        if(usuarioDBB)
        {
            //si se autentico por google
            if(usuarioDBB.google===false)
            {
                    return res.status(500).json({
                        ok:false,
                        err:{
                            message:"Debe de usar su autenticacion normal"
                        }
                    })
                
            }
            else{
                        //si se a autenticado por google debems renovarle el token
                        
                let token=jwt.sign({
                    usuario:usuarioDBB   
                },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN})
                // expiresIn= seg * min *hor*dias== ejempo se elmininara en 30 dias

                return res.json({
                    ok:true,
                    usuario:usuarioDBB,
                    token
                })

            }

        }
        else{
            //si el usuario no existe en nuestra bbd
            let usuario=new Usuario();
            usuario.nombre=googleUser.nombre;
            usuario.email=googleUser.email;
            usuario.img=googleUser.img;
            usuario.google=true;
            usuario.password=':)';

            usuario.save((err,usuarioDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:true,
                        err
                    });
                }

                         
                let token=jwt.sign({
                    usuario:usuarioDB   
                },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN})
                // expiresIn= seg * min *hor*dias== ejempo se elmininara en 30 dias

                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                });


            });
        }
    })

///revisar para probar
    // res.json({
    // //    para ver que devuelve en la consola localhost
    //     // body:token
    //     usuario:googleUser
    // })
})


module.exports=app