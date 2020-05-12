<template>
    <Container>
        <TopTab class="border-bottom"></TopTab>
        
        <keep-alive>
            <router-view name="ExploreMain"></router-view>
        </keep-alive>
        <keep-alive>
            <router-view name="ExploreTrending"></router-view>
        </keep-alive>
        <keep-alive>
            <router-view name="ExploreCollectionsBrowser"></router-view>
        </keep-alive>
        <keep-alive>
            <router-view name="ExploreTopicsBrowser"></router-view>
        </keep-alive>

        <router-view name="ExploreCollectionDetail"></router-view>
        <router-view name="ExploreTopicDetail"></router-view>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {TopTab} from './components'
    import {commonGet} from '@/network'
    export default {
        async created() {
           /*  let r = await commonGet("https://github.com/vuejs/vue/tree-list/5d93c838962b943216cc8cb24aae34ae479be2bd")
            console.log(r) */
        },
        components: {
            TopTab,
            Container: styled.div``
        },
        created() {
            console.log(this.$router.history)
        },
    }
</script>

<style scoped>

</style>