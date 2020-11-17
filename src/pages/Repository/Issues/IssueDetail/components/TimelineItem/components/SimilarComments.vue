<template>
    <Container>
        <div v-if="stretch">
            <Comment v-for="(item,index) in data.comments" :key="index" :data="item"></Comment>
        </div>
    
        <SimilarCommentNotice v-else class="similar-notice text-center mt-2 mb-3" :style="{backgroundImage:`url(${bg})`}">
            <Inner class="d-inline-flex flex-column Box">
                <button class="text-gray py-2 px-4 bg-white border-0 rounded-1" @click="triggerStretch">
                    {{data.comments.length}} similar {{data.comments.length > 1 ? 'comments' : 'comment'}}
                </button>
            </Inner>
        </SimilarCommentNotice>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import Comment from './Comment'
    import {AnimatedHeightWrapper} from '@/components'
    let bg = require('@/assets/image/progressive-disclosure-line@2x.png')
    export default {
       props: {
            data: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
               stretch: false,
               bg:bg
            }
        },
        methods: {
            triggerStretch() {
                this.stretch = !this.stretch
            }
        },
        components: {
            Comment,
            AnimatedHeightWrapper,
            Container: styled.div``,
            SimilarCommentNotice: styled.div``,
            Inner: styled.div``,
        }
    }
</script>

<style scoped lang='scss'>
@import 'node_modules/@primer/css/box/index.scss';
.similar-notice {
    background-color: #fff;
    background-repeat: repeat-x;
    background-position: 0;
    background-size: 32px;
}
</style>