const getRandomNumbers = (min, max, n) => {
    let arr = []
    while(arr.length < n){
        const r = Math.floor(Math.random() * (max - min) + min)
        if(arr.indexOf(r) === -1) arr.push(r)
    }
    return arr
}

const shuffle = a => {
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

module.exports = { getRandomNumbers, shuffle }