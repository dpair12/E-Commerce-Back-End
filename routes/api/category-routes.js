const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
    include: Product
    });

    if (!categoryData) {
    res.status(404).json({message: 'There are no categories available. Please add some and try again.'});
    return;
    }
    res.json(categoryData);
  } catch (err) {
  res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Find one category by its `id` value and include its associated Products
    const categoryData = await Category.findByPk(req.params.id, {
      include: Product // Include the associated Products
    });
    const id = req.params.id;
    if (!categoryData) {
      res.status(404).json({ message: `Category ID #${id} does not exist.` });
      return;
    }

    res.json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new category
  Category.create(req.body)
  .then((category) => {
  const categoryName = category.category_name;
  res.status(200).json({message: `Succesfully created ${categoryName} category!`})
  })
  .catch((err) => {
  console.log(err);
  res.status(400).json(err);
  });

});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
try {
const updateCategory = await Category.update(
{category_name: req.body.category_name },
{
where: {
id: req.params.id
}
}
);

const id = req.params.id;
const newCategoryname = req.body.category_name;

if (!updateCategory) {
  res.status(404).json({ message: `Unable to update to ${newCategoryname} because Category ID #${id} does not exist.` });
  return;
}

res.status(200).json({message: `Succesfully updated Category ID #${id} name to ${newCategoryname}!`});
} catch (err) {
  console.log(err);
}
  
});

router.delete('/:id', (req, res) => {
  // Find the category to be deleted by its `id` value
  Category.findOne({
    where: {
      id: req.params.id,
    }
  })
  .then((categoryToDelete) => {
    // Store the name of the category before deleting it
    const categoryName = categoryToDelete.category_name;

    // Delete the category
    Category.destroy({
      where: {
        id: req.params.id,
      }
    })
    .then(() => {
      const deleteMessage = `Successfully deleted ${categoryName} category from database.`;
      res.json(deleteMessage);
    })
    .catch((err) => res.json(err));
  })
  .catch((err) => res.json(err));
});

module.exports = router;
