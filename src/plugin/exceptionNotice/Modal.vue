<template>
    <Cover class="cover flex-row-center" v-show="show" ref="cover" @click="triggerModal">
        <transition name="modal-basic" appear>
            <Main class="main Box  flex-column" v-show="show"  style="width: 640px;">
                <Title class="p-3 Box-title Box-header">
                    <button @click="close" class="Box-btn-octicon btn-octicon float-right" type="button" aria-label="Close dialog" data-close-dialog="">
                        <svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                    </button>
                    {{title}}
                </Title>
                <Content v-html="content" class="Box-body overflow-auto markdown-body">

                </Content>
            </Main>
        </transition>
    </Cover>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        data() {
            return {
                show: false,
                title: "notice",
                content: "",
            }
        },
        methods: {
            close() {
                this.show = false
            },
            triggerModal(event) {
                if(event.path[0] === this.$refs.cover.$el){
                    this.show = !this.show
                }
            },
            showModal(title,content) {
                this.content = content
                this.title = title
                this.show = true
            }
        },
        components: {
            Cover: styled.div``,
            Title: styled.div``,
            Content: styled.div``
        }
    }
</script>

<style scoped lang="scss">
    .cover{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        z-index: 8;
        display: flex;
        justify-content: center;
        align-content: center;
        background: rgba(27,31,35,.5);
    }

    .main{

        margin: 10vh auto;
        max-height: 80vh;
        max-width: 90vw;
    }

    .modal-basic-enter-active,
    .modal-basic-leave-active {
        transition: all 0.5s;
    }

    .modal-basic-enter,
    .modal-basic-leave-to {
        transform: scale(0.9);
    }
</style>