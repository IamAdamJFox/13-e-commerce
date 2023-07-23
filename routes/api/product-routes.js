const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
    try{
      const productData = await Product.findAll();
      res.status(200).json(productData);
    }catch(err){
      res.status(500).json(err);
    }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try{
    const productData = await Product.findByPk(req.params.id,{
      include: [Tag,Category]
    });
    if(!productData){
      res.status(404).json({message: "There is no product found with this id"});
      return;
    }
    res.status(200).json(productData);
  } catch (err){
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */  Product.create(req.body)
  .then((product) => {
    if (req.body.tagIds.length) {
      const productTagIds = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      return ProductTag.bulkCreate(productTagIds);
    }
    res.status(200).json(product);
  })
  .then((productTagIds) => res.status(200).json(productTagIds))
  .catch((err) => {
    res.status(400).json({ message: "Creation failed", error: err });
  });
});

router.put("/:id", async (req, res) => {
      try {
        await Product.update(req.body, { where: { id: req.params.id } });
    
        if (req.body.tags && req.body.tags.length > 0) {
    
          const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
    
          const newProductTags = req.body.tags
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });
    
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tags.includes(tag_id))
            .map(({ id }) => id);
    
          await Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        }
    
        const product = await Product.findByPk(req.params.id, { include: [{ model: Tag }] });
        return res.json(product);
      } catch (error) {
        console.log(error);
        return res.status(500).json(error);
      }
    });
    


router.delete('/:id', async (req, res) => {

  try {
    const product = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!product) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }
    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
