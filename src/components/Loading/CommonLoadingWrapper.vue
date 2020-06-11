<template>
    <Container>
        <slot></slot>
        <transition name="fade" appear>
            <CommonLoading :preventClickEvent="preventClickEvent" :position="position" v-if="loading"/>
        </transition>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import CommonLoading from './CommonLoading'
    export default {
        props: {
            preventClickEvent: {
                type: Boolean,
                default: false
            },
            loading: {
                type: Boolean,
                required: true
            },
            position: {
                type: String,
                default: 'center'
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