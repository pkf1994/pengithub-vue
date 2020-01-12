<template>
    <Container class="container position-fixed relative" :class="{'prevent-click-event':!preventClickEvent}">
        <Inner :class="[size,position]" class="position-absolute transition-all fade-infinite">
            <svg height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M14.7 5.34c.13-.32.55-1.59-.13-3.31 0 0-1.05-.33-3.44 1.3-1-.28-2.07-.32-3.13-.32s-2.13.04-3.13.32c-2.39-1.64-3.44-1.3-3.44-1.3-.68 1.72-.26 2.99-.13 3.31C.49 6.21 0 7.33 0 8.69 0 13.84 3.33 15 7.98 15S16 13.84 16 8.69c0-1.36-.49-2.48-1.3-3.35zM8 14.02c-3.3 0-5.98-.15-5.98-3.35 0-.76.38-1.48 1.02-2.07 1.07-.98 2.9-.46 4.96-.46 2.07 0 3.88-.52 4.96.46.65.59 1.02 1.3 1.02 2.07 0 3.19-2.68 3.35-5.98 3.35zM5.49 9.01c-.66 0-1.2.8-1.2 1.78s.54 1.79 1.2 1.79c.66 0 1.2-.8 1.2-1.79s-.54-1.78-1.2-1.78zm5.02 0c-.66 0-1.2.79-1.2 1.78s.54 1.79 1.2 1.79c.66 0 1.2-.8 1.2-1.79s-.53-1.78-1.2-1.78z"></path></svg>
        </Inner>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import LoadingIcon from './LoadingIcon'
    export default {
        props: {
            preventClickEvent: {
                type: Boolean,
                default: true
            },
            size: {
                type: String,
                default: "middle"
            },
            position: {
                type: String,
                default: 'center'
            }
        },
        components: {
            LoadingIcon,
            Container: styled.div``,
            Inner: styled.div``
        }
    }
</script>

<style scoped lang="scss">

    .container{
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

    }
    .small{
        bottom: calc(50% - 17.5px);
        right: calc(50% - 17.5px);
        height: 35px;
        width: 35px;
    }
    .middle{
        bottom: calc(50% - 22.5px);
        right: calc(50% - 22.5px);
        height: 45px;
        width: 45px;
    }
    .large{
        bottom: calc(50% - 30px);
        right: calc(50% - 30px);
        height: 60px;
        width: 60px;
    }
    .corner{
        bottom: 20px !important;
        right: 20px !important;
        height: 30px !important;
        width: 30px !important;
    }
    .prevent-click-event{
        pointer-events: none;
    }
    .fade-infinite{
        animation: fade 1.5s infinite linear;
    }
    @keyframes fade {
            0% { 
                opacity: 0
                 }
            45% {
                opacity: 0.95;
            }
            50% {
                 opacity: 1
            }
            55% {
                opacity: 0.95;
            }
             100% { 
                opacity: 0
                 }
        }
</style>