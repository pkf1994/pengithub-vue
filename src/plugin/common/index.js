import {mapState,mapActions} from 'vuex'
import axios from 'axios'
import * as api from '@/network/api'
import {util_ramdonString} from '@/util'
import {CommonLoadingWrapper} from '@/components'
import {ACTION_SIGN_OUT} from "@/store/modules/oauth/actionTypes"
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
                ...mapActions({
                    action_signOut: ACTION_SIGN_OUT
                }),
                handleError(e,config = {handle404: false, handle401: false}) {
                    if(!e) return
                    if(axios.isCancel(e)) return
                    console.log(e)
                    if(config.handle404) {
                        if(e.response && e.response.status == 404) {
                            this.$router.replace('/404')
                        }
                    }
                    if(config.handle401) {
                        if(e.response && e.response.status == 401) {
                            window.location.href = API_OAUTH2
                        }
                    }
                    this.$toast(e,'error')
                    if(!e.response && !this.accessToken) {
                        this.$toast(this.loginNotice)
                    }
                },
                async signOut() {
                    let fromRoute = {
                        ...this.$route
                    }
                    await this.action_signOut(fromRoute)
                },
                signIn() {
                    let state = util_ramdonString.randomString()
                    let signInFromPath = this.$route.fullPath
                    sessionStorage.setItem('state',state)
                    sessionStorage.setItem('signInFromPath',signInFromPath)
                    let oauthHref = api.API_OAUTH2({
                        state
                    })
                    location.href = oauthHref
                }   
            },
            activated() {
                if(this.documentTitle) {
                    document.title = this.documentTitle
                }
            },
            components: {
                CommonLoadingWrapper
            }
        })
    }
}