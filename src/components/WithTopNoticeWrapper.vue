<template>
    <Container> 
        <AnimatedHeightWrapper>
            <Notice v-if="notice" class="p-3 flash flash-full" :class="{'flash-error':type == 'error'}">
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