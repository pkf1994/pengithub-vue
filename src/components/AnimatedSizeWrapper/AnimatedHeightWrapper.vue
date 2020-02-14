<template>
    <Container style="overflow: hidden;transition: height .4s" :style="{height: stretch ? `${height}px` : 0}">
        <Inner ref="content" v-on:compute-height="subComputeHeightEventHandler">
            <slot></slot>
        </Inner>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_throttle} from '../../util'
    import {WithRandomMetaMixin} from '../../mixins'
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
        activated() {
            this.computeHeight()
        },
        methods: {
            computeHeight() {
                if(!this.$refs.content) return 
                this.height = this.$refs.content.$el.offsetHeight
                let computeHeightEvent = document.createEvent('HTMLEvents')
                computeHeightEvent.initEvent("compute-height",true,false)
                this.$refs.content.$el.dispatchEvent(computeHeightEvent)
            },
            subComputeHeightEventHandler(event) {
                if(event.target == this.$refs.content.$el) return 
                console.log("compute-event")
                util_throttle.throttleByDelay(() => this.computeHeight(),50,this.randomMeta)
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