<template>
    <Container class="container">
        <input :placeholder="placeholder"
               autocomplete="off"
               autocorrect="off"
               spellcheck="false"
               @input="onInput"
               type="text"
               class="input-contrast form-control width-full">
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            placeholder: {
                type: String,
                default: "Search"
            },
            onInput: {
                type: Function,
                required: true
            }
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped>
.container{
    padding: 15px;
}
</style>