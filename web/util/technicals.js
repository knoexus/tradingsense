const getRandomNumbers = (min, max, n) => {
    let arr = []
    while(arr.length < n){
        const r = Math.floor(Math.random() * (max - min) + min)
        if(arr.indexOf(r) === -1) arr.push(r)
    }
    return arr
}

const shuffle = (a) => {
    let array = [...a]
    let counter = array.length
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter)
        counter--
        let temp = array[counter]
        array[counter] = array[index]
        array[index] = temp
    }
    return array
}

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