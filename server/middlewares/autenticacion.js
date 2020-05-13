const jwt=require('jsonwebtoken');

///==============================================
//Verigficar token
//=============================================

//next continuara con la ejecucuon del programa
let verificaToken=(req,res,next)=>{
    //leer los headers del postman con get
    
    let token=req.get('token');

    jwt.verify(token, process.env.SEED ,(err,decoded)=>{
        if(err){
            
            res.status(401).json({
                ok:false,
                err:{
                    message:'Token no valido'
                }
            })
        }

        // decoded usuario = dento del obheto que encripte se que viene usuario , seria el payload
        req.usuario=decoded.usuario;
        //para que continue el programa
        
        
        next();
    })
    //solo pra probar
    // res.json({
    //     token
    // });

};

//==================================
//Verifica Admin Rol
//=================================

let verificaAdmin_Role=(req,res,next)=>{
    //recupero el req.usuario de la anterior funcion
    let usuario=req.usuario

    if(usuario.role=='ADMIN_ROLE'){
        next();
    }
    else
    {
       return  res.json({
            ok:false,
            err:{
                message:'El usuaro no es administrador'
            }
        })
    }

}

module.exports={
    verificaToken,
    verificaAdmin_Role

}