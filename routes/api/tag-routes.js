const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
    include: Product
    });

    if (!tagData) {
    res.status(404).json({message: 'There are no tags available. Please add some and try again.'});
    return;
    }
    res.json(tagData);
  } catch (err) {
  res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    // Find one category by its `id` value and include its associated Products
    const tagData = await Tag.findByPk(req.params.id, {
      include: Product // Include the associated Products
    });

    const id = req.params.id;

    if (!tagData) {
      res.status(404).json({ message: `Tag ID #${id} does not exist.` });
      return;
    }

    res.json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
// create a new tag
Tag.create(req.body)
.then((tag) => {
const tagName = tag.tag_name;
res.status(200).json({message: `Succesfully created ${tagName} tag!`})
})
.catch((err) => {
console.log(err);
res.status(400).json(err);
});
  
});

router.put('/:id', async (req, res) => {
 // update a tag's by its `id` value
 try {
  const updateTag = await Tag.update(
  {tag_name: req.body.tag_name },
  {
  where: {
  id: req.params.id
  }
  }
  );
  
  const id = req.params.id;
  const newTagname = req.body.tag_name;
  
  if (!updateTag) {
    res.status(404).json({ message: `Unable to update to ${newTagname} because Tag ID #${id} does not exist.` });
    return;
  }
  
  res.status(200).json({message: `Succesfully updated Tag ID #${id} name to ${newTagname}!`});
  } catch (err) {
    console.log(err);
  }

});

router.delete('/:id', (req, res) => {
// Find the category to be deleted by its `id` value
Tag.findOne({
  where: {
    id: req.params.id,
  }
})
.then((tagtobedeleted) => {
  // Store the name of the category before deleting it
  const tagName = tagtobedeleted.tag_name;

  // Delete the category
  Tag.destroy({
    where: {
      id: req.params.id,
    }
  })
  .then(() => {
    const deleteMessage = `Successfully deleted ${tagName} tag from the database.`;
    res.json(deleteMessage);
  })
  .catch((err) => res.json(err));
})
.catch((err) => res.json(err));
});

module.exports = router;
