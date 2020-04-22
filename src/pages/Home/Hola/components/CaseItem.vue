<template>
    <Container class="py-2">
        <Inner class="inner round-1 flex-column px-3 pt-3 ">
            <ImgWrapper>
                <img :src="img" class="image round-1 width-fit">
            </ImgWrapper>
            <Title class="h4-mktg pt-3 mb-1 font-inter">{{title}}</Title>
            <SubTitle class="sub-title f6 text-gray">{{subTitle}}</SubTitle>
            <ReadMore class="read-more border-top py-3 text-blue f5-mktg">
                Read more
                <span> →</span>
            </ReadMore>
        </Inner>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components';
    import {ImgWrapper} from '@/components'
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
            ImgWrapper,
            Container: styled.div``,
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

.inner{
    box-shadow: 0 2px 4px rgba(27,31,35,.15);
}

.sub-title{
    margin-bottom: 18px;
}

.read-more{
    display: flex;
    justify-content: space-between;
}
</style>