<template>
    
</template>

<script>
    export default {
        computed: {
            randomMeta: function() {
                return  `random${parseInt(Math.random() * 10000)}meta`
            }
        }
    }
</script>

<style scoped>

</style>