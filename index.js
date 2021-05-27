const express = require('express');
const app = express();

const path = require('path');

const mongoose = require('mongoose');

const Product = require('./models/product');
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() =>{
    console.log("Mongo Connection open!!");
} )
    .catch(err => {
        console.log("Ohh noo mongo connection error error")
        console.log(err)
    })
    
    
app.set('views', path.join(__dirname , 'views'));
app.set('view engine','ejs');
//middleware
app.use(express.urlencoded({extended: true} ))
app.use(methodOverride('_method'))

const categories = ['fruit','vegetable','dairy','fungi'];

app.get('/products', async(req,res)=>{
    const { category } =req.query;
    if (category) {
        const products = await Product.find({ category })
        res.render('products/index', {products, category})
        
    } else {
        const products = await Product.find({})
        res.render('products/index', {products, category :"All" })
        
        
    }
   //console.log(products);
})

app.get('/products/new', (req,res) =>{
    res.render('products/new', { categories });
})
app.post('/products', async (req, res)=>{
    //console.log(req.body);
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
    //console.log(newProduct);
    //res.send(`making your product`);

})



app.get('/products/:id', async (req,res) =>{
    const { id } = req.params;
    const product = await Product.findById(id)
    console.log(product);
    res.render('products/show',{product});

    

})

app.get('/products/:id/edit', async(req,res) =>{
    const { id } = req.params;
    const product = await Product.findById(id)
    
    res.render('products/edit',{ product , categories });
})

app.put('/products/:id', async(req,res) =>{
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true , new :true})
    res.redirect(`/products/${product._id}`)
    /*console.log(req.body);
    res.send(`PUT!!`)*/


})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})



app.listen(3000, () =>{
    console.log("App is listening 3000");
})
