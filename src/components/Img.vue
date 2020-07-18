<template>
    <Container style="overflow: hidden" class="width-full height-full">
        <transition-group tag="div" class="width-full height-full" name="fade-group">
            <span key="1" v-if="showImgFlag">
                <img ref="img" :src="src" :height="height" :width="width" :style="imgStyle"/>
            </span>
            <UnloadCover key="2" v-else class="unload-cover avatar d-inline-block" :style="{height:height + 'px',width:width + 'px',...imgStyle}">
            </UnloadCover>
        </transition-group>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            src: String,
            height: Number,
            width: Number,
            imgStyle: Object,
        },
        data() {
            return {
                showImgFlag: true,
            }
        },
        mounted() {
            this.initCoverStyle()
            this.initLoadHandler()
        },
        methods: {
            initCoverStyle() {
                if(this.$refs.img.complete) return
                this.showImgFlag = false
            },
            initLoadHandler() {
                this.$refs.img.addEventListener('load',(e) => {
                    this.showImgFlag = true
                })
            },
        },
        watch: {
            src(newOne,oldOne) {
                this.showImgFlag = false
            }
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