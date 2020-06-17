import {mapState,mapActions} from 'vuex'
import {ACTION_SIGN_OUT} from "@/store/modules/oauth/actionTypes"
import {util_ramdonString} from '@/util'
import * as api from '@/network/api'
export default {
    install: Vue => {
        Vue.mixin({
            computed: {
                ...mapState({
                    accessToken: state => state.oauth.accessToken.accessToken
                })
            },
            methods: {
                ...mapActions({
                    action_signOut: ACTION_SIGN_OUT
                }),
                routeToSignOut(return_to) {
                    this.$router.push(`/sign_out${return_to ? '?return_to=' + return_to : ''}`)
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
                },
            }
        })
    }
}