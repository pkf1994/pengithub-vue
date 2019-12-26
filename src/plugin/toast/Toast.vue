<template>
    <transition name="fade">
        <Container class="container" v-show="show">
            <ToastContent class="toast-content" :class="{warn: type === 'warn',error: type === 'error'}">
                {{toastContent}}
            </ToastContent>
        </Container>
    </transition>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        data() {
            return {
                show: false,
                type: "notice",
                toastContent: "Default Toast",
                duration: 2000
            }
        },
        methods: {
            showToast(toastContent,option = {type: "notice",duration: 2000}) {
                const _this = this
                this.toastContent = toastContent
                this.type = option.type
                this.duration = option.duration
                this.show = true
                setTimeout(() => {
                    _this.show = false
                },this.duration)
            }
        },
        components: {
            Container: styled.div``,
            ToastContent: styled.div``
        }
    }
</script>

<style scoped lang="scss">
.container{
    position: fixed;
    bottom: 24px;
    left: 24px;
    right: 24px;
    z-index: 9;
    display: flex;
    justify-content: center;
    align-content: center;
}

.toast-content{
    line-height: 1.25;
    text-align: center;
    padding: 16px 24px;
    border-radius: 12px;
    background-color: #fafbfc;
    box-shadow: 0 1px 5px rgba(27, 31, 35, 0.15);
    font-size: 20px;
}
.warn{
    background: #FFF8DD;
    color: #EE8F00
}
.error{
    background: #FFEEEE;
    color: #FF0000;
}
</style>