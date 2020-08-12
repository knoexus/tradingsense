const getQuarterAndYear = (startDate, endDate) => { 
    if (dateDiff(startDate, endDate, "m") > 3) return null // assuming the interval <= 1 quarter
    const startDateQuarter = Math.floor((startDate.getMonth() + 3) / 3)
    const endDateQuarter = Math.floor((endDate.getMonth() + 3) / 3)
    if (startDateQuarter === endDateQuarter)
        return new QY(startDate.getFullYear(), startDateQuarter)
    else {
        const upperBound = new Date(startDate.getFullYear(), startDateQuarter*3, 0)
        const lowerBound = new Date(endDate.getFullYear(), endDateQuarter*3-3, 1)
        if (dateDiff(startDate, upperBound, "d") <= dateDiff(lowerBound, endDate, "d"))
            return new QY(endDate.getFullYear(), endDateQuarter)
        else
            return new QY(startDate.getFullYear(), startDateQuarter)
    }
}

class QY {
  constructor(year, quarter){
    this.year = year,
    this.quarter = quarter
  }
}

const dateDiff = (a, b, diffIn) => {
    const ms = 1000 * 60 * 60 * 24 * (diffIn == "m" ? 7 * 4 : 1)
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
    return Math.floor((utc2 - utc1) / ms)
}

module.exports = {
    getQuarterAndYear
}