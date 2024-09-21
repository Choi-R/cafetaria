exports.success = (res, data, statusCode) => {
    return res.status(statusCode).json({
        status: true,
        data
    })
}

exports.error = (res, err, statusCode) => {
    return res.status(statusCode).json({
        status: false,
        error: err
    })
}

exports.serverError = (res, err) => {
    console.log(err)
    return res.status(500).json({
        status: false,
        error: "Unexpected error occured. Please contact the administrator for futher information."
    })
}