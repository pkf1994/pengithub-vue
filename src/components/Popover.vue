<template>
    <transition name="popover-basic">
        <Container  class="container" 
                    ref="cover"  
                    v-if="show"
                    :class="{'top-triangle':!smooth}"
                    :style="popoverStyle">
            <Cover class="cover" v-show="show"  @click.stop="close"></Cover>

            <Main class="main bg-white">
                <slot></slot>
            </Main>
        </Container>
    </transition>

</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper} from './'
    export default {
        props: {
            popoverStyle: {
                type: Object,
                required: false
            },
            smooth: Boolean
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
        watch: {
            show(newOne, oldOne) {
                if(newOne && !oldOne) {
                    this.$emit('show')
                }
                if(!newOne && oldOne) {
                    this.$emit('hide')
                }
            }
        },
        components: {
            AnimatedHeightWrapper,
            Container: styled.div``,
            Cover: styled.div``,
            Main: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
    .container{
        position: absolute;
        z-index: 100;
        list-style: none;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid rgba(27,31,35,.15);
        border-radius: 4px;
        box-shadow: 0 1px 15px rgba(27,31,35,.15);
    }

    .top-triangle:before{
        top: -16px;
        right: 9px;
        left: auto;
        border: 8px solid transparent;
        border-bottom-color: rgba(27,31,35,.15);
        position: absolute;
        display: inline-block;
        content: "";
    }

    .top-triangle:after {
        top: -14px;
        right: 10px;
        left: auto;
        border: 7px solid transparent;
        border-bottom-color: #fff;
        position: absolute;
        display: inline-block;
        content: "";
    }

    .cover{
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: -1;
    }

    .cover:before {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 80;
    display: block;
    cursor: default;
    content: " ";
    background: transparent;
}

    .main{
        border-radius: 6px;
        background-color: #f6f8fa;
    }

    .Box-header{
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }

    .popover-basic-enter-active {
        transition: all 0.15s cubic-bezier(.2,0,.13,1.5);
    }

    .popover-basic-leave-active {
        transition: all 0.15s cubic-bezier(.2,0,.13,1.5);
    }

    .popover-basic-enter,
    .popover-basic-leave-to {
        opacity: 0;
        transform: scale(0.5);
    }
</style>