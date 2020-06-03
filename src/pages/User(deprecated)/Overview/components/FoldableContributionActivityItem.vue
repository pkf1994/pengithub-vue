<template>
    <Container class="py-4 pl-4 position-relative ml-3">
        <span class="discussion-item-icon">
            <slot name="icon">
                <svg class="octicon octicon-repo-push" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 3H3V2h1v1zM3 5h1V4H3v1zm4 0L4 9h2v7h2V9h2L7 5zm4-5H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h4v-1H1v-2h4v-1H2V1h9.02L11 10H9v1h2v2H9v1h2c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1z"></path></svg>
            </slot>
        </span>

        <button type="button" class="d-flex flex-justify-between btn-link f4 muted-link no-underline lh-condensed width-full" aria-expanded="true" @click="triggerFolded">
            <span class="ws-normal text-left d-inline-block">
                {{title}}
            </span>
            <span class="d-inline-block" @click.stop="triggerFolded">
                <svg class="octicon octicon-fold" v-if="folded" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 9l3 3H8v3H6v-3H4l3-3zm3-6H8V0H6v3H4l3 3 3-3zm4 2c0-.55-.45-1-1-1h-2.5l-1 1h3l-2 2h-7l-2-2h3l-1-1H1c-.55 0-1 .45-1 1l2.5 2.5L0 10c0 .55.45 1 1 1h2.5l1-1h-3l2-2h7l2 2h-3l1 1H13c.55 0 1-.45 1-1l-2.5-2.5L14 5z"></path></svg>
                <svg class="octicon octicon-unfold" v-else viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.5 7.5L14 10c0 .55-.45 1-1 1H9v-1h3.5l-2-2h-7l-2 2H5v1H1c-.55 0-1-.45-1-1l2.5-2.5L0 5c0-.55.45-1 1-1h4v1H1.5l2 2h7l2-2H9V4h4c.55 0 1 .45 1 1l-2.5 2.5zM6 6h2V3h2L7 0 4 3h2v3zm2 3H6v3H4l3 3 3-3H8V9z"></path></svg>
            </span>
        </button>

        <AnimatedHeightWrapper :stretch="!folded">
            <slot></slot>    
        </AnimatedHeightWrapper>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper} from '@/components'
    export default {
        props: {
            title: {
                type: String,
                requrired: true
            },
            defaultFolded: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                folded: true
            }
        },
        created() {
            this.folded = this.defaultFolded
        },
        methods: {
            triggerFolded() {
                this.folded = !this.folded
            }
        },
        components: {
            AnimatedHeightWrapper,
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">
.discussion-item-icon {
    float: left;
    width: 32px;
    height: 32px;
    margin-top: -5px;
    margin-left: -39px;
    line-height: 28px;
    color: #24292e;
    text-align: center;
    background-color: #e1e4e8;
    border: 2px solid #fff;
    border-radius: 50%;
}
</style>