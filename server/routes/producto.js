const express=require('express')
const app=express();

const { verificaToken} =require('../middlewares/autenticacion')

let Producto= require('../models/producto')

//=======================
//obtener todos los productos
//==========================
app.get('/productos',verificaToken,(req,res)=>{
    //trae todos los productods
    //populate/ usuario categoria
    //paginado


    let desde = req.query.desde || 0
    desde= Number(desde);

    Producto.find({disponible:true})
    .skip(desde)
    .limit(5)
    .populate('usuario','nombre email ')
    .populate('categoria', 'descripcion')
    .exec((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                error:"Error bbdver prod "+err
            })
        }
        if(!productoDB){
            return res.status(500).json({
                ok:false,
                error:"No existen productos "+err
            })
        }
        res.status(201).json({
            ok:true,
            producto:productoDB
        })

    })
     

})



//=======================
//obtener  productos x id
//==========================
app.get('/productos/:id',(req,res)=>{
    
    //populate/ usuario categoria

    let id= req.params.id;

    Producto.findById(id)
            .populate('usuario','nombre email')
            .populate('categoria','descripcion ') 
    .exec((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                error:"Error bbdver prod "+err
            })
        }
        if(!productoDB){
            return res.status(500).json({
                ok:false,
                error:"No existen el producto "+err
            })
        }
        res.status(201).json({
            ok:true,
            producto:productoDB
        })
    })


})


//==========================================
//          BUSCAR PRODUCTOS
//=========================================
app.get('/productos/buscar/:termino',verificaToken,(req,res)=>{

    let termino=req.params.termino;
//sea insencible a las mayus minus
    let regex=new RegExp(termino,'i');


    Producto.find({nombre:regex})
    .populate('categoria','nombre')
    .exec((err,productos)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            productos
        })
    })

})




//=======================
//Crear  los productos
//==========================
app.post('/productos',verificaToken,(req,res)=>{
    //grabar usuario categoria ddel listado

    let body=req.body;

    let producto=new Producto({
        usuario:req.usuario._id,
        nombre:body.nombre ,
        precioUni:body.precioUni ,
        disponible:body.disponible ,
        categoria:body.categoria 
    });


    producto.save((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                error:"Error bbd guardar "+err
            })
        }
        if(!productoDB){
            return res.status(500).json({
                ok:false,
                error:"Error bbd guardar "+err
            })
        }
        res.status(201).json({
            ok:true,
            producto:productoDB
        })
    });
})


//=======================
//actualizar todos los productos
//==========================
app.put('/productos/:id',verificaToken,(req,res)=>{
    
    let id=req.params.id;
    let body= req.body;

    Producto.findById(id,{new:true },(err,productoDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                error:"Error bbd guardar "+err
            })
        }
        if(!productoDB){
            return res.status(500).json({
                ok:false,
                error:"Error el producto no existe "+err
            })
        }

        productoDB.nombre=body.nombre;
        productoDB.precioUni=body.precioUni;
        productoDB.categoria=body.categoria;
        productoDB.disponible=body.disponible;
        productoDB.descripcion=body.descripcion;
        
        productoDB.save((err,productoGuardado)=>{

            if(err){
                res.status(400).json({
                    ok:true,
                    err:"error al actualizar "+err
                })
    
            }
            res.status(201).json({
                ok:true,
                producto:productoGuardado
            })

        })

    });

})


//=======================
//Borrar un productos
//==========================
app.delete('/productos/:id',(req,res)=>{
    

    let id= req.params.id;

    Producto.findById(id,(err,productoDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                error:"Error al borrar "+err
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                error:"No existen el producto "+err
            })
        }
        
        productoDB.disponible=false
        productoDB.save((err,productoBorrado)=>{

            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                })  
            }

            res.status(201).json({
                ok:true,
                message:"Se elimino el producto",
                producto:productoBorrado
            })
        })
        



    })
})




module.exports=app