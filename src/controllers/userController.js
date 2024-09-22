const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize');
const { success, error, serverError } = require('../helpers/response')
const { emptyBody } = require('../helpers/validation')
const { sequelize, User } = require('../models')

const registrationProcess = async (reqBody, reqUser) => {
  const { username, fullname, password, role } = reqBody
  try {
    const hashed = await bcrypt.hash(password, 10)
    userBody = {
      username,
      fullname,
      password: hashed
    }
    if (reqUser && reqUser.role) {
      if (reqUser.role == 'owner') { userBody.role = 'manager' }
      else if (reqUser.role == 'superadmin') { userBody.role = role }
    } 
    const newUser = await User.create(userBody)
    return newUser
  }
  catch(err) { throw err }
}

// Registration
exports.register = async (req, res) => {
  const { username, fullname, password, role } = req.body
  try {
    // Check body empty
    const emptyMessage = emptyBody({ username, password })
    if (emptyMessage) { return error(res, emptyMessage, 400) }

    // Check user exist
    const user = await User.findOne({
      where: { username }
    })
    if (user) { return error(res, `Username already exist`, 400) }

    // Registration process
    const newUser = registrationProcess(req.body, req.user)
    const token = jwt.sign({ id: newUser.id, username, role: newUser.role }, process.env.SECRET_KEY, { expiresIn: '24h' })
    return success(res, token, 201)
  }
  catch (err) { return serverError(res, err) }
}

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body
  try {
    // Check input
    const emptyMessage = emptyBody({ username, password })
    if (emptyMessage) { return error(res, emptyMessage, 400) }

    const [users] = await sequelize.query(`SELECT id, role, password from "Users" WHERE username = :username`, {
      replacements: { username }
    })
    if (!users[0]) { return error(res, `Account doesn't exist`, 400) }

    const isValid = await bcrypt.compare(password, users[0].password)
    if (!isValid) { return error(res, `Incorrect username or password`, 400) }

    // Login
    const token = jwt.sign({ id: users[0].id, username, role: users[0].role }, process.env.SECRET_KEY, { expiresIn: '24h' })
    return success(res, token, 200)
  }
  catch (err) { return serverError(res, err) }
}

// Get profile
exports.getMe = async (req, res) => {
  const { id } = req.user
  try {
    const user = await User.findOne({
      attributes: ['username', 'fullname', 'role', 'createdAt'],
      where: { id }
    });
    return success(res, user, 200)
  }
  catch (err) { return serverError(res, err) }
};

// Edit profile
exports.editMe = async (req, res) => {
  const { id } = req.user
  const { username, fullname, password } = req.body
  try {
    const user = await User.findByPk(id);
    if (username && username.length > 0) { user.username = username }
    if (fullname && fullname.length > 0) { user.fullname = fullname }
    if (password && password.length > 0) { user.password = await bcrypt.hash(password, 10) }

    await user.save()
    return success(res, "Information updated", 200)
  }
  catch (err) { return serverError(res, err) }
}

// Delete my account
exports.deleteMe = async (req, res) => {
  const { id, role } = req.user
  try {
    if (role == 'superadmin') { return error(res,"Super Admin cannot be deleted", 400) }
    await User.destroy({
      where: { id }
    });;
    return success(res, "Your account has been deleted", 200)
  }
  catch (err) { return serverError(res, err) }
}

// For owner to create manager
exports.createManager = async (req, res) => {
  const { username, password } = req.body
  try {
    // Check body empty
    const emptyMessage = emptyBody({ username, password })
    if (emptyMessage) { return error(res, emptyMessage, 400) }

    // Check user exist
    const user = await User.findOne({
      where: { username }
    })
    if (user) { return error(res, `Username already exist`, 400) }

    // Registration process
    const newUser = registrationProcess(req.body, req.user)
    return success(res, newUser, 201)
  }
  catch (err) { return serverError(res, err) }
}

exports.getAllUser = async (req, res) => {
  const { id } = req.user
  const { name, sort, order = 'ASC', limit = 10, page = 1 } = req.query;
  try {
    const filter = name? { username: { [Op.iLike]: `%${name}%` }, fullname: { [Op.iLike]: `%${name}%` }, role: 'manager'} : { role: 'manager' }
    const totalUsers = await User.count({ where: filter });
    const maxPages = Math.ceil(totalUsers / limit);
    const actualPage = page > maxPages? maxPages : page
    const orderBy = sort ? [[sort, order.toUpperCase()]] : [['fullname', 'ASC']];
    const user = await User.findAll({
      where: filter,
      order: orderBy,
      offset: parseInt((actualPage - 1) * limit, 10)
    });
    return success(res, user, 200)
  }
  catch (err) { return serverError(res, err) }
};

// Edit other user
exports.editUser = async (req, res) => {
  const { userId } = req.params
  const { username, fullname, password } = req.body
  try {
    const user = await User.findByPk(userId);
    if (username && username.length > 0) { user.username = username }
    if (fullname && fullname.length > 0) { user.fullname = fullname }
    if (password && password.length > 0) { user.password = await bcrypt.hash(password, 10) }

    await user.save()
    return success(res, "Information updated", 200)
  }
  catch (err) { return serverError(res, err) }
}

// For owner to delete other account
exports.deleteUser = async (req, res) => {
  const { userId } = req.params
  const { id, role } = req.user
  try {
    const user = await User.findByPk(userId);
    if (!user) { return error(res, "User not found", 404) }
    if (user.role == 'superadmin') { return error(res, 200, "Super Admin cannot be deleted", 400) }

    await user.destroy();
    return success(res, "success", 200)
  }
  catch (err) { return serverError(res, err) }
}