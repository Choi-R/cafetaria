exports.emptyBody = (body) => {
    for(const [key, value] of Object.entries(body)) {
        if (!value) {
            return `${key} field is missing`
        }
    }
    return null
}