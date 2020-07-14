<template>
    <Container>
        <Skeleton class="skeleton d-flex flex-items-center border-bottom p-3" v-for="item in [1,2,3,4,5,6,7,8,9,10]" :key="item">
            <SkeletonRectangle :height="16" :width="16" class="mr-2"></SkeletonRectangle>
            <div class="flex-grow-1">
                <SkeletonRectangle :height="14" :style="{width:`${randomWidth()}%`}"></SkeletonRectangle>
            </div>
        </Skeleton>
    </Container>
</template>

<script>
import styled from 'vue-styled-components'
import {SkeletonRectangle} from '@/components'
export default {
    methods: {
        randomWidth() {
            let width = 0
            while(width < 10 || width > 90) {
                width = (Math.random() * 100).toFixed()
            }
            return width
        }
    },
    components: {
        SkeletonRectangle,
        Container: styled.div``,
        Skeleton: styled.div``,
    }
}
</script>

<style scoped>

</style>