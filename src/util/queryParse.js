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
            if(queryObj[key] !== undefined){
                let queryValueFragment = queryObj[key].toString().replace(/%/g,'%25')
                                        .replace(/\+/g,'%2B')
                                        .replace(/ /g,'%20')
                                        .replace(/\//g,'%2F')
                                        .replace(/\?/g,'%3F')
                                        .replace(/#/g,'%23')
                                        .replace(/&/g,'%26')
                                        .replace(/=/g,'%3D')
                query = `${query}&${key}=${queryValueFragment}`
            }
        }
        return query.substring(1,query.length)
    }
}