<template>
    <router-link :to="`/explore/topics/${topic.name}`" class="exploregrid-item d-flex flex-column flex-justify-center p-5">

        <button class="position-absolute top-0 right-0 mt-3 mr-3 bg-white" :class="{'starred':viewerHasStarred,'unstarred':!viewerHasStarred}">
            <svg height="20" class="octicon octicon-star" viewBox="0 0 14 16" version="1.1" width="17" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
        </button>
        <ImgWrapper>
            <img :src="topic.avatar" :alt="`@${topic.displayName}`" width="64" height="64" class="mx-auto rounded-1 mb-3">
        </ImgWrapper>
        <p class="f3 lh-condensed text-center link-gray-dark mb-0 mt-1">
            {{topic.displayName}}
        </p>
        <p class="f5 text-gray text-center mb-0 mt-1">
            {{topic.description}}
        </p>
    </router-link>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ImgWrapper} from '@/components'
    export default {
        inject: ['viewerHasStarredProvided'],
        props: {
            topic: {
                type: Object,
                required: true
            }
        },
        computed: {
            viewerHasStarred() {
                let viewerHasStarredHolder = this.viewerHasStarredProvided().filter(i => i.name == this.topic.name)[0]
                return viewerHasStarredHolder && viewerHasStarredHolder.viewerHasStarred
            }
        },
        components: {
            ImgWrapper,
            Container: styled.div``,
         }
    }
</script>

<style scoped>
.exploregrid-item{
    flex: 1;
    position: relative;
    height: 100%;
    font-size: 14px;
    color: #555;
    border: 1px solid rgba(0,0,0,.075);
    border-bottom-color: rgba(0,0,0,.125);
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 5px 10px rgba(0,0,0,.05);
    transition: border-color .1s ease-in-out,box-shadow .1s ease-in-out;
}

.unstarred {
    color: #d1d5da;
    border: 0;
}

.starred {
    color: #ffd33d;
    border: 0;
}
</style>