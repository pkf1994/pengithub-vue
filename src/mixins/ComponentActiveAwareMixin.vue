<template>
    
</template>

<script>
    export default {
        data() {
            return {
                componentActive: true
            }
        },
        activated() {
            this.componentActive = true
        },
        deactivated() {
             this.componentActive = false
        }
    }
</script>

<style scoped>

</style>