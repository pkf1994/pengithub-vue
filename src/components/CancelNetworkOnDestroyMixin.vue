<template>
    
</template>

<script>
    export default {
        destroyed() {
            if(!this.source) return
            this.source.cancel()
        }
    }
</script>

<style scoped>

</style>