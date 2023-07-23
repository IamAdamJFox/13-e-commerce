const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    //Finds all categories, includes associated products
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
  });
  // error 500 if it is not found
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{
    //Finds category with matching id, includes it associated products
    const CategoryData = await Category.findByPk(req.params.id,{
      include: [{ model: Product }],
    });
     // error 500 if it is not found
    if (!CategoryData) {
      res.status(404).json({ message: "No category found with id" });
      return;
    }
    res.status(200).json(CategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try{
    //uses request body data to create new category
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
    //error if creation fails
  } catch (err){
    res.status(400).json(err);
  }
});


router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
    //updates category with matching id based on data in request body
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    //error 404 if category is not found
    res.status(200).json(categoryData);
  } catch (err){
    res.status(404).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{
    //deletes category with matching id
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    //if category is not found error 404
    if(!categoryData){
      res.status(404).json({message: "There was no product found with this id"});
      return;
    }
    res.status(200).json(categoryData);
  } catch (err){
    //if any other error, error 500
    res.status(500).json(err);
  }
});

module.exports = router;
