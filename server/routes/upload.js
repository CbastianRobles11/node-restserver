const express= require('express');
const fileUpload= require('express-fileupload');
const app= express();
const fs=require('fs')
const path=require('path')
const Usuario= require('../models/usuario');
const Producto= require('../models/producto')

//default onpitins
app.use(fileUpload())

app.put('/upload/:tipo/:id',function(req,res){

    let tipo=req.params.tipo
    let id= req.params.id

    if(!req.files){
        return res.status(400).json({
            ok:false,
            err:{
                message:"No se ha seleccionado ningun archivo" 
            }
        });
    }

    //validar tipo 
    let tiposValidos=['producto','usuario']
    if(tiposValidos.indexOf(tipo)<0){
        res.status(400).json({
            ok:false,
            message:" los tos validos son "+tiposValidos.join(', ')
        })
    }


    //el archivo
    let archivo= req.files.archivo;
    let nombreCortado=archivo.name.split('.');
    //console.log(nombreCortado);//[ 'adidas_1988', 'jpg' ]
    let extension=nombreCortado[nombreCortado.length-1]
    // console.log(extension); //jpg

    //extensiones permitidas
    let extencioneVAlidas=['png','jpg','gif','jpeg']
    if(extencioneVAlidas.indexOf(extension)<0){
        return res.status(400).json({
            ok:false,
            error:{
                mensagge:" no se permite el formato "+extension,
                validacones :" solo se permiten "+extencioneVAlidas.join(', ')
            }
        })
    }
    else{
        //cambiar el nombre del archivo
        let nombreArchivo=`${id}-${new Date().getMilliseconds() }.${extension}`


        //mueve el archio a una carpeta
        archivo.mv(`uploads/${tipo}s/${nombreArchivo}`, function(err) {
            if (err)
              return res.status(500).json({
                  ok:false,
                  error:"error de mover archivo "+err
              });

              //aki img cargada

              if(tipo=='usuario')
              imgUsuario(id,res,nombreArchivo);
              else
              imgProducto(id,res,nombreArchivo)
        
            // res.json({
            //     ok:true,
            //     message:"Archivo Guardado"
            // });
          });
    }
    
    
})


function imgUsuario(id,res,nombreArchivo){

    Usuario.findById(id,(error,usuarioDB)=>{
        if(error){
//por que aunque suceda un erro la imagen si se sube
   //seria el nombre del archivo que acao de subir       
            borraArchvo(nombreArchivo,'usuario')

            return res.status(500).json({
                ok:false,
                error: "funcion usu "+error
            });
        }

        //verifica que exita el usuario
        if(!usuarioDB){

            //si el us no existe necesito eliminar la img que se sub
            borraArchvo(nombreArchivo,'usuario')

            return res.status(400).json({
                ok:false,
                error: "usuario no existe "+error
            })
        }

        ///borra el archivo si  existe
        borraArchvo(usuarioDB.img,'usuario')

       usuarioDB.img= nombreArchivo;

        usuarioDB.save((err,usuarioGuardado)=>{
            if(err){

                return res.status(400).json({
                    ok:false,
                    error: " No guardo "+err
                })
            }
            
            res.json({
                ok:true,
                usuario:usuarioGuardado,
                img:nombreArchivo
            })
        })        

    })

}

function imgProducto(id,res ,nombreArchivo){

    Producto.findById(id,(error,productoDB)=>{
        if(error){
//por que aunque suceda un erro la imagen si se sube
   //seria el nombre del archivo que acao de subir       
            borraArchvo(nombreArchivo,'producto')

            return res.status(500).json({
                ok:false,
                error: "funcion usu "+error
            });
        }

        //verifica que exita el usuario
        if(!productoDB){

            //si el us no existe necesito eliminar la img que se sub
            borraArchvo(nombreArchivo,'producto')

            return res.status(400).json({
                ok:false,
                error: "usuario no existe "+error
            })
        }

        ///borra el archivo si  existe
        borraArchvo(productoDB.img,'producto')

       productoDB.img= nombreArchivo;

        productoDB.save((err,productoGuardado)=>{
            if(err){

                return res.status(400).json({
                    ok:false,
                    error: " No guardo "+err
                })
            }
            
            res.json({
                ok:true,
                producto:productoGuardado,
                img:nombreArchivo
            })
        })        

    })

}

function borraArchvo(nombreImagen,tipo){
    // =============evitar la duplicacion de img============
        //que el path de la img eiste con el filesistem
        //verifica ruta archivo
        let parthImagen=path.resolve(__dirname,`../../uploads/${tipo}s/${nombreImagen}` );

            //verifica si existe //true false
        if(fs.existsSync(parthImagen)){
            //si existe se borra con fs
            fs.unlinkSync(parthImagen)
        }
// =========================================================
 
}

module.exports=app