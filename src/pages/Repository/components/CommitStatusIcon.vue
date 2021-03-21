<template>
    <transition name="fade" appear>
        <svg v-if="commitState && commitState.toLowerCase() == 'success'" class="octicon octicon-check text-green" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
        <svg v-else-if="commitState && commitState.toLowerCase() == 'failure'" class="octicon octicon-x text-red" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
    </transition>
</template>

<script>
    import styled from 'vue-styled-components'
    import {mapState} from 'vuex'
    export default {
        props: {
            commit: Object
        },
        computed:{
            nodeId() {
                return this.commit.node_id
            },
            commitState() {
                return this.graphqlData.state && this.graphqlData.status.state
            },
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">

</style>