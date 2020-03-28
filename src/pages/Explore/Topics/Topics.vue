<template>
   <component :is="topic ? 'TopicDetail' : 'TopicsBrowser'"></component>
</template>

<script>
    import TopicsBrowser from './TopicsBrowser'
    import TopicDetail from './TopicDetail'
    export default {
        computed: {
            topic() {
                return this.$route.params.topic
            }
        },
        components: {
            TopicsBrowser,
            TopicDetail
        }
    }
</script>

<style scoped>

</style>