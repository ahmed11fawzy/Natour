const mongoose=require('mongoose');


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please tell us your name'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'Please provide your email'],
        unique:true,
        lowercase:true,
        trim:true,
        validate:[
            {
                validator:function(el){
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(el);
            },
            message:'Please provide a valid email'
            },
            
        ]
    },
    photo:String,
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            // This only works on CREATE and SAVE!!!
            validator:function(el){
                return el===this.password;
            },
            message:'Passwords are not the same!'
        }
    },
    photo:String,
    
});


const User=mongoose.model('User',userSchema);
module.exports=User;