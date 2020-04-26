<template>
    <router-link class="d-flex border-bottom border-gray-light pb-4 mb-5" :to="`/explore/topics/${topic.name}`">
        <DefaultAvatar v-if="!topic.avatar" class="bg-blue-light f4 text-gray-light text-bold rounded-1 flex-shrink-0 text-center mr-3" style="height:64px; width:64px; line-height:64px">#</DefaultAvatar>
        <ImgWrapper v-else>
            <img class="mr-3" :src="topic.avatar" :alt="`@${topic.displayName}`" width="64" height="64">
        </ImgWrapper>
        <Main class="flex-auto">
            <p class="f3 link-gray-dark mb-0">
                {{topic.displayName}}
            </p>
            <p class="text-gray f5 mb-0 mt-1">
                {{topic.description}}
            </p>   

            <button class="btn d-flex flex-items-center js-toggler-target btn-sm mt-2">
                <svg class="octicon octicon-star mr-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                {{viewerHasStarred ? 'Unstar' : 'Star'}}
            </button>  
        </Main>
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
            AvatarColumn: styled.div``,
            DefaultAvatar: styled.div``,
            Main: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/buttons/index.scss';

</style>