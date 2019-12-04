<template>
    <Container class="pv-2">
        <Inner class="flex-column ph-3 pt-3">
            <img :src="img" class="image round-1">
            <Title>{{title}}</Title>
            <SubTitle>{{subTitle}}</SubTitle>
            <ReadMore>Read more →</ReadMore>
        </Inner>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components';
    export default {
        props: {
            img: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            subTitle: {
                type: String,
                required: true
            }
        },
        components: {
            Container: styled.a``,
            Title: styled.h1``,
            SubTitle: styled.p``,
            ReadMore: styled.div``,
            Inner: styled.div``
        }
    }
</script>

<style scoped>
.image{
    flex-grow: 1;
    height: 200px;
    object-fit: cover;
    box-sizing: border-box;
}
</style>