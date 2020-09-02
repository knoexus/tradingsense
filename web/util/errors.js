exports.errorTypes = {
    NULLRESPONSE: "NULLRESPONSE",
    DATAMISMATCH: "DATAMISMATCH",
    RECURSIONEXCEEDED: "RECURSIONEXCEED"
}

exports.getErrorMessage = getErrorMessage = (type, ...args) => {
    switch (type) {
        case errorTypes.NULLRESPONSE:
            return `Error: Null response`
        case errorTypes.RECURSIONEXCEEDED:
            return `Error: The threshold number of recursive calls has been exceeded`
        default:
            return `Error`
    }
}

