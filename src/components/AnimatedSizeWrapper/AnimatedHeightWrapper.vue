<template>
    <Container class="transition-all container" :style="{height: stretch ? `${height}px` : 0}">
        <Inner ref="content">
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
                height: 0
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
                this.height = this.$refs.content.$el.offsetHeight
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