<template>
    <Container class="container"
                :style="{'pointer-events':show ? 'auto' : 'none'}">
        <transition name='fade'>
            <Cover class="cover" v-show="show"  @click="close"></Cover>
        </transition>
        <transition name="modal-basic">
            <Main class="main Box flex-column" v-show="show" :style="modalStyle" style="width: 640px;">
                <Title class="p-3 Box-title Box-header">
                    <button @click="close" class="Box-btn-octicon btn-octicon float-right" type="button" aria-label="Close dialog" data-close-dialog="">
                        <svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                    </button>
                    {{title}}
                </Title>
                <Content class="Box-body bg-white overflow-auto markdown-body p-0 flex-grow-1">
                    <slot></slot>
                </Content>
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
        methods: {
            close() {
                this.show = false
            }
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
    .container{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        z-index: 8;
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