<template>
    <Container>
        <div v-for="item in [1,2,3,4,5]" :key="item" class="p-3 border-bottom">
            <SkeletonRectangle :height="18" style="width:20%"></SkeletonRectangle>
            <SkeletonRectangle class="mt-2" :height="16" style="width:40%"></SkeletonRectangle>
            <SkeletonRectangle class="mt-2" :height="16" style="width:50%"></SkeletonRectangle>
            <SkeletonRectangle class="mt-2" :height="16" style="width:100%"></SkeletonRectangle>
            <SkeletonRectangle class="mt-2" :height="16" style="width:60%"></SkeletonRectangle>
        </div>
    </Container>
</template>

<script>
import styled from 'vue-styled-components'
import {SkeletonCircle,SkeletonRectangle} from '@/components'
export default {
    components: {
        SkeletonCircle,
        SkeletonRectangle,
        Container: styled.div``
    }
}
</script>

<style scoped>
</style>