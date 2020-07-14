<template>
    <CommonLoadingWrapper :loading="loading || extraData.loading" :position="loading ? 'center' : 'corner'" class="px-3">
        <transition name="fade" appear>
            <PaddingPageTopTab class="subnav" style="margin-right:-16px;margin-left:-16px;" :tabs="tabs"></PaddingPageTopTab>
        </transition>  
       
        <div class="Box" v-if="firstLoadedFlag && data.length > 0">
            <div class="Box-header">
                <h3 class="Box-title">
                    <svg class="octicon octicon-tag" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
                    Tags
                </h3>
            </div>

             <transition-group name="fade-group" appear>
                <TagListItem v-for="item in data" :key="item.name" :tag="item"></TagListItem>
            </transition-group>
        </div>
        <SimplePaginationRest v-if="firstLoadedFlag && (pageInfo.prev || pageInfo.next)" :loading="loading" :pageInfo="pageInfo"></SimplePaginationRest>

         <transition name="fade" appear>
            <Blankslate v-if="isEmpty" class="blankslate border-top">
                <svg height="32" class="octicon octicon-tag blankslate-icon" viewBox="0 0 15 16" version="1.1" width="30" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
                <h3>There aren’t any tags here</h3>
                <p>Tags are powered by 
                    <HyperlinkWrapper>
                        <a href="https://git-scm.com/book/en/Git-Basics-Tagging">tagging specific points of history</a> 
                    </HyperlinkWrapper> 
                    in a repository. They’re great for marking tags points like 
                    <code>v1.0</code>.
                </p>
            </Blankslate>
        </transition>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {PaddingPageTopTab,SimplePaginationRest,CommonLoadingWrapper} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as api from '@/network/api'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import {TagListItem} from './components'
    import * as graphql from './graphql'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_tags_page',
        inject: ['repo','owner'],
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {
                extraDataProvided: () => this.extraData.data
            }
        },
        data() {
            return {
                data: [],
                perPage: 10,
                isEmpty: false,
                loading: false,
                pageInfo: {},
                firstLoadedFlag:false,
                extraData: {
                    data: [],
                    loading: false
                },
                
            }
        },
        computed: {
            tabs() {
                return [
                    {
                        label: 'Releases',
                        to: `/${this.owner()}/${this.repo()}/releases`
                    },
                    {
                        label: 'Tags',
                        to: `/${this.owner()}/${this.repo()}/tags`,
                        activeFlag: true
                    },
                ]
            },
            documentTitle() {
                return `Tags · ${this.owner()}/${this.repo()}`
            }
        }, 
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_REPOSITORY_TAGS(this.owner(),this.repo(),{
                        per_page: this.perPage,
                        ...this.$route.query
                    })
                    let res = await authRequiredGet(
                        url,
                        {cancelToken}
                    )
                    if(window) window.scrollTo(0,0)
                    this.data = res.data
                    this.isEmpty = false
                    if(res.data.length == 0) this.isEmpty = true
                    this.pageInfo = parse(res.headers.link) || {}
                    this.firstLoadedFlag = true
                    if(this.accessToken) this.network_getExtraData()
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
             async network_getExtraData() {
                try{
                    this.extraData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_extra_data')
                    let graphql_extraData = graphql.GRAPHQL_TAGS(this.data)
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_extraData,{cancelToken})
                    let dataHolder
                    try{
                        dataHolder =  res.data.data
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                    let extraData = []
                    for(let key in dataHolder) {
                        extraData.push(dataHolder[key])
                    }
                    this.extraData.data = extraData
                }catch(e) {
                    console.log(e)
                }finally{
                    this.extraData.loading = false
                }
            },
           /*  scrollToTop() {
                if(window) window.scrollTo(0,0)
            } */
        },
       
        components: {
            TagListItem,
            PaddingPageTopTab,
            SimplePaginationRest,
            CommonLoadingWrapper,
            Container: styled.div``,
            Blankslate: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/navigation/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/blankslate/index.scss';
</style>