
export default {
    install: (Vue) => {
        Vue.mixin({
            data() {
                return {
                    primaryColor: '#24292e'
                }
            }
        })
    }
}