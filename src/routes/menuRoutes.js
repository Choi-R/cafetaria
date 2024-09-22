const express = require('express')
const route = express.Router()
const menuC = require('../controllers/menuController')
const { authenticate, managerOnly } = require('../middlewares/auth')

route.post('/menu', authenticate, managerOnly, menuC.createMenu)
route.get('/menu', menuC.getAllMenus)
route.get('/menu/:menuId', menuC.getMenuById)
route.put('/menu/:menuId', authenticate, managerOnly, menuC.updateMenu)
route.delete('/menu/:menuId', authenticate, managerOnly, menuC.deleteMenu)

module.exports = route