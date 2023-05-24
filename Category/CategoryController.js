const express= require('express');
const router = express.Router();
const Category = require('./categories');
const Articles= require('../Article/articles');
const slugify = require('slugify');
const adminAuth = require("../MiddleWares/adminAuth");

router.get("/admin/categories/new",(req,res)=>{

     res.render('admin/categories/new');
});

router.post("/categories/save", async(req,res)=>{
var title = req.body.title;
if (title != undefined) {

    await Category.create({
        title:title,
        slug:slugify(title)
    }).then(()=>{
        res.redirect("/admin/categories");
    })
    
}else{
    res.redirect("/admin/categories/new")
}
})

router.get("/admin/categories",async(req,res)=>{

    await Category.findAll().then(categories =>{
        res.render("admin/categories/index",{categories:categories});
    })
    
});

router.post("/categories/delete",async(req,res)=>{

    var id = req.body.id;

    if (id != undefined) {
        if (!isNaN(id)) {
            
            await Category.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect("/admin/categories");    
            })
        }else{
            res.redirect("/admin/categories");
        }
    } else {
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories/edit/:id",async (req,res)=>{

    var id= req.params.id;

    if (isNaN(id)) {
        res.redirect("/admin/categories");
    }
    await Category.findByPk(id).then(categoria =>{

        if (categoria != undefined) {

             res.render("admin/categories/edit",{categoria:categoria});   

        }else{
            res.redirect("/admin/categories");
        }
    }).catch( error =>{
        res.redirect("/admin/categories");
    })
    
});

router.post("/categories/update",async(req,res)=>{

    var id = req.body.id;
    var title = req.body.title;

    await Category.update({title:title,
    slug: slugify(title)},{

        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/categories");
    })


});


router.get("/categorias/:slug",async(req,res)=>{
    var slug = req.params.slug;
    
    await Category.findOne({
      where:{
        slug:slug
      },
      include:[{model:Articles}]
    }).then(category =>{
    
      if (category != undefined) {
        
        Category.findAll().then(categorias =>{
          res.render("home",{artigos:category.Artigos, categoria:categorias})
        })
      } else {
        res.redirect("/")
      }
    }).catch(error =>{
      res.redirect("/");
    })
    
    });


module.exports = router;