<template>
    <Container> 
        <AnimatedHeightWrapper>
            <Notice v-if="notice" class="p-3 flash flash-full" :class="{'flash-error':type == 'error'}">
                <button @click="() => topNoticeShow(theKey,'','normal')" class="flash-close js-flash-close" type="button" aria-label="Dismiss this message">
                    <svg class="octicon octicon-x" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                </button>
                <div class="px-2">
                    {{notice}}
                </div>
            </Notice>
        </AnimatedHeightWrapper>
        <slot></slot>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper} from '@/components'
    export default {
        name: 'with_top_notice_wrapper',
        props: {
            theKey: String
        },
        computed: {
            notice() {
                return this.topNotice[this.theKey] && this.topNotice[this.theKey].notice
            },
            type() {
                return this.topNotice[this.theKey] && this.topNotice[this.theKey].type
            }
        },
        deactivated() {
            this.topNoticeShow(this.theKey,'','normal')
        },
        components: {
            AnimatedHeightWrapper,
            Container: styled.div``,
            Notice: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/alerts/index.scss';
.flash{
    font-size: 14px;
    font-weight: 600;
}
</style>