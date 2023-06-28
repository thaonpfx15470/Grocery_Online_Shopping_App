const ProductService = require('../services/product-service');
const CustomerService = require('../services/customer-service');
const UserAuth = require('./middlewares/auth')

module.exports = (app) => {
    
    const service = new ProductService();
    const customerService = new CustomerService();


    app.post('/product/create', async(req,res,next) => {
        
        try {
            let { name, desc, type, unit,price, available, suplier, banner } = req.body; 
            if (available = 'on') {
                available = true;
            } else {
                available = false;
            }
            // validation
            const { data } =  await service.CreateProduct({ name, desc, type, unit,price, available, suplier, banner });
            // return res.json(data);
            return res.redirect(`/${data._id}`);
            
        } catch (err) {
            next(err)    
        }
        
    });

    app.get('/category/:type', async(req,res,next) => {
        
        const type = req.params.type;
        
        try {
            const { data } = await service.GetProductsByCategory(type)
            // return res.status(200).json(data);
            // console.log(data);
            return res
                .status(200)
                .render("productsType", { products: data });

        } catch (err) {
            next(err)
        }

    });

    app.get('/:id', async(req,res,next) => {
        
        const productId = req.params.id;

        try {
            const { data } = await service.GetProductDescription(productId);
            // return res.status(200).json(data);
            // console.log(data)
            return res
              .status(200)
              .render("productDetail", { data });


        } catch (err) {
            next(err)
        }

    });

    app.post('/ids', async(req,res,next) => {

        try {
            const { ids } = req.body;
            const products = await service.GetSelectedProducts(ids);
            return res.status(200).json(products);
            
        } catch (err) {
            next(err)
        }
       
    });
     
    app.post('/wishlist',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        
        try {
            const product = await service.GetProductById(req.body._id);
            const wishList = await customerService.AddToWishlist(_id, product)
            // return res.status(200).json(wishList);
            return res.redirect("/")
        } catch (err) {
            
        }
    });
    
    app.delete('/wishlist/:id',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        const productId = req.params.id;

        try {
            const product = await service.GetProductById(productId);
            const wishlist = await customerService.AddToWishlist(_id, product)
            return res.status(200).json(wishlist);
        } catch (err) {
            next(err)
        }
    });


    app.post('/cart',UserAuth, async (req,res,next) => {
        
        const { _id, qty } = req.body;
        
        try {     
            const product = await service.GetProductById(_id);
    
            const result =  await customerService.ManageCart(req.user._id, product, qty, false);
            // console.log(result)
            // return res.status(200).json(result);
            return res.redirect("/");
            
        } catch (err) {
            next(err)
        }
    });
    
    app.delete('/cart/:id',UserAuth, async (req,res,next) => {

        const { _id } = req.user;

        try {
            const product = await service.GetProductById(req.params.id);
            const result = await customerService.ManageCart(_id, product, 0 , true);             
            return res.status(200).json(result);
        } catch (err) {
            next(err)
        }
    });

    //get Top products and category
    app.get('/', async (req,res,next) => {
        //check validation
        try {
            const { data} = await service.GetProducts();      
            // return res.status(200).json(data);
            return res.status(200).render("products", {products: data.products})
        } catch (error) {
            next(err)
        }
        
    });
    
}