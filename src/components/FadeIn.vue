<template>
    <transition name="fade">
        <div v-show="show">
            <slot></slot>
        </div>
    </transition>
</template>

<script>
    export default {
        data:() => ({
            show: false
        }),
        mounted() {
            this.show = true
        }
    }
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active{
    transition: opacity .5s
}

.fade-enter,
.fade-leave-to{
    opacity: 0;
}
</style>