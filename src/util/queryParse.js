export default {
    parse: function(queryStr) {
        let queryObject = {}
        let queryArray = queryStr.split("&")
        queryArray.forEach(item => {
            let kv = item.split("=")
            queryObject[kv[0]] = kv[1]
        })
        return queryObject
    },
    querify: function (queryObj) {
        let query = ""
        if(queryObj !== {})
        for(let key in queryObj) {
            if(queryObj[key]) query = `${query}&${key}=${queryObj[key]}`
        }
        return query.substring(1,query.length)
    }
}