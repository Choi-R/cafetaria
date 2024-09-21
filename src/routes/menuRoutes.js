const express = require('express')
const route = express.Router()
const menuC = require('../controllers/menuController')
const { authenticate, managerOnly } = require('../middlewares/auth')

route.post('/menu', authenticate, managerOnly, menuC.createMenu)
route.get('/menu', menuC.getAllMenus)
route.get('/menu/:id', menuC.getMenuById)
route.put('/menu/:id', authenticate, managerOnly, menuC.updateMenu)
route.delete('/menu/:id', authenticate, managerOnly, menuC.deleteMenu)

module.exports = route