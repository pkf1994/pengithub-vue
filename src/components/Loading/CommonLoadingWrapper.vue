<template>
    <Container>
        <slot></slot>
        <transition name="fade" appear>
            <CommonLoading :preventClickEvent="preventClickEvent" :position="position" v-if="loading" :size="size"/>
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
            },
            size: {
                type: String,
                default: 'middle'
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