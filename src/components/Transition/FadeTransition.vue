<template>
    <transition name="fade" appear>
        <slot></slot>
    </transition>
</template>

<script>

    export default {
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