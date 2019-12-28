<template>
    <input :placeholder="placeholder"
           autocomplete="off"
           autocorrect="off"
           spellcheck="false"
           @input="onInput"
           type="text"
           :style="inputStyle"
           class="input-contrast form-control width-full" >
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
                default: () => {}
            },
            inputStyle: {
                type: Object,
                default: () => {}
            }
        }
    }
</script>

<style scoped>

</style>