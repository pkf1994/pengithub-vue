<template>
    <button class="btn btn-sm" :disabled="(localViewerHasStarred === undefined && accessToken) || loading" @click="network_changeStarStatus">
        <span v-if="accessToken" >  
            <span v-if="!loading">
                <svg v-if="localViewerHasStarred" class="octicon octicon-star" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                <svg v-else class="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
            </span> 
            {{loading ? 'Updating...' : (localViewerHasStarred ? 'Unstar' : 'Star')}}
        </span>

        <span v-else>
            <svg class="octicon octicon-star" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
            Star
        </span>
    </button>
</template>
<script>
import styled from 'vue-styled-components'
export default {
    props: {
        ownerProp: String,
        repoProp: String,
        viewerHasStarred: Boolean
    },
    data() {
        return {
            loading: false,
            localViewerHasStarred: undefined,
        }
    },
    created() {
        this.localViewerHasStarred = this.viewerHasStarred
    },
    methods: {
         async network_changeStarStatus() {
            if(this.viewerHasStarred === undefined  && this.accessToken) return
            if(!this.accessToken) {
                this.signIn()
                return 
            }
            try {
                this.loading = true
                await this.github_changeStarStatus(this.ownerProp, this.repoProp, this.localViewerHasStarred)
                this.localViewerHasStarred = !this.localViewerHasStarred
            } catch (e) {
                this.handleError(e)
            }finally{
                this.loading = false
            }
        }
    },
    watch: {
        viewerHasStarred(newOne,oldOne) {
            this.localViewerHasStarred = newOne
        },
    },
    components: {
        Container: styled.div``
    }
}
</script>
<style scoped>
</style>
