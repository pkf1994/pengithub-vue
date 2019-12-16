export default function(queryStr) {
    let queryObject = {}
    let queryArray = queryStr.split("&")
    queryArray.forEach(item => {
        let kv = item.split("=")
        queryObject[kv[0]] = kv[1]
    })
    return queryObject
}