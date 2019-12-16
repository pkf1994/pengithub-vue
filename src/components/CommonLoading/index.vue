<template>
    <Container class="position-fixed width-full height-full">
        <LoadingIcon/>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import LoadingIcon from '../LoadingIcon'
    export default {
        components: {
            LoadingIcon,
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>