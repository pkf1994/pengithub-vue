<template>
    <Container>
        <Skeleton class="py-4 border-bottom" v-for="item in [1,2,3,4,5,6,7,8]" :key="item">
            <button class="btn btn-sm float-right" style="width:65px">
                &nbsp;
            </button>
            <div class="d-flex">
                <SkeletonCircle :diameter="50" class="col-2"></SkeletonCircle>    

                <div class="col-10">
                    <SkeletonRectangle :height="20" class="width-full"></SkeletonRectangle>
                </div>    
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