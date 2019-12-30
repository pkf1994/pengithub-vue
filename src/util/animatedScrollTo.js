export default {
    scrollTo(el,targetValue,pace = 4) {
        if(el.scrollTop > targetValue) {
            let interval = setInterval(() => {
                el.scrollTop += -pace
                if(el.scrollTop <= targetValue) window.clearInterval(interval)
            })
        }
        if(el.scrollTop < targetValue) {
            let interval = setInterval(() => {
                el.scrollTop += pace
                if(el.scrollTop >= targetValue) window.clearInterval(interval)
            })
        }
    },
    scrollToEl(el,scrollEl,pace = 4) {
        let scrollElOffsetTop = scrollEl.offsetTop
        let elOffsetTop = el.offsetTop
        if(elOffsetTop > scrollEl.scrollTop) {
            let interval = setInterval(() => {
                scrollEl.scrollTop += pace
                if(elOffsetTop <= scrollEl.scrollTop) window.clearInterval(interval)
            })
        }
        if(elOffsetTop < scrollEl.scrollTop) {
            let interval = setInterval(() => {
                scrollEl.scrollTop += -pace
                if(elOffsetTop >= scrollEl.scrollTop) window.clearInterval(interval)
            })
        }
    }
}