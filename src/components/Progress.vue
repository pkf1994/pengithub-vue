<template>
    <Container class="position-relative overflow-hidden round-1 progress-bar">
        <span class="bg-green height-full d-inline-block v-align-top" :style="{width:donePercent + '%'}"></span><span class="bg-purple height-full d-inline-block v-align-top" :style="{width:inProgressPercent + '%'}"></span>
    </Container>    
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedWidthWrapper} from '@/components'
    export default {
        props: {
            donePercent: {
                type: Number,
                default: 0
            },
            inProgressPercent: {
                type: Number,
                default: 0
            },
        },
        computed: {
            
        },
        components: {
            Container: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.progress-bar {
    display: block;
    overflow: hidden;
    background-color: #eaecef;
    border-radius: 3px;
    height: 10px;
}
</style>