<template>
    <Container>
        <Skeleton v-for="item in [1,2,3,4]" :key="item">
            <div class="Box p-3 mb-3">
                <div class="d-flex flex-items-center">
                    <SkeletonCircle :diameter="16" class="mr-2"></SkeletonCircle>
                    <SkeletonRectangle :height="16" :minWidthPercent="30" :maxWidthPercent="50"></SkeletonRectangle>
                </div>
                <SkeletonRectangle :height="14" class="mt-3" :minWidthPercent="60" :maxWidthPercent="100"></SkeletonRectangle>
                <div class="mt-4 d-flex flex-wrap">
                    <div class="d-flex flex-items-center mb-1 mr-3">
                        <SkeletonCircle :diameter="12" class="mr-2"></SkeletonCircle>
                        <SkeletonRectangle :height="10" :width="50"></SkeletonRectangle>
                    </div>
                    <div class="d-flex flex-items-center mb-1 mr-3">
                        <SkeletonCircle :diameter="12" class="mr-2"></SkeletonCircle>
                        <SkeletonRectangle :height="10" :width="40"></SkeletonRectangle>
                    </div>
                    <div class="d-flex flex-items-center mb-1">
                        <SkeletonCircle :diameter="12" class="mr-2"></SkeletonCircle>
                        <SkeletonRectangle :height="10" :width="40"></SkeletonRectangle>
                    </div>
                </div>
            </div>
        </Skeleton>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {SkeletonCircle,SkeletonRectangle} from '@/components'
    export default {

        components: {
            SkeletonCircle,
            SkeletonRectangle,
            Container: styled.div``,
            Skeleton: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
</style>