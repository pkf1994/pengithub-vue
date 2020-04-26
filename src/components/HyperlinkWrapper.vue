<template>
    <Container>
        <slot></slot>
        <Modal title="将跳转到外部网页" ref="modal">
            <ModalContent class="modal-content p-3">
                <div class="inner p-3">
                    <svg class="octicon octicon-link" style="margin-bottom:2px" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>
                    <a :href="theHref">
                        {{theHref}}
                    </a>
                </div>
            </ModalContent>

            <ActionsRow class="actions-row border-top px-3 py-2 clearfix">
                <button class="float-right" @click="go">前往</button>
            </ActionsRow>
        </Modal>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import Modal from './Modal'
    export default {
        data() {
            return {
                theHref: undefined
            }
        },
        mounted() {
            console.log(this.$slots.default)
            this.initClickHandler()
            this.theHref = this.$slots.default[0].elm.href
        },
        methods: {
            initClickHandler() {
                if(!this.$slots.default) return 
                if(!this.$slots.default[0]) return 
                if(!this.$slots.default[0].elm) return 
                this.$slots.default[0].elm.addEventListener('click',(e) => {
                    this.$refs.modal.show = true
                    e.preventDefault()
                })
            },
            go() {
                this.$refs.modal.show = false
                window.open(this.theHref)
            }
        },
        components: {
            Modal,
            Container: styled.span``,
            ModalContent: styled.div``,
            ActionsRow: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.modal-content{
    .inner{
        background: #fafafa;
        border: 1px solid #dddddd;
        max-height: 300px;
        overflow-Y: auto;
        word-break: break-all;
    }
}

.actions-row{
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    button{
        outline: 0;
        border: 1px solid transparent;
        border-color: #d9d9d9;
        padding: 4px 15px;
    }
}
</style>