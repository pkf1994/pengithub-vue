<template>
    <Container>
        <Summary class="flex flex-justify-between" @click="triggerStretch">
            <slot name="summary"></slot>
            <svg class="d-inline-block ml-1" @click.stop="triggerStretch" v-if="stretch" fill="currentColor" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 10l-1.5 1.5L5 7.75 1.5 11.5 0 10l5-5 5 5z"></path></svg>
            <svg class="d-inline-block ml-1" @click.stop="triggerStretch" v-else fill="currentColor" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"></path></svg>
        </Summary>
        <AnimatedHeightWrapper :stretch="stretch">
            <Detail style="padding-top: 6px;">
                <slot></slot>
            </Detail> 
        </AnimatedHeightWrapper> 
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper} from './AnimatedSizeWrapper'
    export default {
       
        data() {
            return {
                stretch: false
            }
        },
        methods: {
            triggerStretch() {
                if(this.disable) return
                this.stretch = !this.stretch
            }
        },
        components: {
            AnimatedHeightWrapper,
            Container: styled.div``,
            Summary: styled.div``,
            Detail: styled.div``,
            DisbleCover: styled.div``,
        }
    }
</script>

<style scoped>
svg{
    transform: scale(1.4);
}
</style>