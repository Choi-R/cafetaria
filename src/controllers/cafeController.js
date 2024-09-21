const { Op } = require('sequelize');
const { success, error, serverError } = require('../helpers/response')
const { Cafe, Menu } = require('../models')

// Create a new cafe
exports.createCafe = async (req, res) => {
  const { name, address, phoneNumber, managerId } = req.body;
  try {
    const newCafe = await Cafe.create({ name, address, phoneNumber, managerId });
    return success(res, newCafe, 201)
  } 
  catch (err) { return serverError(res, err) }
};

// Get all cafes
exports.getAllCafes = async (req, res) => {
  const { name, sort, order = 'ASC', limit = 10, page = 1 } = req.query;
  try {
    const filter = name? { name: { [Op.iLike]: `%${name}%` } } : {}
    const totalCafes = await Cafe.count({ where: filter });
    const maxPages = Math.ceil(totalCafes / limit);
    const actualPage = page > maxPages? maxPages : page
    const orderBy = sort ? [[sort, order.toUpperCase()]] : [['name', 'ASC']];
    const cafes = await Cafe.findAll({
      where: filter,
      order: orderBy,
      offset: parseInt((actualPage - 1) * limit, 10)
    });
    return success(res, { total: totalCafes, page, maxPages, cafes }, 200)
  } 
  catch (err) { return serverError(res, err) }
};

// Get a single cafe by ID
exports.getCafeById = async (req, res) => {
  try {
    const { cafeId } = req.params;
    const cafe = await Cafe.findByPk(id, { include: [{ model: Menu, as: 'menus' }] });
    if (!cafe) { return error(res, "Cafe not found", 404)}

    return success(res, cafe, 200)
  } 
  catch (err) { return serverError(res, err) }
};

// Update a cafe by ID
exports.updateCafe = async (req, res) => {
  const { cafeId } = req.params;
  const { role, id } = req.user
  const { name, address, phoneNumber, managerId } = req.body;
  try {
    const cafe = await Cafe.findByPk(cafeId);
    if (!cafe) { return error(res, "Cafe not found", 404) }

    if (name) { cafe.name = name }
    if (address) { cafe.address = address }
    if (phoneNumber) { cafe.phoneNumber = phoneNumber }
    if (managerId) { cafe.managerId = managerId }
    await cafe.save();

    return success(res, cafe, 200)
  } 
  catch (err) { return serverError(res, err) }
};

// Delete a cafe by ID
exports.deleteCafe = async (req, res) => {
  const { cafeId } = req.params;
  try {
    const cafe = await Cafe.findByPk(cafeId);
    if (!cafe) { return error(res, "Cafe not found", 404) }

    await cafe.destroy();
    return success(res, "success", 200)
  } 
  catch (err) { return serverError(res, err) }
};
