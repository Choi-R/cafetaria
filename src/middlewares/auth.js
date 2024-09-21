const jwt = require('jsonwebtoken')
const { error, serverError } = require('../helpers/response')

exports.authenticate = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) { return error(res, 'No token provided', 401) }
    try {
        req.user = await jwt.verify(authorization, process.env.SECRET_KEY)
        return next()
    }
    catch (err) { 
        if (err.name == 'JsonWebTokenError') { return error(res, err.message, 401) }
        else if (err.name == 'TokenExpiredError') { return error(res, "Expired login session", 401) }
        else { return serverError(res, err) }
    }
}

exports.managerOnly = async (req, res, next) => {
    const { role } = req.user
    allowedRoles = ['manager', 'superadmin']
    try {
        if (allowedRoles.includes(role)) { return next() }
        else { return error(res, "Manager role only", 401) }
    }
    catch(err) { serverError(res, err) }
}

exports.ownerOnly = async (req, res, next) => {
    const { role } = req.user
    allowedRoles = ['owner', 'superadmin']
    try {
        if (allowedRoles.includes(role)) { return next() }
        else { return error(res, "Owner role only", 401) }
    }
    catch(err) { serverError(res, err) }
}