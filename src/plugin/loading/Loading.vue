<template>
    <transition name="fade" appear>
        <Container v-if="show" class="container position-fixed" :class="{'prevent-click-event':!preventClickEvent}">
            <Inner :class="position" class="inner position-absolute transition-all">
                <img alt="loading"
                    class="width-fit height-fit"
                    src="@/assets/image/octocat-spinner-128.gif"/>
            </Inner>
        </Container>
    </transition>
</template>

<script>
    import styled from 'vue-styled-components'
    import Vue from 'vue'
    export default {
        data() {
            return {
                show: false,
                position: 'center',
                preventClickEvent: true
            }
        },
        methods: {
            triggerShow(flag,position = 'center',preventClickEvent = true) {
                if(flag === undefined) return
                this.show = flag
                if(flag) {
                    this.position = position 
                    this.preventClickEvent = preventClickEvent
                }
            },
        },
        components: {
            Container: styled.div``,
            Inner: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.container{
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
}
.inner{
    bottom: calc(50% - 22.5px);
    right: calc(50% - 22.5px);
    height: 45px;
    width: 45px;
}
.corner{
    bottom: 20px !important;
    right: 20px !important;
    height: 30px !important;
    width: 30px !important;
}
</style>