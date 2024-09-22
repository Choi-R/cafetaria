exports.emptyBody = (body) => {
    for(const [key, value] of Object.entries(body)) {
        if (!value) {
            return `${key} field is missing`
        }
    }
    return null
}

exports.decimal2 = (price) => {
    const regex = /^\d+(\.\d{1,2})?$/; // Matches a number with up to 2 decimal places
    return regex.test(price);
  };

exports.theManager = (reqUser, managerCafeId) => {
    if (reqUser.role == "manager" && reqUser.id != managerCafeId) {
        return "You are not the manager of this cafe"
    }
    else { return null }
}

