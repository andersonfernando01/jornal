const express = require('express');
const router = express.Router();
const articles = require('../Article/articles');
const categories = require('../Category/categories');
const multer = require('multer');
const slugify  = require('slugify');


const storage = multer.diskStorage({
    destination:function(req,file, cb) {
        cb(null, "./public/uploads/capa");
    },
    filename:function(req,file,cb) {

        var temp_file_arr = file.originalname.split(".");
        var temp_file_name = temp_file_arr[0];
        var temp_file_extension = temp_file_arr[1];
        var caminho =temp_file_name+""+Date.now()+"."+temp_file_extension
      cb(null,caminho);
    }
})
const upload = multer({storage})

router.get("/admin/articles/cpanel",(req,res)=>{

    articles.findAll({
        include:[{model:categories}]
    }).then(articles=>{
        res.render("Admin/control/admin/articles/index",{articles:articles});
    });    
});

router.get("/admin/articles/new",async (req,res)=>{

    await categories.findAll().then(categories =>{
         res.render('Admin/control/admin/articles/new',{categories:categories});
    })
    
});

router.post("/articles/save",upload.single("capa"),(req,res)=>{

    var title = req.body.title;
    var capa = req.file.filename;
    var category = req.body.category;
    var body = req.body.body;

    articles.create({
        title:title,
        slug:slugify(title),
        capa:capa,
        body:body,
        categoriaId:category
    }).then(()=>{

        res.redirect("/Escritor/cPanel");
    })


});

router.post("/articles/delete", async(req,res)=>{

    var id = req.body.id;

    if (id != undefined) {
        if (!isNaN(id)) {
            
            await articles.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect("/admin/articles");    
            })
        }else{
            res.redirect("/admin/articles");
        }
    } else {
        res.redirect("/admin/articles");
    }
});
router.get("/admin/articles/edit/:id",async(req,res)=>{

    var id= req.params.id;

    if (isNaN(id)) {
        res.redirect("/admin/articles");
    }
    await articles.findByPk(id).then(artigo =>{

        if (artigo != undefined) {

            categories.findAll().then(categories =>{
                res.render("admin/articles/edit",{artigo:artigo,categories,categories});  
            })
              

        }else{
            res.redirect("/admin/articles");
        }
    }).catch( error =>{
        res.redirect("/admin/articles");
    })
});
router.post("/articles/update",(req,res)=>{

    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    articles.update({
        title:title,
        slug:slugify(title),
        categoriaId : category,
        body:body,
    },{
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/articles")
    }).catch(err =>{
        res.redirect("/admin/articles")
    })
    

});
module.exports= router;

