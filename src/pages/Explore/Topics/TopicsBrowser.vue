<template>
    <Container>
        <Jumbotron title="Topics" paragraph="Browse popular topics on GitHub.">
        </Jumbotron>

        <Highlight  class="px-3 pt-6">
            <transition-group name="fade-group" appear>
                <TopicHighlightListItem class="mb-4" v-for="item in highlight.data" :key="item.displayName" :topic="item"></TopicHighlightListItem>
            </transition-group>
        </Highlight>

        <Main class="px-3 pt-6">
            <transition-group name="fade-group" appear>
                <TopicListItem v-for="item in data.slice(0,cursor)" :key="item.displayName" :topic="item"></TopicListItem>
            </transition-group>
            <LoadingMore v-if="data.filter(i => i.content).length > 0 &&  cursor <= data.length" :loading="loading" :dataGetter="network_getData"/>
        </Main>

        <transition name="fade" appear>
            <CommonLoading v-if="loadingRoster || (loading && data.filter(i => i.content).length == 0) || highlight.loading"></CommonLoading>
        </transition>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Jumbotron,LoadingMore} from '../components'
    import {TopicListItem,TopicHighlightListItem} from './components'
    import {CommonLoading} from '@/components'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet} from '@/network'
    import Vue from 'vue'
    export default {
        name: 'topics__browser_page',
        provide() {
            return {
                viewerHasStarredProvided: () => this.viewerHasStarred
            }
        },
        data() {
            return {
                data: [],
                loadingRoster: false,
                loading: false,
                highlight: {
                    data: [],
                    loading: false
                },
                perPage: 10,
                cursor: 0,
                viewerHasStarred: [],
                documentTitle: "Topics on GitHub"
            }
        },
        created() {
            this.network_getTopicsSketchRosterData()
        },
        methods: {
            async network_getTopicsSketchRosterData() {
                try{
                    this.loadingRoster = true

                    let url = api.API_TREE_LIST({
                        repo: 'explore',
                        owner: 'github',
                        sha: 'master'
                    })

                    let res = await authRequiredGet(url)

                    let topicArr = []
                    
                    res.data.tree.forEach(i => {
                        if(i.path.match(/^topics\/[\S\s]+\/index\.md$/) !== null) {
                            let name = i.path.replace('topics/','').replace('/index.md','')
                            let avatarPath = `topics/${name}/${name}.png`
                            let withAvatarExist = res.data.tree.filter(i => {
                                return i.path == avatarPath
                            }).length != 0
                            let avatar =  withAvatarExist ? `https://raw.githubusercontent.com/github/explore/master/topics/${name}/${name}.png` : undefined
                            topicArr.push({
                                name,
                                avatar,
                                path: i.path
                            })
                        } 
                    })
                    this.data = topicArr
                    this.network_getHighlightTopics()
                    this.network_getData()
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loadingRoster = false
                }
            },
            async network_getData() {
                if(this.cursor >= this.data.length) return
                try{
                    this.loading = true
                    let topicsSketchRosterToLoad = this.data.slice(this.cursor,this.cursor + this.perPage)
                   
                    let getArr = []
                    topicsSketchRosterToLoad.forEach(i => {
                        getArr.push(authRequiredGet(api.API_CONTENTS({
                            owner: 'github',
                            repo: 'explore',
                            path: i.path
                        })))
                    })

                    let res = await Promise.all(getArr)

                    res.forEach((i,index) => {
                        topicsSketchRosterToLoad[index].content = window.atob(i.data.content)
                    })

                    topicsSketchRosterToLoad.forEach((item,index) => {
                        let magicArr = item.content.split('\n')
                        let displayNameHolder = magicArr.filter(i => i.match(/^display_name:/) != null)[0]
                        let descriptionHolder = magicArr.filter(i => i.match(/^short_description:/) != null)[0]
                        Vue.set(item,'displayName',displayNameHolder.replace("display_name: ",""))
                        Vue.set(item,'description',descriptionHolder.replace("short_description: ",""))
                    })

                    this.cursor += this.perPage

                    if(this.accessToken) {
                        let showingTopics = this.data.filter(i => i.content)

                        let graphql_viewerHasStarred = graphql.GRAPHQL_TOPICS_VIEWER_HAS_STARRED(showingTopics)
                        let res_viewerHasStarred = await authRequiredGitHubGraphqlApiQuery(graphql_viewerHasStarred)

                        let viewerHasStarredArr = []
                        for(let key in  res_viewerHasStarred.data.data) {
                            viewerHasStarredArr.push(res_viewerHasStarred.data.data[key])
                        }

                        this.viewerHasStarred = this.viewerHasStarred.concat(viewerHasStarredArr)
                    }

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getHighlightTopics() {
                 try{
                    this.highlight.loading = true

                    let topicsSketchRosterToLoad = []
                    while(topicsSketchRosterToLoad.length < 3) {
                        let randomItem = this.data[Math.floor(Math.random() * this.data.length)]
                        if(topicsSketchRosterToLoad.indexOf(randomItem) == -1 && randomItem.avatar) {
                            topicsSketchRosterToLoad.push(randomItem)
                        }
                    }

                    let getArr = []
                    topicsSketchRosterToLoad.forEach(i => {
                        getArr.push(authRequiredGet(api.API_CONTENTS({
                            owner: 'github',
                            repo: 'explore',
                            path: i.path
                        })))
                    })

                    let res = await Promise.all(getArr)

                    res.forEach((i,index) => {
                        topicsSketchRosterToLoad[index].content = window.atob(i.data.content)
                    })

                    topicsSketchRosterToLoad.forEach((item,index) => {
                        let magicArr = item.content.split('\n')
                        let displayNameHolder = magicArr.filter(i => i.match(/^display_name:/) != null)[0]
                        let descriptionHolder = magicArr.filter(i => i.match(/^short_description:/) != null)[0]
                        Vue.set(item,'displayName',displayNameHolder.replace("display_name: ",""))
                        Vue.set(item,'description',descriptionHolder.replace("short_description: ",""))
                    })

                    this.highlight.data = topicsSketchRosterToLoad

                    if(this.accessToken) {
                        let graphql_viewerHasStarred = graphql.GRAPHQL_TOPICS_VIEWER_HAS_STARRED(topicsSketchRosterToLoad)
                        let res_viewerHasStarred = await authRequiredGitHubGraphqlApiQuery(graphql_viewerHasStarred)

                        for(let key in  res_viewerHasStarred.data.data) {
                            let item = res_viewerHasStarred.data.data[key]
                            if(this.viewerHasStarred.indexOf(item) == -1) this.viewerHasStarred.push(item)
                        }
                    }

                }catch(e) {
                    this.handleError(e)
                }finally {
                    this.highlight.loading = false
                }
            }
        },
        components: {
            Jumbotron,
            LoadingMore,
            TopicListItem,
            TopicHighlightListItem,
            CommonLoading,
            Container: styled.div``,
            Highlight: styled.div``,
            Main: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/buttons/index.scss';
</style>