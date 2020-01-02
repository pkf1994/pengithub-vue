<template>
    <Container class="transition-all container d-inline-block" :style="{width:width}">
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
                width: "0px",
                changingWidth: false
            }
        },
        updated() {
            this.$nextTick(() => {
                if(!this.changingWidth) {
                    this.changingWidth = true
                    this.stretch()
                    this.changingWidth = false
                }
            })
        },
        methods: {
            stretch() {
                this.width = getComputedStyle(this.$refs.content.$el).width
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