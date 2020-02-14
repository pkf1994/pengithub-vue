<template>
    <container class="container">
        <slot name="icon">
            <svg :style="{visibility:selected?'visible':'hidden'}" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
        </slot>
        <slot></slot>
    </container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            selected: {
                type: Boolean,
                default: false
            }
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">
.container{
    display: flex;
    align-items: center;
    width: 100%;
    padding: 16px;
    overflow: hidden;
    color: #586069;
    text-align: left;
    cursor: pointer;
    background-color: #fff;
    border: 0;
    border-bottom: 1px solid #eaecef;
    svg{
        width: 16px;
        display: inline-block;
        margin-right: 8px;
        flex-shrink: 0;
        vertical-align: text-bottom;
        fill: currentColor;
    }
}
</style>