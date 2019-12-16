<template>
   <component v-bind:is="currentComponent"></component>
</template>

<script>
    import styled from 'vue-styled-components'
    import {
        Hola,
        LoginedHome
    } from './components'

    import {mapState} from "vuex";
    const LOGINED_HOME = "LoginedHome"
    const HOLA = "Hola"
    export default {

        computed: {
            ...mapState({
                currentComponent: function(state) {
                    return state.oauth.authenticated ? LOGINED_HOME : HOLA
                }
            })
        },
        components:{
            Hola,
            LoginedHome
        }
    }
</script>

<style scoped>

</style>