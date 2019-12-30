<template>
    <Container>
        <slot></slot>
        <CommonLoading :preventClickEvent="preventClickEvent" :position="position" v-if="loading"/>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import CommonLoading from './CommonLoading'
    export default {
        props: {
            preventClickEvent: {
                type: Boolean,
                default: true
            },
            loading: {
                type: Boolean,
                required: true
            },
            position: {
                type: String,
                default: 'center'
            },
            transitionName: {
                type: String,
                default: "slide-up-gentle"
            }
        },
        components: {
            CommonLoading,
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>