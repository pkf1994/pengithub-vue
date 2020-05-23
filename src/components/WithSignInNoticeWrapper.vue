<template>
    <Container>
        <slot></slot>
           <Modal title="需要登录" ref="modal">
            <ModalContent class="modal-content p-3">
                此页面的数据来自GitHub GraphQL api, 使用该api需要你进行oauth登录。
            </ModalContent>

            <ActionsRow class="actions-row border-top px-3 py-2 clearfix">
                <button class="float-right" @click="goBack">取消</button>
                <button class="float-right" @click="go">好</button>
            </ActionsRow>
        </Modal>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import Modal from './Modal'
    export default {
        methods: {
            show() {
                this.$refs.modal.show = true
            },
            goBack() {
                this.$router.back()
            },
            go() {
                this.signIn()
            }
        },
        components: {
            Modal,
            Container: styled.div``,
            ModalContent: styled.div``,
             ActionsRow: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
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