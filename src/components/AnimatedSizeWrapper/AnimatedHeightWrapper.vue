<template>
    <Container :style="{height: stretch ? `${height}px` : 0, transition: transition,overflow:'hidden'}">
        <Inner ref="content" v-on:compute-height="subComputeHeightEventHandler">
            <slot></slot>
        </Inner>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_throttle} from '../../util'
    import {ComponentActiveAwareMixin} from '@/mixins'
    export default {
        mixins: [ComponentActiveAwareMixin],
        props: {
            stretch: {
                type: Boolean,
                default: true
            },
            appear: {
                type: Boolean,
                default: true
            },
        },
        data() {
            return {
                height: 0,
                transition: 'height .4s'
            }
        },
        created() {
            if(!this.appear) {
                this.transition = 'none'
            }
        },
        mounted() {
            this.computeHeight()
        },
        updated() {
             util_throttle.throttleByDelay(() => this.computeHeight(),50,this)
            //处理图片加载问题
            let imgArr = this.$refs.content.$el.getElementsByTagName('img')
            imgArr.forEach((item) => {
                item.onload = () => {
                    this.computeHeight()
                }
            })
          
        },
        deactivated() {
            this.transition = 'none'
        },
        activated() {
            this.computeHeight()
        },
        methods: {
            computeHeight() {
                if(!this.$refs.content) return 
                if(this.height === this.$refs.content.$el.offsetHeight) return
                this.height = this.$refs.content.$el.offsetHeight

                if(this.componentActive) {
                    setTimeout(() => {
                        this.transition = 'height .4s'
                    },0)
                }
                

                setTimeout(() => {
                    this.emitComputeHeightEvent()
                },400)
            },
            subComputeHeightEventHandler(event) {
                if(event.target == this.$refs.content.$el) return 
                util_throttle.throttleByDelay(() => this.computeHeight(),50,this)
            },
            emitComputeHeightEvent() {
                let computeHeightEvent = document.createEvent('HTMLEvents')
                computeHeightEvent.initEvent("compute-height",true,false)
                this.$refs.content && this.$refs.content.$el.dispatchEvent(computeHeightEvent)
                this.inactivatedFlag = this.inactivatedFlagSignal
            }
        },
        watch: {
            stretch() {
                 setTimeout(() => {
                    this.emitComputeHeightEvent()
                },400)
            }
          /*   inactivatedFlagSignal(newOne,oldOne) {
                if(newOne && !oldOne) {
                    setTimeout(() => {
                        this.inactivatedFlag = true
                    },400)
                }else if(oldOne && !newOne) {
                     this.inactivatedFlag = false
                }
            } */
        },
        components: {
            Container: styled.div``,
            Inner: styled.div``
        }
    }
</script>

<style scoped>

</style>