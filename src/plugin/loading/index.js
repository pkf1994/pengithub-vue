import Loading from "./Loading"

export default {
    install: (Vue) => {
        const LoadingConstructor = Vue.extend(Loading)
        const LoadingComponent = new LoadingConstructor()
        LoadingComponent.$mount()
        document.body.appendChild(LoadingComponent.$el)
        Vue.prototype.$triggerLoading = (flag,position,preventClickEvent) => {
            LoadingComponent.triggerShow(flag,position,preventClickEvent)
        }
        Vue.triggerLoading = (flag,position,preventClickEvent) => {
            LoadingComponent.triggerShow(flag,position,preventClickEvent)
        }
    }
}