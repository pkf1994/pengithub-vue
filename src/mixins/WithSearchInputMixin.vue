<template>
    
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        data() {
            return {
                localSearchQuery: ""
            }
        },
        computed: {
            ...mapState({
                searchQuery: state => state.search.searchQuery
            })
        },
        mounted() {
            this.initLocalSearchQuery()
            this.initEnterHandler()
        },
        methods: {
            search() {
                if(!this.localSearchQuery || this.localSearchQuery.trim() === "") return
                this.$router.push({
                    path: `/search?q=${this.localSearchQuery}`
                })
            },
            initLocalSearchQuery() {
                this.localSearchQuery = this.searchQuery
            },
            initEnterHandler() {
                this.$refs.input.onkeydown = e => {
                    if(e.key === "Enter") {
                        this.search()
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>