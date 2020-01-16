<template>
    <Container>
        <span v-for="(item,index) in currentPath.split('/')" 
        :key="item + index">{{item}}</span>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            currentPath: {
                type: String,
                defaule: ''
            }
        },
        components: {
            Container: styled.span``
        }
    }
</script>

<style scoped>

</style>