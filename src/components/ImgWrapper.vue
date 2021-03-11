<template>
    <Container style="overflow: hidden" :style="{height:height > 0 && height + 'px',width:width > 0 && width + 'px'}">
        <span key="1" v-if="showImgFlag" class="fade-in" :class="{'d-inline-block':height > 0}" :style="{height:height > 0 && height + 'px',width:width > 0 && width + 'px'}">
            <slot></slot>
        </span>

        <UnloadCover key="2" v-else class="unload-cover d-inline-block" :style="{height:height + 'px',width:width + 'px'}">
        </UnloadCover>
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
                unsizeHeight: "",
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
                if(this.height == 0) {
                    this.height = this.width
                }
                if(this.$slots.default[0].elm.complete) return
                this.showImgFlag = false
            },
            initLoadHandler() {
                if(!this.$slots.default) return 
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
.fade-in{
    animation: fade-in-animation .5s;
}

@keyframes fade-in-animation {
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
}

</style>