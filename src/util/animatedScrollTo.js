export default {
    scrollTo(el,targetValue) {
        if(el.scrollTop > targetValue) {
            let interval = setInterval(() => {
                el.scrollTop += -1
                if(el.scrollTop <= targetValue) window.clearInterval(interval)
            })
        }
        if(el.scrollTop < targetValue) {
            let interval = setInterval(() => {
                el.scrollTop += 1
                if(el.scrollTop >= targetValue) window.clearInterval(interval)
            })
        }
    }
}