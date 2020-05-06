// npm i mongoose
const mongoose= require('mongoose');
//mongoes- unique validatos  archivo externo 
const uniqueValidator=require('mongoose-unique-validator');

let rolesValidos={
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol valido',
    name:'Error de validacion'
};


let Schema= mongoose.Schema;
//definir el schema
let usuarioSchema=new Schema({
    nombre:{
        type:String,
        required:[true, 'El nombre es necesario' ],
    },
    email:{
        type:String,
        required:[true,'El correo es necesario'],
        unique:true
    }
    ,
    password:{
        type:String,
        required:[true,"La contrasena es obligatoria"]

    },
    img:{
        type:String
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum:rolesValidos
    },
    estado:{
        type :Boolean,
        default:true
    },
    google:{
        type: Boolean,
        default:false
    }
});

//para que no se muestre la password
// usuarioSchema.method.toJSON = function()
// {
//     let user= this;
//     let userObject=user.toObject();
//     delete userObject.password

//     return userObject

// }

//aki se validaran los errores
usuarioSchema.plugin(uniqueValidator,{
    message:'{PATH} debe de ser unico'
})

//exportar el modelo
//no se lama usuario esquema ('nombre', la variable donde se confi)
module.exports=mongoose.model('Usuario',usuarioSchema)
