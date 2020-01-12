<template>
    <Container style="overflow: hidden;transition: height .4s" :style="{height: stretch ? `${height}px` : 0}">
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
            },
            delay: {
                type: Number,
                default: 0
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
            if(this.delay !== 0) {
                setTimeout(() => {
                    this.computeHeight()
                },this.delay)
            }
        },
        methods: {
            computeHeight() {
                if(!this.$refs.content) return 
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

</style>