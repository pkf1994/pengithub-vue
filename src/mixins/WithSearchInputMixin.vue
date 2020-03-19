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
        mounted() {
            this.initEnterHandler()
        },
        methods: {
            search() {
                if(!this.localSearchQuery || this.localSearchQuery.trim() === "") return
                this.$router.push({
                    path: `/search/repositories?q=${this.localSearchQuery}`
                })
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