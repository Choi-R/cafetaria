const { success, error, serverError } = require('../helpers/response')
const { emptyBody, decimal2, theManager } = require('../helpers/validation')
const { sequelize, Menu, Cafe } = require('../models')

// Create a new menu
exports.createMenu = async (req, res) => {
  const { name, price, isRecommendation, cafeId } = req.body;
  let createBody = { name, isRecommendation, cafeId }
  try {
    const emptyMessage = emptyBody({ name, cafeId })
    if (emptyMessage) { return error(res, emptyMessage, 400) }

    const isManagerMsg = theManager(req.user, cafe.managerId)
    if (isManagerMsg) { return error(res, isManagerMsg, 401) }
    
    if (price) { 
      if (decimal2(price.toString())) { createBody.price = price  }
      else { return error(res, "Price must be a float with max 2 decimal", 400) }
    }
    const newMenu = await Menu.create(createBody);
    return success(res, newMenu, 201)
    
  } 
  catch (err) { 
    if (err && err.parent && err.parent.constraint == "Menus_cafeId_fkey") { return error(res, "Cafe not found", 404) }
    else { return serverError(res, err) } 
  }
};

// Get all menus
exports.getAllMenus = async (req, res) => {
  const { cafeId } = req.query;
  try {
    const menus = await Menu.findAll({ include: [{ model: Cafe, as: 'cafe' }] });
    return success(res, menus, 200)
  } 
  catch (err) { return serverError(res, err) }
};

// Get a single menu by ID
exports.getMenuById = async (req, res) => {
  try {
    const { menuId } = req.params;
    const menu = await Menu.findByPk(menuId);
    if (!menu) {
      return error(res, 'Menu not found', 404)
    }
    return success(res, menu, 200)
  } 
  catch (err) { return serverError(res, err) }
};

// Update a menu by ID
exports.updateMenu = async (req, res) => {
  const { menuId } = req.params;
  const { name, price, isRecommendation, cafeId } = req.body;
  try {
    let menu = await Menu.findByPk(menuId, {
      include: [{
          model: Cafe,
          as: 'cafe',
        }],
    });
    if (!menu) {
      return error(res, 'Menu not found', 404)
    }
    const isManagerMsg = theManager(req.user, menu.cafe.managerId)
    if (isManagerMsg) { return error(res, isManagerMsg, 401) }

    if (name) { menu.name = name }
    if (price) { 
      if (decimal2(price.toString())) { menu.price = price  }
      else { return error(res, "Price must be a float with max 2 decimal", 400) }
    }
    if (isRecommendation) { menu.isRecommendation = isRecommendation }
    if (cafeId) { menu.cafeId = cafeId }
    await menu.save();

    return success(res, menu, 200)
  } 
  catch (err) { return serverError(res, err) }
};

// Delete a menu by ID
exports.deleteMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const menu = await Menu.findByPk(menuId);
    if (!menu) {
      return error(res, 'Menu not found', 404)
    }
    const isManagerMsg = theManager(req.user, menu.cafe.managerId)
    if (isManagerMsg) { return error(res, isManagerMsg, 401) }

    await menu.destroy();
    return success(res, "success", 200)
  } 
  catch (err) { return serverError(res, err) }
};