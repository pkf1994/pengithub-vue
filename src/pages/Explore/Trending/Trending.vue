<template>
    <Container>
        <Jumbotron title="Trending" :paragraph="jumbotronParagraph"></Jumbotron>

        <Main class="pt-6 relative p-responsive mx-auto">
            <transition appear name="fade">
                <ComplexBubble  v-show="(repositories.data.length > 0 || developers.data.length > 0) || JSON.stringify($route.query) != '{}' || language != 'Any'"
                                :disabledFlag="withEmptyResult"
                                :disabledNotice="`It looks like we don’t have any trending ${meta} for your choices.`">
                    <template v-slot:title>
                        <FilterPane class="Box-header">
                            <PaddingPageTopTab :tabs="tabs" class="mb-3" style="padding:0!important"></PaddingPageTopTab>
                            <AnimatedHeightWrapper>
                                <FilterItem v-if="meta == 'repositories'" @click="() => triggerModal('spokenLanguageModal')" class="pb-3 ml-2 end-with-triangle">
                                    <span>Spoken Language:</span>
                                    <span class="text-bold">{{filterSpokenLanguageList.data.length > 0 ? spokenLanguage : ($route.query.spoken_language_code || 'Any')}}&nbsp;</span>
                                </FilterItem>
                            </AnimatedHeightWrapper>
                            <FilterItem class="mb-3 ml-2 end-with-triangle" @click="() => triggerModal('languageModal')">
                                <span>Language:</span>
                                <span class="text-bold">{{filterLanguageList.data.length > 0 ? language : ($route.query.language || 'Any')}}&nbsp;</span>
                            </FilterItem>
                            <FilterItem class="ml-2 end-with-triangle" @click="() => triggerModal('sinceModal')">
                                <span>Date range:</span>
                                <span class="text-bold">{{dateRange}}&nbsp;</span>
                            </FilterItem>
                        </FilterPane>
                    </template>

                    <transition-group v-if="meta == 'repositories'" name="fade-group" appear>
                        <RepoListItem v-for="item in repositories.data" :key="item.url" :repository="item"></RepoListItem>
                    </transition-group>

                    <transition-group v-else name="fade-group" appear>
                        <DeveloperListItem v-for="item in developers.data" :key="item.username" :developer="item"></DeveloperListItem>
                    </transition-group>
                </ComplexBubble>
            </transition>
        </Main>

        <transition name="fade" appear>
            <CommonLoading  v-if="repositories.loading || developers.loading || repositories.viewerHasStarred.loading || developers.viewerIsFollowing.loading" 
                            :position="(repositories.loading || developers.loading) ? 'center' : 'corner'">
            </CommonLoading>
        </transition>

        <Modal ref="spokenLanguageModal" title="Select a spoken language" :modalStyle="{height:'80vh'}" @show="() => network_getFilterData('filterSpokenLanguageList')">
             <div v-if="filterSpokenLanguageList.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div v-else class="select-menu-text-filter p-3">
                <input type="text" v-model="filterText.spokenLanguage" class="form-control" placeholder="Filter spoken languages" autofocus="" autocomplete="off"/>
            </div>
            <router-link :to='clearSpokenLanguageRouterLink'>
                <SelectMenuItem>
                    <template v-slot:icon>
                        <svg height="16" class="octicon octicon-x select-menu-item-icon mr-2" class_names="select-menu-item-icon" viewBox="0 0 12 16" version="1.1" width="12" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                    </template>
                    <span>Clear spoken language</span>    
                </SelectMenuItem>
            </router-link> 
            <transition-group name="slide-up" appear>
                <router-link class="d-block" v-for="item in spokenLanguageModalRouterLinkData" :key="item.urlParam" :to='item.to'>
                    <SelectMenuItem :selected="spokenLanguage == item.name">
                        <span>{{item.name}}</span>    
                    </SelectMenuItem>
                </router-link> 
            </transition-group>
        </Modal>

        <Modal ref="languageModal" title="Select a language" :modalStyle="{height:'80vh'}" @show="() => network_getFilterData('filterLanguageList')">
             <div v-if="filterLanguageList.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div v-else class="select-menu-text-filter p-3">
                <input type="text" v-model="filterText.language" class="form-control" placeholder="Filter spoken languages" autofocus="" autocomplete="off"/>
            </div>
            <router-link :to='clearLanguageRouterLink'>
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

        <Modal ref="sinceModal" title="Adjust the span" :modalStyle="{height:'80vh'}">
            <router-link class="d-block" v-for="item in sinceModalRouterLinkData" :key="item.urlParam" :to='item.to'>
                <SelectMenuItem :selected="dateRange == item.name">
                    <span>{{item.name}}</span>    
                </SelectMenuItem>
            </router-link> 
        </Modal>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Jumbotron} from '../components'
    import {RepoListItem,DeveloperListItem} from './components'
    import {ComplexBubble,CommonLoading,PaddingPageTopTab,AnimatedHeightWrapper,Modal,SelectMenuItem,LoadingIconEx} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {commonGet,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import {util_queryParse} from '@/util'
    export default {
        name: 'explore_trending_page',
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {
                viewerHasStarredProvided: () => this.repositories.viewerHasStarred.data,
                viewerIsFollowingProvided: () => this.developers.viewerIsFollowing.data,
            }
        },
        props: {
       
        },
        data() {
            return {
                repositories: {
                    data: [],
                    loading: false,
                    viewerHasStarred: {
                        data: [],
                        loading: false
                    },
                },
                developers: {
                    data: [],
                    viewerIsFollowing: {
                        data: [],
                        loading: false
                    },
                    loading: false
                },
                filterText:{
                    spokenLanguage: '',
                    language: '',
                },
                filterSpokenLanguageList: {
                    data: [],
                    loading: false
                },
                filterLanguageList: {
                    data: [],
                    loading: false
                }
            }   
        },
        computed: {
            tabs() {
                return [
                    {
                        label:'Repositories',
                        to: '/explore/trending',
                        activeFlag: this.meta == 'repositories',
                    },
                    {
                        label:'Developers',
                        to: '/explore/trending/developers',
                        activeFlag: this.meta == 'developers',
                    },
                ]
            },
            meta() {
                if(this.$route.path.match(/^\/explore\/trending\/developers/) != null) return 'developers'
                return 'repositories'
            },
            spokenLanguage() {
                let spokenLanguageHolder = this.filterSpokenLanguageList.data.filter( i => {
                    return i["urlParam"] == this.$route.query.spoken_language_code
                })[0]
                if(!spokenLanguageHolder) return 'Any'
                return  spokenLanguageHolder["name"]
            },
            language() {
                if(!this.$route.params.language) return 'Any'
                if(this.filterLanguageList.data.length == 0) return this.$route.params.language
                let languageHolder = this.filterLanguageList.data.filter(i => i.urlParam == this.$route.params.language)[0]
                return languageHolder ? languageHolder.name : 'Unknow'
            },
            since() {
                return this.$route.query.since || 'daily'
            },
            dateRange() {
                switch(this.since) {
                    case "weekly":
                        return 'this week'
                    case "monthly":
                        return 'this month'
                    default:
                        return 'today'
                }
            },
            jumbotronParagraph() {
                if(this.meta == 'developers') return `These are the developers building the hot tools ${this.dateRange}.`
                return `See what the GitHub community is most excited about ${this.dateRange}.`
            },
            spokenLanguageModalRouterLinkData() {
                let data = []
                this.filterSpokenLanguageList.data.filter(i => i.name.toLowerCase().indexOf(this.filterText.spokenLanguage.toLowerCase()) > -1 || i.urlParam.toLowerCase().indexOf(this.filterText.spokenLanguage.toLowerCase()) > -1).forEach( i => {
                    let to = `${this.$route.path}?${util_queryParse.querify({
                        ...this.$route.query,
                        spoken_language_code: i["urlParam"]
                    })}`
                    data.push({
                        to,
                        ...i
                    })
                })
                return data
            },
            languageModalRouterLinkData() {
                let data = []
                this.filterLanguageList.data.filter(i => i.name.toLowerCase().indexOf(this.filterText.language.toLowerCase()) > -1 || i.urlParam.toLowerCase().indexOf(this.filterText.language.toLowerCase()) > -1).forEach( i => {
                    let to = `/explore/trending${this.meta == 'repositories' ? '' : '/developers'}/${i.urlParam}?${util_queryParse.querify(this.$route.query)}`
                    data.push({
                        to,
                        ...i
                    })
                })
                return data
            },
            sinceModalRouterLinkData() {
                let data = []
                let sinceList =
                [
                    {
                        urlParam: 'daily',
                        name: 'today',
                    },
                    {
                        urlParam: 'weekly',
                        name: 'this week',
                    },
                    {
                        urlParam: 'monthly',
                        name: 'this month',
                    },
                ]
                sinceList.forEach(i => {
                    let to = `/explore/trending${this.meta == 'repositories' ? '' : '/developers'}?${util_queryParse.querify({
                        ...this.$route.query,
                        since: i.urlParam
                    })}`
                    data.push({
                         to,
                        ...i
                    })
                })
                return data
            },
            clearSpokenLanguageRouterLink() {
                return `${this.$route.path}?${util_queryParse.querify({
                        ...this.$route.query,
                        spoken_language_code: undefined
                })}`
            },
            clearLanguageRouterLink() {
                return `/explore/trending${this.meta == 'repositories' ? '' : '/developers'}?${util_queryParse.querify(this.$route.query)}`
            },
            withEmptyResult() {
                return this[this.meta].data.length == 0 && !this[this.meta].loading
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this[this.meta].loading = true

                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    
                    let url = api.API_TRENDING(this.meta,{
                        spoken_language_code: this.$route.query.spoken_language_code,
                        language: this.$route.params.language,
                        since: this.$route.query.since
                    })

                    let res = await commonGet(url)
                    this[this.meta].data = res.data

                    if(this.accessToken) {
                        if(this.meta == 'repositories') this.network_getViewerHasStarredInfo()
                        if(this.meta == 'developers') this.network_getViewerIsFollowingInfo()
                    }
                    
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this[this.meta].loading = false
                }
            },
            async network_getViewerHasStarredInfo() {
                try{
                    this.repositories.viewerHasStarred.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_viewer_has_starred')

                    let graphql_viewerHasStarred = graphql.GRAPHQL_VIEWER_HAS_STARRED(this.repositories.data)

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_viewerHasStarred,{cancelToken})

                    let dataHolder 
                    try{
                        dataHolder = res.data.data
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                    let data = []
                    for(let key in dataHolder) {
                        data.push(dataHolder[key])
                    }
                    this.repositories.viewerHasStarred.data = data
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.repositories.viewerHasStarred.loading = false
                }
            },
            async network_getViewerIsFollowingInfo() {
                try{
                    this.developers.viewerIsFollowing.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_viewer_is_following')

                    let graphql_viewerIsFollowing = graphql.GRAPHQL_VIEWER_IS_FOLLOWING(this.developers.data)

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_viewerIsFollowing,{cancelToken})

                    let dataHolder
                    try{
                        dataHolder = res.data.data
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                    let data = []
                    for(let key in dataHolder) {
                        data.push(dataHolder[key])
                    }
                    this.developers.viewerIsFollowing.data = data
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.developers.viewerIsFollowing.loading = false
                }
            },
            async network_getFilterData(meta) {
                if(this[meta].data.length > 0) return
                try{
                    this[meta].loading = true

                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_filter_data' + meta)
                    
                    let url
                    if(meta == 'filterSpokenLanguageList') {
                        url = api.API_ALL_SPOKEN_LANGUAGE
                    }else {
                        url = api.API_ALL_LANGUAGE
                    }

                    let res = await commonGet(url)

                    this[meta].data = res.data
                }catch(e) {
                    this.handleError(e)
                }finally {
                    this[meta].loading = false
                }
            },
            triggerModal(ref) {
                this.$refs[ref].show =true
            },
            routeUpdateHook() {
                this.$refs.spokenLanguageModal.show = false
                this.$refs.languageModal.show = false
                this.$refs.sinceModal.show = false
                this.network_getData()
            },
            showHandler() {
                console.log('show')
            }
        },
        components: {
            Jumbotron,
            ComplexBubble,
            PaddingPageTopTab,
            AnimatedHeightWrapper,
            CommonLoading,
            RepoListItem,
            DeveloperListItem,
            Modal,
            LoadingIconEx,
            SelectMenuItem,
            Container: styled.div``,
            Main: styled.div``,
            FilterPane: styled.div``,
            FilterItem: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
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
</style>