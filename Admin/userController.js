const express = require('express');
const router = express.Router();
const Admin = require('./user');
const bscrypt = require('bcryptjs');
const category = require("../Category/categories");
const articles = require('../Article/articles');
//const adminAuth = require("../MiddleWares/adminAuth");


router.get("/admin/user",(req,res)=>{

    Admin.findAll({
        order:[
            ['id','DESC']
        ]
    }).then(user =>{
        res.render("Admin/control/admin/userList/userList",{user});
    })

});
router.get("/admin/userBack",(req,res)=>{

    Admin.findAll({
        where:{
            perfil:"Barrar"
        },
        order:[
            ['id','DESC']
        ]
    }).then(user =>{
        res.render("Admin/control/admin/userList/userBack",{user});
    })

});

router.get("/admin/change/:id",async(req,res)=>{

    var {id}=req.params;

   await Admin.findOne({
        where:{
            id
        }
    }).then(user =>{
        Admin.findAll().then(perfil=>{
            res.render("Admin/control/admin/userList/register",{user,perfil});
        })
        
    })

});

router.get("/admin/backList/:id",async(req,res)=>{

    var {id}=req.params;

   await Admin.findOne({
        where:{
            id
        }
    }).then(user =>{
        
        res.render("Admin/control/admin/userList/backList",{user});
        
    })

});

router.post('/admin/change/update',async(req,res)=>{

    var {name,perfil}= req.body;
    Admin.update({
        perfil
    },{
        where:{
            name:name
        }
    }).then(()=>{
        res.redirect('/admin/user');
    }).catch(()=>{
        res.redirect('/admin/user');
    })
});

router.post('/admin/change/blacklist',async(req,res)=>{

    var {name,perfil}= req.body;
    Admin.update({
        perfil
    },{
        where:{
            name:name
        }
    }).then(()=>{
        res.redirect('/admin/user');
    }).catch(()=>{
        res.redirect('/admin/user');
    })
});


router.get("/admin/user/create",(req, res)=>{

    res.render("admin/User/registrar")
});

router.post("/user/create",(req,res)=>{

    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body. confirmPassword;
    var perfil = req.body.perfil

    var salt = bscrypt.genSaltSync(12)
    var hash = bscrypt.hashSync(password,salt);

     Admin.findOne({where:{email:email}}).then(admin=>{

        if (admin == undefined) {

        if (perfil== undefined) {
            
            perfil = "Leitor"
        }


        if (password != confirmPassword) {
            
            res.redirect("/admin/user/create")
        }else{

            Admin.create({
                name:name,
                email:email,
                password :hash,
                perfil:perfil,
            }).then(()=>{
                res.redirect("/login");
            }).catch(errr=>{
                res.redirect("/login")
                console.log(errr);
            })

        }
            
                   }else{
           res.redirect("/admin/user/create"); 
        }

     
    })
    

});

router.post("/admin/delete",async(req,res)=>{

    var id = req.body.id;
   await Admin.destroy({
    where:{
        id:id
    }
   }).then(()=>{
    res.render("admin/users/index");
   }).catch(error=>{
    res.redirect("/admin/user")
   })

});

router.get('/login',async(req,res)=>{

    var loginError = req.flash('loginError');
    var email = req.flash('email');
    var password = req.flash('password');
    loginError = (loginError == undefined || loginError.length == 0)? undefined:loginError;
    email = (email == undefined || email.length == 0)? undefined:email;
    password = (password == undefined || password.length == 0)? undefined:password;

    res.render("Admin/user/login",{loginError,email, password});
});


router.get('/Escritor/cPanel', async(req,res)=>{

  await  category.findAll().then((category)=>{

    
        res.render("Admin/control/escritor/cpanel",{categoria:category})
     
    });

    
});

router.get('/Editor/cPanel',(req,res)=>{

    res.redirect('/admin/articles');
});

router.get('/Admin/cPanel',(req,res)=>{

    res.render('Admin/control/admin/cpanel');
});

router.get('/home',(req,res)=>{

    category.findAll().then((category)=>{
        articles.findAll().then((articles)=>{
        res.render("home",{categoria:category,artigos:articles})
    });
    })

    
});

router.post("/authenticate",async(req,res)=>{
    var email = req.body.email;
    var password = req.body.password;
    var loginError;
   
    
 await   Admin.findOne({
        where:{email:email}
    }).then(user =>{
        if (user != undefined) {// se existir email
            //validar senha
            var correct =bscrypt.compareSync(password,user.password);
            if (correct) {
         Admin.findOne({where:{email:email}}).then((user)=>{


                    if (user.perfil === "Leitor") {
                        res.redirect("/home");
                    }else if(user.perfil === "Escritor"){
                        res.redirect("/Escritor/cPanel")
                    }else if(user.perfil === "Editor"){
                        res.redirect("/Editor/cPanel");
                    }else if(user.perfil === "Admin"){
                        res.redirect("/Admin/cPanel");
                    }else if(user.perfil === "Barrar"){

                        loginError ="Seu acesso foi negado!"
                        req.flash('loginError', loginError);
                        req.flash('email',email);
                        req.flash('password',password);
                        res.redirect('/login');
                    }else{
                        res.send("not found")
                    }
                });
                
            }else{
                res.redirect('/login');
            }

        } else {
            res.redirect('/login');
        }
    })

})
router.get('/logout',(req,res)=>{
req.session.user = undefined;
res.redirect("/")
});



module.exports = router;