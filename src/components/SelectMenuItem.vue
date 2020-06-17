<template>
    <container class="container">
        <div class="icon-wrapper" :style="iconStyle">
            <slot name="icon">
                <svg :style="{visibility:selected?'visible':'hidden'}" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
            </slot>
        </div>
        
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
            },
            iconStyle: Object
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">
.container{
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 16px;
    padding-left: 40px;
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
        flex-shrink: 0;
        vertical-align: text-bottom;
        fill: currentColor;
    }
}

.icon-wrapper{
    position: absolute;
    left: 16px;
}
</style>