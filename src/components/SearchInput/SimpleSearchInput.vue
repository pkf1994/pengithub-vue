<template>
    <Container>
        <input  :placeholder="placeholder"
            ref="input"
            :value="value"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
            @input="$emit('input', $event.target.value)"
            type="text"
            @keydown.enter="search"
            :style="inputStyle"
            class="form-control d-block width-full" >
    </Container>
    
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        model: {
            prop: 'value',
            event: 'input'
        },
        props: {
            value: String,
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
                default: () => ({})
            },
            search: {
                type: Function,
                default: () => {console.log('search')}
            },
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped>
.input{
    min-height: 34px;
    padding: 6px 8px;
    font-size: 16px;
    line-height: 20px;
    color: #24292e;
    vertical-align: middle;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: right 8px center;
    border: 1px solid #d1d5da;
    border-radius: 3px;
    outline: none;
    box-shadow: inset 0 1px 2px rgba(27,31,35,.075);
}
</style>