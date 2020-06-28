<template>
   <component v-bind:is="currentComponent"></component>
</template>

<script>
    import styled from 'vue-styled-components'
    import Hola from './Hola/Hola.vue'
    import Dashboard from './Dashboard/Dashboard.vue'
    export default {
        computed: {
            currentComponent() {
                 return this.accessToken ? "Dashboard" : "Hola"
            }
        },
        components:{
            Hola,
            Dashboard
        }
    }
</script>

<style scoped>

</style>