<template>
    <Container class="relative">
        <input  :placeholder="placeholder"
                ref="input"
                :value="value"
                autocomplete="off"
                autocorrect="off"
                spellcheck="false"
                @input="$emit('input', $event.target.value)"
                type="text"
                :style="inputStyle"
                class="input form-control width-full">
        <svg class="octicon octicon-search subnav-search-icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0013 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 000-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"></path></svg>
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
                default: () => {}
            },
        },
        mounted() {
            this.initEnterHandler()
        },
        methods: {
            initEnterHandler() {
                this.$refs.input.onkeydown = e => {
                    if(e.key === "Enter") {
                        this.search()
                    }
                }
            }
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped>
.input{
    padding-left: 30px;
    color: #586069;
}
</style>