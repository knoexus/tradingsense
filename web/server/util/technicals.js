const { shuffle, getRandomNumbers } = require('./baseOps')

const basePrice = 10

const getMixedTechnicals = (take, lock, technicals) => {
    if (take > technicals.length || lock > take || take <= 0 || lock < 0) return null
    let taken_arr = shuffle(technicals).slice(0, take)
    const randArr = getRandomNumbers(0, taken_arr.length-1, lock)
    randArr.forEach(e => {
        taken_arr[e].value = null
        taken_arr[e].price = basePrice
     })
    return taken_arr
}

const checkTechnicalsHaveNullValues = technicals => {
    technicals.forEach(e => {
        e.indicators.forEach(i => {
            for (value in Object.values(i)) {
                if (value == null) return true
            }
        })
    })
    return false
}

const getTechnicalsAllPrice = num => {
    const k = 1.0
    const max_k = 1.5
    const mult = basePrice * num
    if (mult <= basePrice) return {
        min: basePrice,
        max: basePrice * max_k
    }
    else {
        const intm = (mult - basePrice) * k
        return {
            min: intm,
            max: intm * max_k
        }
    }
}

module.exports = { getMixedTechnicals, checkTechnicalsHaveNullValues, getTechnicalsAllPrice }