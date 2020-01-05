<template>
    
</template>

<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                source: axios.CancelToken.source()
            }
        },
        destroyed() {
            if(!this.source) return
            this.source.cancel()
        }
    }
</script>

<style scoped>

</style>