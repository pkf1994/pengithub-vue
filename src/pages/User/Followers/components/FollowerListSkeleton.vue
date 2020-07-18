<template>
    <Container>
        <Skeleton class="py-4 border-bottom" v-for="item in [1,2,3,4,5,6,7,8]" :key="item">
          
            <div class="d-flex">
                <SkeletonCircle :diameter="50" class="col-2 mr-2"></SkeletonCircle>    

                <div class="col-10">
                      <button class="btn btn-sm float-right" style="width:55px">
                        &nbsp;
                    </button>
                    <SkeletonRectangle :maxWidth="150" :minWidth="90" :height="16" :width="120"></SkeletonRectangle>
                    <SkeletonRectangle :maxWidth="150" :minWidth="90" :height="12" :width="100" style="margin-top:12px"></SkeletonRectangle>
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

<style scoped lang="scss">
@import 'node_modules/@primer/css/layout/index.scss';
</style>