export default function (array) {
    let newArray = []
    array.forEach(item => {
        if(newArray.indexOf(item) === -1) {
            newArray.push(item)
        }
    })
    return newArray
}