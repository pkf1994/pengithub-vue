import Toast from "./Toast"

export default {
    install: (Vue) => {
        const ToastConstructor = Vue.extend(Toast)
        const toastComponent = new ToastConstructor()
        toastComponent.$mount()
        document.body.appendChild(toastComponent.$el)
        Vue.prototype.$toast = (toastContent,type,duration) => {
            toastComponent.pushToast(toastContent,type,duration)
        }
        Vue.toast = (toastContent,type,duration) => {
            toastComponent.pushToast(toastContent,type,duration)
        }
    }
}