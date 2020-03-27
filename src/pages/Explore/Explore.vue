<template>
    <Container>
        <TopTab class="border-bottom"></TopTab>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {TopTab} from './components'
    export default {
        components: {
            TopTab,
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>