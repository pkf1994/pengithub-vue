<template>
    <Container class="container d-flex">
            <button class="btn" @click="clickButtonHandler">
                <slot>
                    {{buttonTitle}}
                </slot>
            </button>
        <slot name="input">
              <Container class="position-relative flex-grow-1">
                <input  :placeholder="placeholder"
                        ref="input"
                        :value="value"
                        @keydown.enter="search"
                        autocomplete="off"
                        autocorrect="off"
                        spellcheck="false"
                        @input="$emit('input', $event.target.value)"
                        type="text"
                        :style="inputStyle"
                        class="input form-control width-full input-contrast" >
                <svg class="octicon octicon-search subnav-search-icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0013 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 000-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"></path></svg>
            </Container>
        </slot>
    </Container>
    
</template>

<script>
    import styled from 'vue-styled-components'
    import {IconSearchInput} from '../'
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
            buttonTitle: {
                type: String,
                default: 'button'
            },
            clickButtonHandler: {
                type: Function,
                default: () => {console.log("click button")}
            }
        },
        components: {
            IconSearchInput,
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/navigation/index.scss';
.container{
    border-radius: 3px;
    button{
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    input{
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        z-index: 9;
    }
}
.input{
    padding-left: 30px;
    color: #586069;
}
</style>