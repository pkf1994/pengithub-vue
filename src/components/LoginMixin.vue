<template>
    
</template>

<script>

    import {mapState} from "vuex";

    export default {
        computed: {
            ...mapState({
                logined: state => state.logined
            })
        }
    }
</script>

<style scoped>

</style>