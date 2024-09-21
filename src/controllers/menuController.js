const { success, error, serverError } = require('../helpers/response')
const { emptyBody } = require('../helpers/validation')
const { sequelize } = require('../models')

const decimal2 = (price) => {
  const regex = /^\d+(\.\d{1,2})?$/; // Matches a number with up to 2 decimal places
  return regex.test(price);
};

// Create a new menu
exports.createMenu = async (req, res) => {
  try {
    const { name, price, isRecommendation, cafeId } = req.body;
    if (decimal2(price.toString())) {
      const newMenu = await Menu.create({ name, price, isRecommendation, cafeId });
      return success(res, newMenu, 201)
    }
    else {return error(res, "Price must be a float with max 2 decimal") }
  } 
  catch (err) { return serverError(res, err) }
};

// Get all menus
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.findAll({ include: [{ model: Cafe, as: 'cafe' }] });
    res.status(200).json(menus);
  } 
  catch (err) { return serverError(res, err) }
};

// Get a single menu by ID
exports.getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.status(200).json(menu);
  } 
  catch (err) { return serverError(res, err) }
};

// Update a menu by ID
exports.updateMenu = async (req, res) => {
  const { id } = req.params;
  const { name, price, isRecommendation, cafeId } = req.body;
  try {
    const menu = await Menu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    if (role == 'manager' && cafe.managerId != id) { return error(res, "You are not the manager of this cafe", 401) }
    menu.name = name;
    menu.price = price;
    menu.isRecommendation = isRecommendation;
    menu.cafeId = cafeId;
    await menu.save();
    res.status(200).json(menu);
  } 
  catch (err) { return serverError(res, err) }
};

// Delete a menu by ID
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    await menu.destroy();
    res.status(204).json();
  } 
  catch (err) { return serverError(res, err) }
};