const express = require('express');
const router = express.Router();
const multer = require('multer');
const slugify  = require('slugify');
const categories = require("../Category/categories");
const articles = require('./articles'); 
const adminAuth = require('../MiddleWares/adminAuth');


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

router.get("/admin/articles",(req,res)=>{

    articles.findAll({
        include:[{model:categories}]
    }).then(articles=>{
        res.render("admin/articles/index",{articles:articles});
    });    
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



router.post("/articles/delete",adminAuth, async(req,res)=>{

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

router.post("/articles/update",adminAuth,(req,res)=>{

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
    

})


router.get("/articles/page/:num",async(req,res)=>{

    var page = req.params.num;
    var offset = 0;

    if (isNaN(page)|| page ==1) {
        offset = 0
    } else {
        offset = (parseInt(page)-1)*3;
    }
await articles.findAndCountAll({
    order:[
      
        ['id','DESC']
      ],
    limit:3,
    offset:offset
}).then(artigos =>{

    var next ;
    if (offset + 4 >= artigos.count) {
        next = false;
    } else {
        next = true
    }

    var result ={
        page:parseInt(page),
        next:next,
        artigos:artigos
    }
    categories.findAll({
        include:[{model:articles}]
    }).then(categorias =>{
        
        res.render("nextPage",{result:result,artigos:result.artigos.rows, categorias:categorias,user:req.session.user})
    })
    
})

});



router.get('/:slug',async(req,res)=>{
    const slug = req.params.slug;

    await articles.findOne({
        where:{
            slug:slug
        }
    }).then(article=>{
        if(article != undefined){
            res.render('read',{artigo:article});
        }else{
            res.send('erro');

        }
        
    }).catch((error)=>{
        res.send(error);
    });
})




module.exports = router;