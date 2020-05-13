
const express=require('express');
const fs=require('fs')
const path=require('path')
const app=express();
const {VerificaTokenImg}= require('../middlewares/autenticacion')

app.get('/imagen/:tipo/:img',VerificaTokenImg,(req,res)=>{

    let tipo=req.params.tipo
    let img=req.params.img;

    let pathImg= path.resolve(__dirname,`../../uploads/${tipo}s/${img}` );
    //path de la nueva img
    if(fs.existsSync(pathImg)){
      return res.sendFile(pathImg)
    }
    else{
        let noImagePath=path.resolve(__dirname,'../assets/no-image.png');
        //llee el content tye del archivo y regresa eso 
        res.sendFile(noImagePath)
    }    
});







module.exports=app