export default {
    adjustInlineBlockStyle:function (query) {
        let elList = document.querySelectorAll(query)
        let parent = undefined
        elList.forEach((item,index) => {
            if(!parent) parent = item.parentNode
            if(index !== (elList.length - 1)) {
                parent.insertBefore(document.createTextNode(" "),item.nextSibling)
            }
        })
    },
    highlightKeyword: function (query,keyword) {
        let elList = document.querySelectorAll(query)
        let keywordArray = keyword.split(" ")
        elList.forEach(item => {
            var innerHTML = item.innerHTML
            keywordArray.forEach(_item => {
                let _item2
                if(_item.charAt(0).match(/[A-Z]/)) {
                    _item2 = _item.charAt(0).toLowerCase() + _item.slice(1)
                }else if(_item.charAt(0).match(/[a-z]/)) {
                    _item2 = _item.charAt(0).toUpperCase() + _item.slice(1)
                }
                let reg = new RegExp(_item,"g")
                if(reg.test(innerHTML)) {
                    innerHTML = innerHTML.replace(reg,`<strong>$&</strong>`)
                }
                if(_item2) {
                    let reg2 = new RegExp(_item2,"g")
                    if(reg2.test(innerHTML)) {
                        innerHTML = innerHTML.replace(reg2,`<strong>$&</strong>`)
                    }
                }
            })
            item.innerHTML = innerHTML
        })
    }
}