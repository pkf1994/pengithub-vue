<template>
    <Container @load.native="loadHandler">
        <transition-group name="fade-group">
            <span key="1" v-if="showImgFlag">
                <slot></slot>
            </span>
            <UnloadCover key="2" v-else class="unload-cover avatar d-inline-block" :style="{height:height + 'px',width:width + 'px'}">
            </UnloadCover>
        </transition-group>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {

        },
        data() {
            return {
                height: 0,
                width: 0,
                showImgFlag: true,
            }
        },
        mounted() {
            this.initCoverStyle()
            this.initLoadHandler()
        },
        methods: {
            initCoverStyle() {
                if(!this.$slots.default) return 
                this.width = this.$slots.default[0].elm.width
                this.height = this.$slots.default[0].elm.height
                if(this.$slots.default[0].elm.complete) return
                this.showImgFlag = false
            },
            initLoadHandler() {
                if(!this.$slots.default) return 
                if(this.loaded) return
                this.$slots.default[0].elm.addEventListener('load',(e) => {
                    this.showImgFlag = true
                })
            },
        },
        components: {
            Container: styled.span``,
            UnloadCover: styled.span``,
        }
    }
</script>

<style scoped lang='scss'>
@import "node_modules/@primer/css/avatars/index.scss";
.unload-cover{
    background: #d1d5da;
}
@keyframes loading {
    0%,100%{
        opacity: 0;
    }
    50%{
        opacity: 1;
    }
}
</style>