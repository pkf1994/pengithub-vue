<template>
    <div>
        <div v-for="item in magicArr" :key="item" class="d-flex px-3 flex-items-start border-top" style="padding-top: 14px;padding-bottom:14px">
            <div>
                <SkeletonRectangle :height="16" :width="12">
                </SkeletonRectangle>
            </div>
            <div class="ml-2" style="width: 100%;">
                <SkeletonRectangle :height="14" style="width: 100%">
                </SkeletonRectangle>
                <SkeletonRectangle class="mt-2" :height="14" style="width: 60%">
                </SkeletonRectangle>
            </div> 
        </div>
    </div>
     
</template>

<script>
    import styled from 'vue-styled-components'
    import {SkeletonCircle, SkeletonRectangle} from '../ComponentSkeleton'
    export default {
        props: {
            perPage: {
                type: Number,
                default: 8
            }
        },
        computed: {
            magicArr() {
                let arr = []
                while(arr.length < this.perPage) {
                    arr.push(arr.length + 1)
                }
                return arr
            }
        },
        components: {
            SkeletonCircle, 
            SkeletonRectangle,
            Container: styled.div``
        }
    }
</script>

<style scoped>
</style>