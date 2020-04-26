import {mapState} from 'vuex'

export default {
    install: (Vue) => {
        Vue.mixin({
            data() {
                return {
                    loginNotice: 'GitHub api对匿名用户进行请求速率限制，请登录以正常访问'
                }
            },
            computed: {
                ...mapState({
                    accessToken: state => state.oauth.accessToken.accessToken
                })
            },
            methods: {
                handleError(e) {
                    console.log(e)
                    this.$toast(e,'error')
                    if(!e.response && !this.accessToken) {
                        this.$toast(this.loginNotice)
                    }
                }
            }
        })
    }
}