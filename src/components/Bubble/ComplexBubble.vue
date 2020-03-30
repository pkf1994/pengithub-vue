<template>
    <Container class="pb-3">
        <Inner class="bubble mb-0" style="overflow:visible" :class="{'bubble-disabled':disabled || loading}">
            <Title :class="{'disabled-filter':disabled}">
                <slot name="title"></slot>
            </Title>

            <div v-if="disabledAnimatedWrapper">
                <slot v-if="!disabledFlag && !loading"></slot>
                <BubbleDisabled v-else-if="disabled" class="bubble-content text-center">
                    <p style="margin-block-start: 1em;margin-block-end: 1em;">{{disabledNotice}}</p>
                </BubbleDisabled>
                <BubbleDisabled v-else-if="isLoading" class="bubble-content flex-row-center">
                    <LoadingIconEx style="margin-block-start: 1em;margin-block-end: 1em;"/>
                </BubbleDisabled>
            </div> 

            <AnimatedHeightWrapper v-else :inactivatedFlagSignal="inactivatedFlagSignal">
                <slot v-if="!disabledFlag && !loading"></slot>
                <BubbleDisabled v-else-if="disabled" class="bubble-content text-center">
                    <p style="margin-block-start: 1em;margin-block-end: 1em;">{{disabledNotice}}</p>
                </BubbleDisabled>
                <BubbleDisabled v-else-if="isLoading" class="bubble-content flex-row-center">
                    <LoadingIconEx style="margin-block-start: 1em;margin-block-end: 1em;"/>
                </BubbleDisabled>
            </AnimatedHeightWrapper>  

            <AnimatedHeightWrapper :inactivatedFlagSignal="inactivatedFlagSignal">
                <Footer :class="{footer:withFooterSlot && withFooterBorderTop,'disabled-filter':disabled}" v-if="!loading">
                    <slot name="footer"></slot>
                </Footer>
            </AnimatedHeightWrapper>    
        </Inner>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {LoadingIconEx} from '../Loading'
    import {AnimatedHeightWrapper} from '../AnimatedSizeWrapper'
    export default {
        props: {
            disabledNotice: {
                type: String,
                default: "nothing here"
            },
            disabledFlag: {
                type: Boolean,
                default: false
            },
            loading: {
                type: Boolean,
                default: false
            },
            inactivatedFlagSignal: {
                type: Boolean,
                default: false
            },
            withFooterBorderTop: {
                type: Boolean,
                default: true
            },
            disabledAnimatedWrapper:{
                type: Boolean,
                default: true
            }
        },
      
        computed: {
            disabled() {
                return this.disabledFlag && !this.loading
            },
            isLoading() {
                return this.loading && !this.disabledFlag
            },
            withFooterSlot() {
                return this.$slots.footer
            }
        },
        components: {
            LoadingIconEx,
            AnimatedHeightWrapper,
            Container: styled.div``,
            Inner: styled.div``,
            Title: styled.div``,
            Footer: styled.div``,
            BubbleDisabled: styled.div``,
            LoadingContainer: styled.div``
        }
    }
</script>

<style scoped lang='scss'>

    .bubble {
        padding: 0;
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
        font-size: 15px;
        color: #586069;
    }

    .footer{
        border-top: 1px solid #d1d5da;
    }

    .disable-filter {
        filter: grayscale(100%)
    }
</style>