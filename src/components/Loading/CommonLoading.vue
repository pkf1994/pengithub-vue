<template>
    <Container class="container position-fixed relative" :class="{'prevent-click-event':!preventClickEvent}">
        <Inner :class="[size,position]" class="position-absolute transition-all">
            <img alt="loading"
                 class="width-fit height-fit"
                 src="../../assets/image/octocat-spinner-128.gif"/>
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
</style>