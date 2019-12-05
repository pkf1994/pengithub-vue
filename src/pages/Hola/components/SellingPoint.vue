<template>
    <SellingPoint class="py-7">
        <Main class="pb-6 px-3 flex-column-center">
            <SellingPointTitle class="text-gray h4-mktg text-center font-mono lh-15">
                {{title}}
            </SellingPointTitle>

            <SellingPointSubTitle class="h1-mktg text-center font-inter lh-125 mt-3 mb-2">
                {{subTitle}}
            </SellingPointSubTitle>

            <SellingPointParagraph class="f2-mktg text-center font-inter text-gray lh-15 mb-4">
                {{paragraph}}
            </SellingPointParagraph>

            <Button v-if="btnTitle" inline :style="btnStyle" class="btn-primary-blue-outline px-5 w-500 " >
                {{btnTitle}}
            </Button>
        </Main>


        <slot></slot>
    </SellingPoint>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Button} from '../../../components'
    export default {
        props: {
            title: {
                type: String,
                required: true
            },
            subTitle: {
                type: String,
                required: true
            },
            paragraph: {
                type: String,
                required: true
            },
            btnTitle: {
                type: String
            }
        },
        data() {
            return {
                btnStyle: {
                    paddingTop: '20px',
                    paddingBottom: '20px',
                }
            }
        },
        components: {
            Button,

            SellingPoint: styled.div``,
            SellingPointTitle: styled.div``,
            SellingPointSubTitle: styled.div``,
            SellingPointParagraph: styled.div``,
            Main: styled.div``
        }
    }
</script>

<style scoped>

</style>