<template>
    
</template>

<script>
    export default {
        destroyed() {
            if(!this.sourceArray || this.sourceArray.length === 0) return
            this.sourceArray.forEach(item => {
                item.cancel()
            })
        }
    }
</script>

<style scoped>

</style>