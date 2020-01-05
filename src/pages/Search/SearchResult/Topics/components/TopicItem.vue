<template>
        <Container class="py-4 mx-3 flex">
            <AvatarColumn class="flex-shrink-0 mr-2">
                <router-link v-if="avatarUrl" to="/search">
                    <img :src="avatarUrl" width="20" height="20" class="d-block rounded-1" :alt="topic.name + 'logo'">
                </router-link>
                <DefaultAvatar v-else class="bg-blue-light f4 text-gray-light text-bold rounded-1 text-center"
                               style="width:20px; height:20px; line-height:20px;">#</DefaultAvatar>
            </AvatarColumn>
            <Main class="ml-1  flex-grow-1">
                <Name class="f4 text-normal flex">
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
                            <span>{{topic.viewerHasStarred ? 'Unstar':'Star'}}</span>
                        </button>
                    </StarButton>
                </Name>

                <Description :meta="randomMeta">
                    {{topic.short_description}}
                </Description>

                <MultiInfo class="d-flex flex-wrap text-small text-gray">
                    <AnimatedHeightWrapper>
                        <RepositoryCount class="mr-3" v-if="repositoryCount">
                            {{repositoryCount}} repositories
                        </RepositoryCount>
                        <RelativeTopics v-if="topic.relatedTopics && topic.relatedTopics.length > 0" class="mr-3">
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
    import {util_adjustStyle, util_numberFormat} from '../../../../../util'
    import {
        AnimatedHeightWrapper} from '../../../../../components'
    import {
        WithRandomMetaMixin,
        CancelNetworkOnDestroyMixin} from '../../../../../mixins'
    import {authRequiredGitHubGraphqlApiQuery} from '../../../../../store/modules/network'
    export default {
        mixins: [WithRandomMetaMixin,CancelNetworkOnDestroyMixin],
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
            ...mapState({
                searchQuery: state => state.search.searchQuery
            }),
            repositoryCount: function () {
                return this.topic.repositoryCount && util_numberFormat.thousands2K2M(this.topic.repositoryCount)
            },
            name: function() {
                let name = this.topic.display_name
                if(name && name.trim() !== "") {
                    return name
                }
                return this.topic.name
            },
            relatedRepoStr: function () {
                let str = "Relatived: "
                let length = this.topic.relatedTopics.length
                if(length > 3){
                    return `Relatived: ${this.topic.relatedTopics[0].name}, ${this.topic.relatedTopics[1].name}, ${this.topic.relatedTopics[2].name}, and more`
                }
                this.topic.relatedTopics.forEach((item,index) => {
                    if(index < length - 1)str = `${str}${item.name}, `
                    if(index === length - 1)str = `${str}${item.name}`
                })
                return str
            }
        },
        mounted() {
            util_adjustStyle.highlightKeyword(`[meta=${this.randomMeta}]`,this.searchQuery)
        },
        watch: {
            async topic(newOne,oldOne) {
                if(!oldOne.repositoryCount && newOne.repositoryCount > 1000) {
                    if(newOne.relatedTopics.length > 0 && !this.avatarUrl && !this.loadingAvatarUrl) {
                        this.loadingAvatarUrl = true
                        await this.getAavatarUrl()
                        this.loadingAvatarUrl = false
                        return
                    }
                }
                if(!oldOne.relatedTopics && newOne.relatedTopics.length > 0) {
                    if(newOne.repositoryCount > 1000 && !this.avatarUrl && !this.loadingAvatarUrl) {
                        this.loadingAvatarUrl = true
                        await this.getAavatarUrl()
                        this.loadingAvatarUrl = false
                    }
                }
            }
        },
        methods: {
            async getAavatarUrl() {
                let query = this.topic.name
                let regExp = new RegExp("\\.",'g')
                let graphql = `
                    {
                        search(query: "${query.replace(regExp,"")}", first:1,  type: REPOSITORY) {
                            nodes {
                                ... on Repository {
                                    owner {
                                        avatarUrl
                                    }
                                }
                            }
                        }
                    }
                `
                const res = await authRequiredGitHubGraphqlApiQuery(graphql,{cancelToken: this.source.token})
                console.log(res)
                this.avatarUrl = res.data.data.search.nodes[0].owner.avatarUrl
            }
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