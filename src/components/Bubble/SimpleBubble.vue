<template>
    <Container class="bubble">
        <Title class="bubble-title bg-gray" :style="headerStyle">
            {{title}}
        </Title>

        <slot v-if="disableAnimatedWrapper"></slot>

        <AnimatedHeightWrapper v-else>
            <slot></slot>
        </AnimatedHeightWrapper>  

        <BubbleDisable v-if="disableFlag || loading" class="bubble-disabled bubble-content">
            <p v-if="disableFlag && !loading" style="margin-block-start: 1em;margin-block-end: 1em;">{{disableNotice}}</p>
             <LoadingIconEx  style="margin-block-start: 1em;margin-block-end: 1em;"  v-if="loading"/>
        </BubbleDisable>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {LoadingIconEx} from '../Loading'
    import {AnimatedHeightWrapper} from '../AnimatedSizeWrapper'
    export default {
        props: {
            title: {
                type: String,
                required: true
            },
            disableNotice: {
                type: String,
                default: "nothing here"
            },
            disableFlag: {
                type: Boolean,
                default: false
            },
            loading: {
                type: Boolean,
                default: false
            },
            headerStyle: {
                type: Object,
                required: false
            },
            disableAnimatedWrapper:{
                type: Boolean,
                default: true
            }
        },
        components: {
            LoadingIconEx,
            AnimatedHeightWrapper,
            Container: styled.div``,
            Title: styled.h3``,
            BubbleDisable: styled.div``,
            LoadingContainer: styled.div``
        }
    }
</script>

<style scoped lang="scss">

    .bubble {
        padding: 0;
        margin:0 15px 15px 15px;
        overflow: hidden;
        word-break: break-word;
        word-wrap: break-word;
        white-space: normal;
        background: #fff;
        border: 1px solid #d1d5da;
        border-radius: 3px;
    }

    .bubble-title {
        display: block;
        padding: 10px 15px;
        margin: 0;
        font-size: 14px;
        color: #2f363d;
        border-bottom: 1px solid #d1d5da;
    }

    .bubble-content{
        padding:15px;
    }

    .bubble-disabled {
        background: #f6f8fa;
        border-color: #d1d5da;
        box-shadow: inset 0 0 10px rgba(27,31,35,.1);
    }

    .bubble-disabled {
        font-size: 15px;
        color: #586069;
        text-align: center;
    }
</style>