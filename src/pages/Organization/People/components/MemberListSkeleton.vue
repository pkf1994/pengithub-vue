<template>
    <Container>
        <Skeleton v-for="item in [1,2,3,4,5]" :key="item" class='d-flex flex-items-center member-item border-bottom'  style="height:90px"> 
            <SkeletonCircle :diameter="48" class="mr-3"></SkeletonCircle>
            <div>
                <SkeletonRectangle :height="16" style="width: 90px"></SkeletonRectangle>
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

<style scoped>
.member-item:first-child{
    border-top: 1px #e1e4e8 solid;
}
</style>