import {mapState} from 'vuex'

import * as api from '@/network/api'
export default {
    install: (Vue) => {
        Vue.mixin({
            data() {
                return {
                    loginNotice: 'GitHub api对匿名用户进行请求速率限制，请登录以正常访问',
                    oauthLink: api.API_OAUTH2
                }
            },
            computed: {
                ...mapState({
                    accessToken: state => state.oauth.accessToken.accessToken
                })
            },
            created() {
                if(this.documentTitle) {
                    document.title = this.documentTitle
                }
            },
            watch: {
                documentTitle(newOne){
                    document.title = newOne
                } 
            },
            methods: {
                handleError(e,config = {handle404: false}) {
                    if(!e) return
                    console.log(e)
                    if(config.handle404) {
                        if(e.response && e.response.status == 404) {
                            this.$router.replace('/404')
                        }
                    }
                    this.$toast(e,'error')
                    if(!e.response && !this.accessToken) {
                        this.$toast(this.loginNotice)
                    }
                }
            },
            activated() {
                if(this.documentTitle) {
                    document.title = this.documentTitle
                }
            }
        })
    }
}