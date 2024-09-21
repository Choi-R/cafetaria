const express = require('express')
const route = express.Router()
const cafeC = require('../controllers/cafeController')
const { authenticate, ownerOnly, managerOnly } = require('../middlewares/auth')

route.post('/cafe', authenticate, ownerOnly, cafeC.createCafe)
route.get('/cafe', cafeC.getAllCafes)
route.get('/cafe/:cafeId', cafeC.getCafeById)
route.put('/cafe/:cafeId', authenticate, ownerOnly, cafeC.updateCafe)
route.delete('/cafe/:cafeId', authenticate, ownerOnly, cafeC.deleteCafe)

module.exports = route