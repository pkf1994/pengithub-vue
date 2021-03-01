import {mapState,mapActions} from 'vuex'
import {ACTION_SIGN_OUT} from "@/store/modules/oauth/actionTypes"
import {util_ramdonString} from '@/util'
import {authRequiredGitHubGraphqlApiQuery,authRequiredDelete,authRequiredPut,authRequiredPost} from '@/network'
import * as api from '@/network/api'
import * as graphql from './graphql'
export default {
    install: Vue => {
        Vue.mixin({
            computed: {
                ...mapState({
                    accessToken: state => state.oauth.accessToken.accessToken
                }),
                repo() {
                    return this.$route.params.repo
                },
                owner() {
                    return this.$route.params.owner
                }
            }, 
            methods: {
                ...mapActions({
                    action_signOut: ACTION_SIGN_OUT
                }),
                routeToSignOut(return_to) {
                    this.$router.push(`/sign_out${return_to ? '?return_to=' + return_to : ''}`)
                },
                async signOut(payload) {
                    let fromRoute = {
                        ...this.$route
                    }
                    await this.action_signOut({
                        fromRoute,
                        ...payload
                    })
                },
                async github_changeStarStatus(owner,repo,viewerHasStarred = false) {
                    if(!this.accessToken) {
                        this.signIn()
                        return 
                    }
                    let url  = api.API_STAR_OR_NOT_REPOSITORY({
                        owner,
                        repo
                    })
                    if(viewerHasStarred) {
                        await authRequiredDelete(
                            url,
                            {},
                        )
                    }else{
                        await authRequiredPut(
                            url
                        )
                    }
                    
                },
                async github_blockUserOrNot(blockedUserLogin,userHasBeenBlock = false) {
                    if(!this.accessToken) {
                        this.signIn()
                        return 
                    }
                    let url = api.API_BLOCK_USER_OR_NOT(blockedUserLogin)
                    if(userHasBeenBlock) {
                        await authRequiredDelete(
                            url,
                            {
                                headers: {
                                    "accept": "application/vnd.github.giant-sentry-fist-preview+json"
                                }
                            }
                        )
                    }else{
                        await authRequiredPut(
                            url,
                            {},
                            {
                                headers: {
                                    "accept": "application/vnd.github.giant-sentry-fist-preview+json"
                                }
                            },
                        )
                    }
                },
                async github_changeUserFollowShip(user,viewerIsFollowing) {
                    if(!this.accessToken) {
                        this.signIn()
                        return 
                    }
                    let url = api.API_FOLLOW_USER_OR_NOT(user)
                    if(viewerIsFollowing) {
                        await authRequiredDelete(url)
                    }else{
                        await authRequiredPut(url)
                    }
                },
                async github_updateSubscrption(subscribableId,state) {
                    if(!this.accessToken) {
                        this.signIn()
                        return 
                    }

                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.UPDATE_SUBSCRIPTION,
                        {
                            variables: {
                                subscribableId,
                                state
                            }
                        }
                    )

                    let subscriptionResult
                    try{
                        subscriptionResult = res.data.data.updateSubscription.subscribable.viewerSubscription
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    
                    return subscriptionResult
                },
                async github_createIssueReaction(payload) {
                    let url = api.API_ISSUE_REACTIONS({
                        repo: payload.repo,
                        owner: payload.owner,
                        number: payload.number
                    })

                    await authRequiredPost(
                        url,
                        {
                            content: payload.content
                        },
                        {
                            headers: {
                                "accept": "application/vnd.github.squirrel-girl-preview+json"
                            }
                        }
                    )
                },
                signIn(signInFromPath) {
                    let state = util_ramdonString.randomString()
                    let _signInFromPath = signInFromPath || this.$route.fullPath
                    sessionStorage.setItem('state',state)
                    sessionStorage.setItem('signInFromPath',_signInFromPath)
                    let oauthHref = api.API_OAUTH2({
                        state
                    })
                    location.href = oauthHref
                },
            }
        })
    }
}