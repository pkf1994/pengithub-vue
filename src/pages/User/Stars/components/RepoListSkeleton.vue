<template>
    <Container>
        <Skeleton class="py-4 border-bottom" v-for="item in [1,2,3,4,5,6,7,8]" :key="item">
            <button class="btn btn-sm float-right" style="width:65px">
                &nbsp;
            </button>
            <SkeletonRectangle :height="24" style="width:40%"></SkeletonRectangle>
            <SkeletonRectangle :height="14" style="width:60%" class="mt-3"></SkeletonRectangle>
            <div class="d-flex flex-wrap f6" style="margin-top:12px">
                <span class="topic-tag" style="width:80px">&nbsp;</span>
                <span class="topic-tag" style="width:80px">&nbsp;</span>
                <span class="topic-tag" style="width:80px">&nbsp;</span>
            </div>
            <div class="d-flex flex-items-center flex-wrap mt-2">
                <SkeletonCircle :diameter="12" class="mr-2"></SkeletonCircle>
                <SkeletonRectangle :height="12" style="width:50px" class="mr-4"></SkeletonRectangle>
                <SkeletonCircle :diameter="12" class="mr-2"></SkeletonCircle>
                <SkeletonRectangle :height="12" style="width:40px" class="mr-4"></SkeletonRectangle>
                <SkeletonRectangle :height="12" style="width:120px"></SkeletonRectangle>
            </div>
        </Skeleton>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {SkeletonRectangle,SkeletonCircle} from '@/components'
    export default {
        components: {
            SkeletonCircle,
            SkeletonRectangle,
            Container: styled.div``,
            Skeleton: styled.div``,
        }
    }
</script>

<style scoped>
.topic-tag {
    display: inline-block;
    padding: .3em .9em;
    margin: 0 .5em .5em 0;
    white-space: nowrap;
    background-color: #f1f8ff;
    border-radius: 3px;
}
</style>