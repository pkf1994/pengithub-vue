let timerStore = {}

export default {
    throttleByDelay: (method, delay, meta) => {
        let methodDelayTimer = method.toString() + JSON.stringify(meta)
        clearTimeout(timerStore[methodDelayTimer])
        timerStore[methodDelayTimer] = setTimeout(() => {
            method.call()
        },delay)
    },
    throttleByGap: (method, gap, meta) => {
        let methodIndex = method.toString() + JSON.stringify(meta)
        let now = Date.now()
        if (!timerStore[methodIndex]) {
            method.call()
            timerStore[methodIndex] = now
            return
        }
        if (now - timerStore[methodIndex] > gap) {
            method.call()
            timerStore[methodIndex] = now
        }
    }
}