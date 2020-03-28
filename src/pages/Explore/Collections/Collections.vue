<template>
   <component :is="collection ? 'CollectionDetail' : 'CollectionsBrowser'"></component>
</template>

<script>
    import CollectionsBrowser from './CollectionsBrowser'
    import CollectionDetail from './CollectionDetail'
    export default {
        computed: {
            collection() {
                return this.$route.params.collection
            }
        },
        components: {
            CollectionsBrowser,
            CollectionDetail
        }
    }
</script>

<style scoped>

</style>