const { shuffle, getRandomNumbers } = require('./baseOps')

const getMixedTechnicals = (take, lock, technicals) => {
    if (take > technicals.length || lock > take || take <= 0 || lock < 0) return null
    let taken_arr = shuffle(technicals).slice(0, take)
    const randArr = getRandomNumbers(0, taken_arr.length-1, lock)
    randArr.forEach(e => taken_arr[e].value = null)
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

module.exports = { getMixedTechnicals, checkTechnicalsHaveNullValues }