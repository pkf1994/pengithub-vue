<template>
    <Container class="container position-fixed flex-row-center">
        <Inner :class="size">
            <img alt="loading"
                 class="width-fit height-fit"
                 src="../../assets/image/octocat-spinner-128.gif"/>
        </Inner>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import LoadingIcon from '../LoadingIcon'
    export default {
        props: {
            size: {
                type: String,
                default: "middle"
            }
        },
        components: {
            LoadingIcon,
            Container: styled.div``,
            Inner: styled.div``
        }
    }
</script>

<style scoped>
.container{
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
.small{
    height: 20px;
    width: 20px;
}
.middle{
    height: 45px;
    width: 45px;
}
.small{
    height: 60px;
    width: 60px;
}
</style>