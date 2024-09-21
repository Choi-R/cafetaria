// === Automate app.use() for every router
const router = require('express').Router()
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename)
const routes = {}

// === Read every files in this folder, except this file
fs.readdirSync(__dirname).filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(file => {
    routes[file.split('.')[0]] = require(`./${file}`);
    router.use(routes[file.split('.')[0]])
})

module.exports = router;