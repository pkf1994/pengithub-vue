<template>
    <Container class="transition-all container" :style="{height:height}">
        <Inner ref="content">
            <slot></slot>
        </Inner>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        data() {
            return {
                height: 0,
                changingHeight: false
            }
        },
        updated() {
            this.$nextTick(() => {
                if(!this.changingHeight) {
                    this.changingHeight = true
                    this.stretch()
                    this.changingHeight = false
                }
            })
        },
        methods: {
            stretch() {
                this.height = getComputedStyle(this.$refs.content.$el).height
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