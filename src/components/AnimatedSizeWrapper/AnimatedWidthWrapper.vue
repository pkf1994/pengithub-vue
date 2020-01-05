<template>
    <Container class="transition-all container d-inline-block" :style="{width:width + 'px'}">
        <Inner ref="content" class="d-inline-block">
            <slot></slot>
        </Inner>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        data() {
            return {
                width: 0,
                changingWidth: false
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