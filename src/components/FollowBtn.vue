<template>
    <button class="btn btn-sm" :disabled="(localViewerIsFollowing === undefined && accessToken) || loading || !viewerCanFollow" @click="network_changeStarStatus">
        {{loading ? 'Updating...' : (localViewerIsFollowing ? 'Unfollow' : 'Follow')}}
    </button>
</template>
<script>
import styled from 'vue-styled-components'
export default {
    props: {
        userLogin: String,
        viewerCanFollow: Boolean,
        viewerIsFollowing: Boolean
    },
    data() {
        return {
            loading: false,
            localViewerIsFollowing: undefined,
        }
    },
    creatd() {
        this.localViewerIsFollowing = this.viewerIsFollowing
    },
    methods: {
         async network_changeStarStatus() {
            if(this.viewerIsFollowing === undefined  && this.accessToken) return
            if(!this.accessToken) {
                this.signIn()
                return 
            }
            try {
                this.loading = true
                await this.github_changeUserFollowShip(this.userLogin, this.localViewerIsFollowing)
                this.localViewerIsFollowing = !this.localViewerIsFollowing
            } catch (e) {
                this.handleError(e)
            }finally{
                this.loading = false
            }
        }
    },
    watch: {
        viewerIsFollowing(newOne,oldOne) {
            this.localViewerIsFollowing = newOne
        },
    },
    components: {
        Container: styled.div``
    }
}
</script>
<style scoped>
</style>
