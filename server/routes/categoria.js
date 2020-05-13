const express= require('express');
const app=express();

let { verificaToken , verificaAdmin_Role }= require('../middlewares/autenticacion')

let Categoria= require('../models/categoria')

//mostrar todas las cateorias
app.get('/categoria',verificaToken,(req,res)=>{

    Categoria.find({})
            .sort('descripcion')
            .populate('usuario','nombre email')
            .exec((err,categoriaDB)=>{
                if(err){
                    return  res.status(500).json({
                          ok:false,
                          error:"Error al ver "+err
                      })
                  }
                  if(!categoriaDB){
                      return  res.status(400).json({
                            ok:false,
                            error:"Error al ver "+err
                        })
                    }
          
                   res.json({
                      ok:true,
                      categoria:categoriaDB
                  })
            })
})

//mostrar una cat por id
app.get('/categoria/:id',verificaToken,(req,res)=>{

        let id=req.params.id
        Categoria.findById(id,(err,categoriaDB)=>{
            if(err){
                return  res.status(500).json({
                      ok:false,
                      error:"Error al ver "+err
                  })
              }
              if(!categoriaDB){
                  return  res.status(400).json({
                        ok:false,
                        error:"El id no es valido "+err
                    })
                }
      
               res.json({
                  ok:true,
                  categoria:categoriaDB
              })


        })

});

//crea categoria
app.post('/categoria',verificaToken,(req,res)=>{
    //regresa la nueva categoria
    let body= req.body;

    let categoria=new Categoria({
        descripcion:body.descripcion,
        usuario:req.usuario._id
    });

    categoria.save((err,categoriaDB)=>{
        if(err){
          return  res.status(500).json({
                ok:false,
                error:"Error al crear "+err
            })
        }
        if(!categoriaDB){
            return  res.status(400).json({
                  ok:false,
                  error:"Error al crear "+err
              })
          }

         res.json({
            ok:true,
            categoria:categoriaDB
        })
    })

})

app.put('/categoria/:id',(req,res)=>{
    //solo nomb de cat
    let id = req.params.id;

    let body=req.body;

    let desCategoria={
        descripcion:body.descripcion
    }

    Categoria.findByIdAndUpdate(id,desCategoria,{new:true , runValidators:true},(err,categoriaDB)=>{
        if(err){
            return  res.status(500).json({
                  ok:false,
                  error:"Error al crear "+err
              })
          }
          if(!categoriaDB){
              return  res.status(400).json({
                    ok:false,
                    error:"Error al crear "+err
                })
            }
  
           res.json({
              ok:true,
              categoria:categoriaDB
          })  

    })

})

app.delete('/categoria/:id',[verificaToken,verificaAdmin_Role],(req,res)=>{
    //solo admin puede borrar categoria

    let id=req.params.id;

    Categoria.findByIdAndRemove(id,(err,categoriaDB)=>{
        if(err){
            return  res.status(500).json({
                  ok:false,
                  error:"Error al crear "+err
              })
          }
          if(!categoriaDB){
              return  res.status(400).json({
                    ok:false,
                    error:"El id no existe "+err
                })
            }
  
           res.json({
              ok:true,
              message:"categoria borrada con exito",
              categoria:categoriaDB
          })  
    })

})


module.exports=app