<template>
    <Container class="container modal-container"
                ref="container"
                :style="{'pointer-events':show ? 'auto' : 'none'}">
        <transition name='fade'>
            <Cover class="cover" id="modal-cover" v-if="show" @click="close"></Cover>
        </transition>
        <transition name="modal-basic">
            <Main class="main Box d-flex flex-column transition-all" v-if="show" :style="modalStyle" style="width: 640px;">
                <Title class="p-3 Box-title Box-header modal-title">
                    <button @click="close" class="Box-btn-octicon btn-octicon float-right" type="button" aria-label="Close dialog" data-close-dialog="">
                        <svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                    </button>
                    <slot name="header">
                        {{title}}
                    </slot>
                </Title>
                <slot></slot>
            </Main>
        </transition>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper} from './'
    export default {
        props: {
            title: {
                type: String,
                default: 'Modal'
            },
            modalStyle: {
                 type: Object,
                 default: () => ({})
            },
        },
        data() {
            return {
                show: false,
            }
        },
        
        mounted() {
            this.init()
        },
        methods: {
            close() {
                this.show = false
            },
            init() {
                this.$refs.container.$el.ontouchmove = this.touchMoveHandler
            },
            touchMoveHandler(e) {
                e.stopPropagation && e.stopPropagation()
                if(e.path.some(i => i.className && i.className.indexOf('modal-title') != -1)) {
                    e.preventDefault && e.preventDefault()
                }
                if(e.path[0].className.indexOf("cover") != -1) {
                    e.preventDefault && e.preventDefault()
                }
            },
        },
        watch: {
            show(newValue,oldValue) {
                if(newValue && !oldValue) {
                    let body = document.getElementsByTagName("body")[0]
                    body.style.overflowY = 'hidden'
                    this.$emit('show')
                }
                if(oldValue && !newValue) {
                    let body = document.getElementsByTagName("body")[0]
                    body.style.overflowY = 'auto'
                    this.$emit('hide')
                }
            },
        },
        components: {
            AnimatedHeightWrapper,
            Container: styled.div``,
            Cover: styled.div``,
            Title: styled.div``,
            Main: styled.div``,
            Content: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
    .container{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        z-index: 9;
        display: flex;
        justify-content: center;
        align-content: center;
    }

    .cover{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        z-index: -1;
        background: rgba(27,31,35,.5);
    }

    .main{
        margin: auto;
        max-height: 80vh;
        max-width: 90vw;
        border-radius: 6px;
        background-color: #f6f8fa;
        .Box-body{
            border-radius: 6px;
        }
    }

    .Box-header{
         border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }

    .modal-basic-enter-active,
    .modal-basic-leave-active {
        transition: all 0.12s cubic-bezier(0,.1,.1,1);
    }

    .modal-basic-enter,
    .modal-basic-leave-to {
        opacity: 0;
        transform: scale(0.9);
    }
</style>