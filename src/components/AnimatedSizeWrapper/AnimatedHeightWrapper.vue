<template>
    <Container :style="{height: stretch ? `${height}px` : 0, ...containerStyle}">
        <Inner ref="content" v-on:compute-height="subComputeHeightEventHandler" >
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
            inactivatedFlagSignal: {
                type: Boolean,
                required: false
            }
        },
        data() {
            return {
                height: 0,
                inactivatedFlag: false
            }
        },
        computed: {
            containerStyle() {
                return {
                    overflowY: this.inactivatedFlag ? 'visible' : 'hidden',
                    transition: this.inactivatedFlag ? 'none' : 'height .4s'
                }
            }
        },
        mounted() {
            this.computeHeight()
        },
        updated() {
            this.computeHeight()
            //处理图片加载问题
            let imgArr = this.$refs.content.$el.getElementsByTagName('img')
            imgArr.forEach((item) => {
                item.onload = () => {
                    this.computeHeight()
                }
            })
          
        },
        activated() {
            this.computeHeight()
        },
        methods: {
            computeHeight() {
                if(!this.$refs.content) return 
                if(this.height === this.$refs.content.$el.offsetHeight) return
                this.height = this.$refs.content.$el.offsetHeight

                setTimeout(() => {
                    let computeHeightEvent = document.createEvent('HTMLEvents')
                    computeHeightEvent.initEvent("compute-height",true,false)
                    this.$refs.content && this.$refs.content.$el.dispatchEvent(computeHeightEvent)
                },400)
            },
            subComputeHeightEventHandler(event) {
                if(event.target == this.$refs.content.$el) return 
                util_throttle.throttleByDelay(() => this.computeHeight(),50,this.randomMeta)
            }
        },
        watch: {
            inactivatedFlagSignal(newOne,oldOne) {
                if(newOne && !oldOne) {
                    setTimeout(() => {
                        this.inactivatedFlag = true
                    },400)
                }else if(oldOne && !newOne) {
                     this.inactivatedFlag = false
                }
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