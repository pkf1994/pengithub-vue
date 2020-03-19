<template>
    <Container class="pb-3">
        <Inner class="bubble mb-0" style="overflow:visible" :class="{'bubble-disabled':disable || loading}">
            <Title :class="{'disable-filter':disable}">
                <slot name="title"></slot>
            </Title>

            <AnimatedHeightWrapper :inactivatedFlagSignal="inactivatedFlagSignal">
                <slot v-if="!disableFlag && !loading"></slot>
                <BubbleDisable v-else-if="disable" class="bubble-content text-center">
                    <p style="margin-block-start: 1em;margin-block-end: 1em;">{{disableNotice}}</p>
                </BubbleDisable>
                <BubbleDisable v-else-if="isLoading" class="bubble-content flex-row-center">
                    <LoadingIconEx style="margin-block-start: 1em;margin-block-end: 1em;"/>
                </BubbleDisable>
            </AnimatedHeightWrapper>  

            <AnimatedHeightWrapper :inactivatedFlagSignal="inactivatedFlagSignal">
                <Footer :class="{footer:withFooterSlot && withFooterBorderTop,'disable-filter':disable}" v-if="!loading">
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
            inactivatedFlagSignal: {
                type: Boolean,
                default: false
            },
            withFooterBorderTop: {
                type: Boolean,
                default: true
            }
        },
      
        computed: {
            disable() {
                return this.disableFlag && !this.loading
            },
            isLoading() {
                return this.loading && !this.disableFlag
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
            Title: styled.h3``,
            Footer: styled.div``,
            BubbleDisable: styled.div``,
            LoadingContainer: styled.div``
        }
    }
</script>

<style scoped>

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