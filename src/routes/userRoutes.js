const express = require('express')
const route = express.Router()
const userC = require('../controllers/userController')
const { authenticate, managerOnly, ownerOnly } = require('../middlewares/auth')

route.post('/user', userC.register)
route.post('/user/login', userC.login)
route.get('/user', authenticate, userC.getMe)
route.put('/user', authenticate, userC.editMe)
route.delete('/user', authenticate, userC.deleteMe)

route.post('/user/manager', authenticate, ownerOnly, userC.createManager)
route.get('/user/all', authenticate, ownerOnly, userC.getAllUser)
route.put('/user/:userId', authenticate, ownerOnly, userC.editUser)
route.delete('/user/:userId', authenticate, userC.deleteUser)

module.exports = route