<template>
    <Container class="container flex" :style="containerStyle">
        <Column :class="{column:!simple}">
            <Title  class="h3 font-inter title mb-1 w-400">
                {{title}}
            </Title>
            <Paragraph class="f5 text-gray">
                {{paragraph}}
                <TheLink v-if="!simple" class="link">{{theLink}}</TheLink>
            </Paragraph>
        </Column>
        <svg v-if="!simple" class="text-blue" viewBox="0 0 6 16" version="1.1" width="6" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 14l6-6-6-6v12z"></path></svg>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'

    export default {
        props: {
            title: {
                type:String,
                required: true
            },
            paragraph: {
                type:String,
                required: true
            },
            theLink: {
                type:String,
                required: true
            },
            simple: {
                type: Boolean,
                default:false
            }
        },
        data(){
            return {
                containerStyle: {
                    borderWidth: this.simple ? '0px' : '1px'
                }
            }
        },
        components: {
            Container: styled.div``,
            Column: styled.div``,
            Title: styled.h3``,
            Paragraph: styled.p``,
            TheLink: styled.span``
        }
    }
</script>

<style scoped>
    .container{
        justify-content: space-between;
        align-items: center;
        border: 1px solid transparent;
    }
    .column{
        width: 83.3333%
    }
    .title{

    }
</style>