
let shuffleFisherYates = (array: Array<any>) => {
    let i = array.length
    while (i--) {
        const ri = Math.floor(Math.random() * (i + 1));
        [array[i], array[ri]] = [array[ri], array[i]]
    }
    return array;
}

let suppressSingles = (array: Array<any>) => {
    for (let i = array.length - 1; i >= 0; i++) {
        let temp = array.pop()
        if (array.includes(temp)) {
            //console.log("it's a duplicate, insert again")
            array.unshift(temp)
        }
        else {
            console.log("unique!")
        }
    }
    console.log(array)
    return array
}

let suppressLocations = (k: number = 2,array: Array<any>) => {
    let found = 0
    let unique = []
    for (let i = 0; i < array.length; i++) {
        let temp = array[i]
        for (let j = 0; j < array.length; j++) {
            if (temp.lat == array[j].lat && 
                temp.long == array[j].long &&
                i != j) {
                found++
                break
            }
        }
        if (found >= k) {
            unique.push(i)
        }
        found = 0
    }
    let result = []
    for (let i = 0; i < array.length; i++) {
        if (!unique.includes(i))
            result.push(array[i])
    }
    return result
}

export {
    shuffleFisherYates,
    suppressSingles,
    suppressLocations
}

