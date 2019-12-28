<template>
    <Container>
        <slot></slot>
        <CommonLoading v-if="loading"/>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import CommonLoading from './CommonLoading'
    export default {
        props: {
            loading: {
                type: Boolean,
                required: true
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