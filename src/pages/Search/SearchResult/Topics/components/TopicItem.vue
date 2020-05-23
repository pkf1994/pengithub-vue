<template>
        <Container class="py-4 mx-3 d-flex">
            
           <!--  <AvatarColumn class="flex-shrink-0 mr-2">
                <router-link v-if="avatarUrl" to="/search">
                    <img :src="avatarUrl" width="20" height="20" class="d-block rounded-1" :alt="topic.name + 'logo'">
                </router-link>
                <DefaultAvatar v-else class="bg-blue-light f4 text-gray-light text-bold rounded-1 text-center"
                               style="width:20px; height:20px; line-height:20px;">#</DefaultAvatar>
            </AvatarColumn> -->
            <Main class="ml-1  flex-grow-1">
                <Name class="f4 text-normal d-flex">
                    <router-link to="/search" :meta="randomMeta">{{name}}</router-link>
                    <StarButton class="text-right flex-auto">
                        <button class="btn btn-sm">
                            <svg class="v-align-text-top d-inline-block mr-1"
                                 fill="currentColor"
                                 viewBox="0 0 14 16"
                                 version="1.1"
                                 width="14"
                                 height="16"
                                 aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                            <span>{{relatedTopicsAndViewerStarStatus.viewerHasStarred ? 'Unstar':'Star'}}</span>
                        </button>
                    </StarButton>
                </Name>

                <Description v-if="topic.short_description" :meta="randomMeta">
                    {{topic.short_description}}
                </Description>

                <MultiInfo class="d-flex flex-wrap text-small text-gray">
                    <AnimatedHeightWrapper>
                        <RepositoryCount class="mr-3" v-if="repositoryCount">
                            {{repositoryCount}} repositories
                        </RepositoryCount>
                        <RelativeTopics v-if="relatedTopicsAndViewerStarStatus && relatedTopicsAndViewerStarStatus.relatedTopics.length > 0" class="mr-3">
                            {{relatedRepoStr}}
                        </RelativeTopics>
                    </AnimatedHeightWrapper>
                </MultiInfo>
            </Main>
        </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {mapState} from "vuex";
    import {util_adjustStyle, util_numberFormat} from '@/util'
    import {
        AnimatedHeightWrapper} from '@/components'
    import {
        WithRandomMetaMixin,
        CancelNetworkOnDestroyMixin} from '@/mixins'
    export default {
        mixins: [WithRandomMetaMixin,CancelNetworkOnDestroyMixin],
        inject: ['query','topicExtraDataProvided'],
        props: {
            topic: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                avatarUrl: undefined,
                loadingAvatarUrl: false
            }
        },
        computed: {
            repositoryCount: function () {
                let repositoryCount = this.topicExtraDataProvided().repositoryCount.filter(i => i.name == this.topic.name)[0]
                return repositoryCount && util_numberFormat.thousands2K2M(repositoryCount.repositoryCount)
            },
            name: function() {
                let name = this.topic.display_name
                if(name && name.trim() !== "") {
                    return name
                }
                return this.topic.name
            },
            relatedTopicsAndViewerStarStatus() {
                return this.topicExtraDataProvided().relatedTopicsAndViewerStarStatus.filter(i => i.name == this.topic.name)[0]
            },
            relatedRepoStr: function () {
                
                let str = "Relatived: "
                try{
                    let length = this.relatedTopicsAndViewerStarStatus && this.relatedTopicsAndViewerStarStatus.relatedTopics.length
                    if(length > 3){
                        return `Relatived: ${this.relatedTopicsAndViewerStarStatus.relatedTopics[0].name}, ${this.relatedTopicsAndViewerStarStatus.relatedTopics[1].name}, ${this.relatedTopicsAndViewerStarStatus.relatedTopics[2].name}, and more`
                    }
                    this.relatedTopicsAndViewerStarStatus.relatedTopics.forEach((item,index) => {
                        if(index < length - 1)str = `${str}${item.name}, `
                        if(index === length - 1)str = `${str}${item.name}`
                    })
                }catch(e) {
                    console.log(e)
                }
                
                return str
            }
        },
        mounted() {
            util_adjustStyle.highlightKeyword(`[meta=${this.randomMeta}]`,this.query())
        },
        components: {
            AnimatedHeightWrapper,
            Container: styled.div``,
            AvatarColumn: styled.div``,
            DefaultAvatar: styled.div``,
            Main: styled.div``,
            Name: styled.div``,
            StarButton: styled.div``,
            Description: styled.p``,
            MultiInfo: styled.div``,
            RepositoryCount: styled.div``,
            RelativeTopics: styled.div``,
        }
    }
</script>

<style scoped>

</style>