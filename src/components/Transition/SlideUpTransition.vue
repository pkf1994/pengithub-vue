<template>
    <transition name="slide-up" appear>
        <slot></slot>
    </transition>
</template>

<script>

    export default {
    }
</script>

<style scoped>
    .slide-up-enter-active,
    .slide-up-leave-active{
        transition: all .5s
    }

    .slide-up-enter,
    .slide-up-leave-to{
        transform: translateY(100%);
        opacity: 0;
    }
</style>