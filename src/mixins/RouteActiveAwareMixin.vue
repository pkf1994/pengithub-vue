<template>
    
</template>

<script>
    export default {
        data() {
            return {
                routeActive: true
            }
        },
        activated() {
            this.routeActive = true
        },
        deactivated() {
             this.routeActive = false
        }
    }
</script>

<style scoped>

</style>