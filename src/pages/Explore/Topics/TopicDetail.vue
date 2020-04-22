<template>
    <Container class="pt-4 px-3">
        <transition name="fade" appear>
             <Title v-if="rawContent" class="d-flex flex-items-center mb-3">
                <DefaultAvatar v-if="!avatar" style="width: 48px; height: 48; line-height: 48px;" class="border border-black-fade bg-blue-light f4 text-gray-light text-bold rounded-1 flex-shrink-0 text-center mr-3">
                    #
                </DefaultAvatar>
                <ImgWrapper v-else>
                    <img :src="avatar" :alt="`@${displayName}`" height="48" width="48" class="mr-3">
                </ImgWrapper>
                <h1 class="topic-name">{{displayName}}</h1>
            </Title>
        </transition>

        <transition name="fade" appear>
             <Star v-if="rawContent" class="mb-4">
                <button class="btn d-flex flex-items-center">
                    <svg class="octicon octicon-star mr-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                    {{
                        viewerHasStarred ? 'Unstar' : 'Star'
                    }}
                </button>
            </Star>
        </transition>

        <transition name="fade" appear>
            <Description v-if="rawContent" class="border rounded-1 box-shadow bg-white p-4 mb-5">
                <DescriptionAvatar class="mb-4 text-center" v-if='avatar'>
                    <ImgWrapper>
                        <img :src="avatar" alt="displayName" height="100" width="100">
                    </ImgWrapper>
                </DescriptionAvatar>
                
                <DescriptionHTML class="f5 mb-2 markdown-body" v-html="descriptionHTML">

                </DescriptionHTML> 
            </Description>
        </transition>

        <transition name="fade" appear>
              <Title v-if="rawContent" class="text-gray repositories-title">
                    Here are {{formatRepositoyCount}} public repositories matching this topic...
            </Title>
        </transition>
       
        <transition name="fade" appear>
            <FilterRow v-if="rawContent" class="mt-2 mr-3">
                <button class="btn btn-sm  end-with-triangle" @click="() => triggerModal('languageModal')">
                    <span class="text-normal">Language:</span>
                    <span>{{language || 'Any'}}&nbsp;</span>
                </button>
            </FilterRow>
        </transition>
        <transition name="fade" appear>
            <FilterRow v-if="rawContent" class="mt-2 mr-3">
                <button class="btn btn-sm  end-with-triangle"  @click="() => triggerModal('sortModal')">
                    <span class="text-normal">Sort:</span>
                    <span>{{sort}}&nbsp;</span>
                </button>
            </FilterRow>
        </transition>

        <transition-group v-if="rawContent" name="fade-group" appear>
            <RepoListItem v-for="item in repositories.data" :key="item.id" :repository="item"/>
        </transition-group>

        <LoadingMore v-if="repositories.pageInfo.next  && rawContent" :loading="repositories.loading" :dataGetter="() => network_getRepositories(true)"/>

        <transition name="fade" appear>
            <RelatedTopics v-if="relatedTopics && relatedTopics.length > 0 && rawContent" class="mb-4">
                    <Title  class="text-gray repositories-title mb-2">
                        Related Ttopics
                    </Title>
                    <router-link v-for="item in relatedTopics" :key="item" :to="`/explore/topics/${item}`" class="f6 my-1 topic-tag">{{item}}</router-link>
            </RelatedTopics>
        </transition>

        <transition name="fade" appear>
            <CommonLoading v-if="loading || repositories.loading || repositories.extraData.loading" :position="loading ? 'center' : 'corner'"></CommonLoading>
        </transition>

        <Modal ref="languageModal" title="Select a language" :modalStyle="{height:'80vh'}" @show="network_getFilterData">
             <div v-if="repositories.filterLanguageList.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div class="select-menu-text-filter p-3">
                <input type="text" v-model="repositories.filterLanguageList.filterText" class="form-control" placeholder="Filter spoken languages" autofocus="" autocomplete="off"/>
            </div>
            <router-link v-if="language" :to='clearLanguageRouterLink'>
                <SelectMenuItem>
                    <template v-slot:icon>
                        <svg height="16" class="octicon octicon-x select-menu-item-icon mr-2" class_names="select-menu-item-icon" viewBox="0 0 12 16" version="1.1" width="12" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                    </template>
                    <span>Clear language</span>    
                </SelectMenuItem>
            </router-link> 
            <transition-group name="slide-up" appear>
                <router-link class="d-block" v-for="item in languageModalRouterLinkData" :key="item.urlParam" :to='item.to'>
                    <SelectMenuItem :selected="language == item.name">
                        <span>{{item.name}}</span>    
                    </SelectMenuItem>
                </router-link> 
            </transition-group>
        </Modal>

        <Modal ref="sortModal" title="Sort by" :modalStyle="{height:'80vh'}">
            <router-link v-if="`/explore/topics/${topic}` != $route.fullPath" :to='`/explore/topics/${topic}`'>
                <SelectMenuItem>
                    <template v-slot:icon>
                        <svg height="16" class="octicon octicon-x select-menu-item-icon mr-2" class_names="select-menu-item-icon" viewBox="0 0 12 16" version="1.1" width="12" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                    </template>
                    <span>Clear sort</span>    
                </SelectMenuItem>
            </router-link> 
            <transition-group name="slide-up" appear>
                <router-link class="d-block" v-for="item in sortModalRouterLinkData" :key="item.to" :to='item.to'>
                    <SelectMenuItem :selected="sort == item.label">
                        <span>{{item.label}}</span>    
                    </SelectMenuItem>
                </router-link> 
            </transition-group>
        </Modal>

    </Container>
</template>

<script>
    import {util_markdownParse,util_queryParse,util_numberFormat} from '@/util'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {CommonLoading,Modal,LoadingIconEx,SelectMenuItem,ImgWrapper} from '@/components'
    import {LoadingMore} from '../components'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    import styled from 'vue-styled-components'
    import {RepoListItem} from './components'
    import {authRequiredGitHubGraphqlApiQuery,commonGet,authRequiredGet} from '@/network'
    var parse = require('parse-link-header');
    export default {
        name: 'explore_topic_detail_page',
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {
                repositoriesExtraDataProvided: () => this.repositories.extraData.data
            }
        },
        data() {
            return {
                rawContent: '',
                viewerHasStarred: false,
                avatar: undefined,
                loading: false,
                repositories: {
                    data: [],
                    loading: false,
                    totalCount: 0,
                    perPage: 10,
                    pageInfo: {},
                    filterLanguageList: {
                        data: [],
                        filterText: '',
                        loading: false
                    },
                    extraData: {
                        data: [],
                        loading: false
                    }
                }
            }
        } ,
        computed: {
            topic() {
                return this.$route.params.topic
            },
            formatRepositoyCount() {
                return util_numberFormat.thousands(this.repositories.totalCount)
            },
            displayName() {
                let magicArr = this.rawContent.split('\n')
                let displayNameHolder = magicArr.filter(i => i.match(/^display_name:/) != null)[0]
                return displayNameHolder && displayNameHolder.replace("display_name: ","")
            },
            descriptionHTML() {
                let descriptionMarkdownRaw = this.rawContent.split('---').pop().replace('\n','')
                return util_markdownParse.markdownToHTML(descriptionMarkdownRaw)
            },
            relatedTopics() {
                let magicArr = this.rawContent.split('\n')
                let relatedTopicsHolder = magicArr.filter(i => i.match(/^related:/) != null)[0]
                return relatedTopicsHolder && relatedTopicsHolder.replace("related: ","").split(', ')
            },
            language() {
                if(!this.$route.query.language) return
                if(this.repositories.filterLanguageList.data.length == 0) return this.$route.query.language
                let languageHolder = this.repositories.filterLanguageList.data.filter(i => i.urlParam == this.$route.query.language)[0]
                return languageHolder && languageHolder.name
            },
            clearLanguageRouterLink() {
                return `/explore/topics/${this.topic}?${util_queryParse.querify({
                    order: this.$route.query.order,
                    sort: this.$route.query.sort
                })}`
            },
            languageModalRouterLinkData() {
                let data = []
                this.repositories.filterLanguageList.data.filter(i => i.name.indexOf(this.repositories.filterLanguageList.filterText) > -1 || i.urlParam.indexOf(this.repositories.filterLanguageList.filterText) > -1).forEach( i => {
                    let to = `/explore/topics/${this.topic}?${util_queryParse.querify({
                        ...this.$route.query,
                        language: i.urlParam
                    })}`
                    data.push({
                        to,
                        ...i
                    })
                })
                return data
            },
            sortModalRouterLinkData() {
                return [
                    {
                        label: 'Best match',
                        to: `/explore/topics/${this.topic}?${util_queryParse.querify({
                            language: this.$route.query.language
                        })}`
                    },
                    {
                        label: 'Most stars',
                        to: `/explore/topics/${this.topic}?${util_queryParse.querify({
                            order: 'desc',
                            sort: 'stars',
                            language: this.$route.query.language
                        })}`
                    },
                    {
                        label: 'Least stars',
                        to: `/explore/topics/${this.topic}?${util_queryParse.querify({
                            order: 'asc',
                            sort: 'stars',
                            language: this.$route.query.language
                        })}`
                    },
                    {
                        label: 'Most forks',
                        to: `/explore/topics/${this.topic}?${util_queryParse.querify({
                            order: 'desc',
                            sort: 'forks',
                            language: this.$route.query.language
                        })}`
                    },
                    {
                        label: 'Least forks',
                        to: `/explore/topics/${this.topic}?${util_queryParse.querify({
                            order: 'asc',
                            sort: 'forks',
                            language: this.$route.query.language
                        })}`
                    },
                    {
                        label: 'Recently updated',
                        to: `/explore/topics/${this.topic}?${util_queryParse.querify({
                            order: 'desc',
                            sort: 'updated',
                             language: this.$route.query.language
                        })}`
                    },
                    {
                        label: 'Least recently updated',
                        to: `/explore/topics/${this.topic}?${util_queryParse.querify({
                            order: 'asc',
                            sort: 'updated',
                             language: this.$route.query.language
                        })}`
                    },
                ]
            },
            sort() {
                let order = this.$route.query.order
                let sort = this.$route.query.sort
                if(sort == 'stars' && (order == 'desc' || order == undefined || order == '')) return 'Most stars'
                if(sort == 'stars' && order == 'asc') return 'Least stars'
                if(sort == 'forks' && (order == 'desc' || order == undefined || order == '')) return 'Most forks'
                if(sort == 'forks' && order == 'asc') return 'Least stars'
                if(sort == 'updated' && (order == 'desc' || order == undefined || order == '')) return 'Recently updated'
                if(sort == 'updated' && order == 'asc') return 'Least recently updated'
                return 'Best match'
            }
        },
        created() {
            this.network_getData()
            this.network_getRepositories()
        },
        methods: {
             async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let graphql_topicSketchAndRaw = graphql.GRAPHQL_TOPIC_SKETCH_AND_RAW(this.topic)
                    let res_topicSketchAndRaw = await authRequiredGitHubGraphqlApiQuery(graphql_topicSketchAndRaw,{cancelToken})
                    res_topicSketchAndRaw.data.data.repository.sketch.entries.forEach(i => {
                        if(i.name.match(/\.png$/) != null) this.avatar = `https://raw.githubusercontent.com/github/explore/master/topics/${this.topic}/${i.name}`
                    })
                    this.rawContent = res_topicSketchAndRaw.data.data.repository.raw.text
                    this.viewerHasStarred = res_topicSketchAndRaw.data.data.topic.viewerHasStarred
                    //this.network_getRepositories()
                    this.loading = false
                }catch(e) {
                    this.$toast(e,'error')
                    this.loading = false
                    console.log(e)
                }
            },
            async network_getFilterData() {
                if(this.repositories.filterLanguageList.data.length > 0) return
                try{
                    this.repositories.filterLanguageList.loading = true

                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_filter_data')
                    
                    let url = api.API_ALL_LANGUAGE

                    let res = await commonGet(url)

                    this.repositories.filterLanguageList.data = res.data
                    this.repositories.filterLanguageList.loading = false
                }catch(e) {
                    this.$toast(e,'error')
                    console.log(e)
                    this.repositories.filterLanguageList.loading = false
                }
            },
            async network_getRepositories(loadingMoreFlag) {
                 try{
                    this.repositories.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_repositories')

                    let url
                    if(!loadingMoreFlag) {
                        url = api.API_SEARCH(
                            'repositories',
                            {
                                q: `topic:${this.topic} ${this.language ? 'language:' + this.language : ''}`.trim(),
                                per_page: this.repositories.perPage,
                                ...this.$route.query
                            }
                        )
                    } else {
                        url = this.repositories.pageInfo.next.url
                    }
                

                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken,
                            headers: {
                                "Accept": "application/vnd.github.mercy-preview+json"
                            }
                        }
                    )
                    this.repositories.pageInfo = parse(res.headers.link) || {}
                    
                    if(!loadingMoreFlag) {
                        this.repositories.data = res.data.items
                    } else {
                        this.repositories.data = this.repositories.data.concat(res.data.items)    
                    }
                    this.repositories.totalCount = res.data.total_count
                    this.network_getRepositoriesExtraData(res.data.items)

                    this.repositories.loading = false
                }catch(e) {
                    this.$toast(e,'error')
                    this.repositories.loading = false
                    console.log(e)
                }
            },
            async network_getRepositoriesExtraData(payload) {
                  try{
                    this.repositories.extraData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_repositories_extra_data')

                    let graphql_repositories = graphql.GRAPHQL_TOPIC_REPOS(payload)

                    let res_repositories = await authRequiredGitHubGraphqlApiQuery(graphql_repositories,{cancelToken})
                    this.repositories.extraData.data = this.repositories.extraData.data.concat(res_repositories.data.data.nodes)
                    this.repositories.extraData.loading = false
                }catch(e) {
                    this.$toast(e,'error')
                    this.repositories.extraData.loading = false
                    console.log(e)
                }
            },
            triggerModal(ref) {
                this.$refs[ref].show =true
            },
            routeUpdateHook() {
                this.$refs.languageModal.show = false
                this.$refs.sortModal.show = false
                this.network_getData()
                this.network_getRepositories()
            },
            triggerModal(ref) {
                this.$refs[ref].show =true
            },
        },
        components: {
            CommonLoading,
            LoadingMore,
            Modal,
            SelectMenuItem,
            ImgWrapper,
            LoadingIconEx,
            RepoListItem,
            Container: styled.div``,
            Title: styled.div``,
            DefaultAvatar: styled.div``,
            Star: styled.div``,
            Description: styled.div``,
            DescriptionAvatar: styled.div``,
            DescriptionHTML: styled.div``,
            Repositories: styled.div``,
            FilterRow: styled.div``,
            RelatedTopics: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/markdown/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
.topic-name{
    font-family: Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
    font-weight: 500;
}

.repositories-title{
    font-size: 18px!important;
    font-family: Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
    font-weight: 500;
}

.select-menu-text-filter{
    position: sticky;
    top: 0px;
    background-color: #f6f8fa;
    border-bottom: 1px solid #dfe2e5;
    input {
        display: block;
        width: 100%;
        max-width: 100%;
        padding: 5px;
        border: 1px solid #dfe2e5;
        border-radius: 3px;
    }
}

.topic-tag {
    display: inline-block;
    padding: .3em .9em;
    margin: 0 .5em .5em 0;
    white-space: nowrap;
    background-color: #f1f8ff;
    border-radius: 3px;
}
</style>