<template>
    <Container class="p-responsive text-center py-6 bg-gray-light border-bottom">
        <h1 class="h0-mktg" v-if="title">{{title}}</h1>
        <p class="f4 text-gray mx-auto">
            {{paragraph}}
        </p>
        <slot></slot>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            title: {
                type: String,
                required: false
            },
            paragraph: {
                type: String,
                required: false
            }
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped>
.h0-mktg{
    font-size: 32px!important;
    font-family: Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
    font-weight: 500;
}
</style>