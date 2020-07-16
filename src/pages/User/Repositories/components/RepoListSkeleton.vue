<template>
    <Container>
        <Skeleton class="py-4 border-bottom" v-for="item in [1,2,3,4,5,6,7,8]" :key="item">
            <button class="btn btn-sm float-right" style="width:65px">
                &nbsp;
            </button>
            <SkeletonRectangle :height="24" style="width:40%"></SkeletonRectangle>
            <SkeletonRectangle :height="14" style="width:60%" class="mt-3"></SkeletonRectangle>
            <SkeletonRectangle :height="14" style="margin-top:12px" class="width-full"></SkeletonRectangle>
        </Skeleton>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {SkeletonRectangle} from '@/components'
    export default {
        components: {
            SkeletonRectangle,
            Container: styled.div``,
            Skeleton: styled.div``,
        }
    }
</script>

<style scoped>
</style>