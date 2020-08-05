import {mapState} from 'vuex'
import axios from 'axios'
import * as api from '@/network/api'
import {util_throttle} from '@/util'
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
                    accessToken: state => state.oauth.accessToken.accessToken,
                    viewer: state => state.oauth.viewerInfo
                }),
            },
            methods: {
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
                    if(e.response) {
                        if(e.response.data.message) this.$toast(e.response.data.message,'error')
                        if(e.response.data.detailMessage) this.$toast(e.response.data.detailMessage,'error')
                        if(e.response.data.errors) {
                            e.response.data.errors.forEach(i => {
                                this.$toast(i.message,'error')
                            })
                        }
                    }else{
                        this.$toast(e,'error')
                    }
                    if(!e.response && !this.accessToken) {
                        util_throttle.throttleByGap(() => {
                            this.$toast(this.loginNotice)
                        },500,'login-notice')
                    }
                },
                handleGraphqlError(graphqlRes) {
                    let errors = graphqlRes.data && graphqlRes.data.errors
                    if(errors) {
                        errors.forEach((i,index) => {
                            if(index < errors.length - 1) {
                                console.log(i.message)
                                this.$toast(i.message,'error')
                            }else{
                                console.log(i.message)
                                throw new Error(i.message)
                            }
                        })
                    }
                },
                emitNotFoundEvent(el) {
                    let event = document.createEvent('HTMLEvents')
                    event.initEvent("not-found",true,false)
                    el.dispatchEvent(event)
                },
                showModal(modalRef) {
                    if(this.$refs[modalRef]) this.$refs[modalRef].show = true
                },
                closeModal(theModalRef) {
                    if(theModalRef) {
                        if(this.$refs[theModalRef].show) this.$refs[theModalRef].show = false
                        return 
                    }
                    for(let modalRef in this.$refs) {
                        if(this.$refs[modalRef]) {
                            this.$refs[modalRef].show = false
                        }
                    }
                },
                scrollToTop() {
                    window && window.scrollTo(0,0)
                },
                scrollToBottom() {
                    let bottomY = document && document.body && document.body.scrollHeight
                    window && window.scrollTo(0,bottomY)
                },
                getPageScrollTop() {
                    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
                },
            },
            created() {
                if(this.documentTitle) document.title = this.documentTitle
            },
            beforeRouteEnter(to,from,next) {
                next(vm => {
                    if(vm.documentTitle) {
                        document.title = vm.documentTitle
                    }
                })
            },
            deactivated() {
                if(this.debug)console.log('===================deactivated=======================')
                this.closeModal()
                if(this.debug)console.log('===================deactivated=======================')
            },
            watch: {
                documentTitle() {
                    if(this.componentActive && this.isDynamicDocumentTitle) document.title = this.documentTitle
                }
            }
        })
    }
}