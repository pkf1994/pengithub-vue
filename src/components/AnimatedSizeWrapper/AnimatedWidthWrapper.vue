<template>
    <Container class="transition-all container d-inline-block height-full" :style="{width:stretch ? `${width}px`:0}">
        <Inner ref="content" class="d-inline-block">
            <slot></slot>
        </Inner>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            stretch: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                width: 0,
            }
        },
        mounted() {
            this.computeHeight()
        },
        updated() {
            this.computeHeight()
        },
        methods: {
            computeHeight() {
                this.width = this.$refs.content.$el.offsetWidth
            }
        },
        components: {
            Container: styled.div``,
            Inner: styled.div``
        }
    }
</script>

<style scoped>
    .container{
        overflow: hidden;
    }
</style>