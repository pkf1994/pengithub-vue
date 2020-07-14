<template>
    <Container>
        <Skeleton v-for="i in [1,2,3,4,5,6,7,8]" :key="i" class="d-flex flex-items-center p-3 border-top">
            <SkeletonCircle :diameter="40"></SkeletonCircle>
            <div class="flex-grow-1 ml-3 my-1">
                <SkeletonRectangle :height="20" style="width:40%"></SkeletonRectangle>
                <SkeletonRectangle :height="16" style="width:70%" class="mt-2"></SkeletonRectangle>
            </div>
        </Skeleton>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {SkeletonRectangle,SkeletonCircle} from '@/components'
    export default {
        components: {
            SkeletonRectangle,
            SkeletonCircle,
            Container: styled.div``,
            Skeleton: styled.div``,
        }
    }
</script>

<style scoped>
</style>
