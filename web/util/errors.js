exports.getErrorMessage = getErrorMessage = (type, ...args) => {
    switch (type) {
        case "NULLRESPONSE":
            return `Error: Null response for ${args[0]}`
        default:
            return `Error`
    }
}

