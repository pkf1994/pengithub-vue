<template>
    <button class="btn" :disabled="!viewerFollowInfo.viewerCanFollow || viewerFollowInfo.viewerIsFollowing === undefined" @click="network_changeStarStatus">
        {{loading ? 'Updating...' : (viewerFollowInfo.viewerIsFollowing ? 'Unfollow' : 'Follow')}}
    </button>
</template>
<script>
import styled from 'vue-styled-components'
import * as api from '@/network/api'
import {authRequiredPut, authRequiredDelete} from '@/network'
import {mapState} from 'vuex'
export default {
    props: {
        userLogin: String,
    },
    data() {
        return {
            loading: false
        }
    },
    computed: {
        ...mapState({
            viewerFollowInfo(state) {
                return state.graphqlData.nodes.filter(i => i.login == this.userLogin)[0] || {}
            }             
        })
    },
    methods: {
         async network_changeStarStatus() {
            if(!this.accessToken) {
                this.signIn()
                return 
            }
            try {
                this.loading = true
                let url = api.API_FOLLOW_USER_OR_NOT(this.userLogin)
                if(this.viewerFollowInfo.viewerIsFollowing) {
                    await authRequiredDelete(url)
                }else{
                    await authRequiredPut(url)
                }
                this.mutation_resolveGraphqlData({
                    data: [{
                        ...this.viewerFollowInfo,
                        viewerIsFollowing: !this.viewerFollowInfo.viewerIsFollowing
                    }]
                })
            } catch (e) {
                this.handleError(e)
            }finally{
                this.loading = false
            }
        }
    },
    components: {
        Container: styled.div``
    }
}
</script>
<style scoped>
</style>
