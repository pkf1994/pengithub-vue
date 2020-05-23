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
                <TopicListItem v-for="item in data.filter(i => i.content)" :key="item.displayName" :topic="item"></TopicListItem>
            </transition-group>
            <LoadingMore v-if="data.filter(i => i.content).length > 0 &&  cursor <= data.length" :loading="loading" :dataGetter="network_getData"/>
        </Main>

        <transition name="fade" appear>
            <CommonLoading v-if="data.filter(i => i.content).length == 0 || highlight.loading" :position="data.filter(i => i.content).length == 0 ? 'center' : 'corner'"></CommonLoading>
        </transition>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Jumbotron,LoadingMore} from '../components'
    import {TopicListItem,TopicHighlightListItem} from './components'
    import {CommonLoading} from '@/components'
    import * as graphql from './graphql'
    import {authRequiredGitHubGraphqlApiQuery} from '@/network'
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
            }
        },
        created() {
            this.network_getTopicsSketchRosterData()
        },
        methods: {
            async network_getTopicsSketchRosterData() {
                try{
                    this.loadingRoster = true
                    let graphql_topicsSketchRoster = graphql.GRAPHQL_TOPICS_ROSTER

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_topicsSketchRoster)
                    let topicsSketchRoster
                    try{
                        topicsSketchRoster = res.data.data.repository.object.entries
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                    let graphql_topicsSketch = graphql.GRAPHQL_TOPICS_SKETCH(topicsSketchRoster)
                    let res_topicsSketch = await authRequiredGitHubGraphqlApiQuery(graphql_topicsSketch)
                    let topicSketchRosterArr = []
                    let topicSketchRosterArrHolder
                    try{
                        topicSketchRosterArrHolder = res_topicsSketch.data.data.repository
                    }catch(e) {
                        this.handleGraphqlError(res_topicsSketch)
                    }

                    for(let key in topicSketchRosterArrHolder) {
                        let TopicAvatarObject = topicSketchRosterArrHolder[key].entries.filter(i => i.name.match(/.png$/) != null) [0] 
                        let TopicSketchItem = {
                            name: topicsSketchRoster[parseInt(key.replace('object',''))].name,
                            expression: `master:topics/${topicsSketchRoster[parseInt(key.replace('object',''))].name}/index.md`,
                            avatar: TopicAvatarObject ? `https://raw.githubusercontent.com/github/explore/master/topics/${topicsSketchRoster[parseInt(key.replace('object',''))].name}/${TopicAvatarObject.name}` : undefined 
                        }
                        topicSketchRosterArr.push(TopicSketchItem)
                    }   

                    this.data = topicSketchRosterArr
                    this.network_getHighlightTopics()
                    this.network_getData()

                    this.loadingRoster = false
                }catch(e) {
                    this.handleError(e)
                    this.loadingRoster = false
                }
            },
            async network_getData() {
                if(this.cursor >= this.data.length) return
                try{
                    this.loading = true
                    let topicsSketchRosterToLoad = this.data.slice(this.cursor,this.cursor + this.perPage)
                   

                    let graphql_topics = graphql.GRAPHQL_TOPICS(topicsSketchRosterToLoad)
                    let res_topics = await authRequiredGitHubGraphqlApiQuery(graphql_topics)

                    let dataHolder 
                    try{
                        dataHolder = res_topics.data.data.repository
                    }catch(e) { 
                        this.handleGraphqlError(res_topics)
                    }

                    for(let key in dataHolder) {
                        topicsSketchRosterToLoad[parseInt(key.replace('object',''))].content = dataHolder[key].text
                    }

                    topicsSketchRosterToLoad.forEach((item,index) => {
                        let magicArr = item.content.split('\n')
                        let displayNameHolder = magicArr.filter(i => i.match(/^display_name:/) != null)[0]
                        let descriptionHolder = magicArr.filter(i => i.match(/^short_description:/) != null)[0]
                        Vue.set(item,'displayName',displayNameHolder.replace("display_name: ",""))
                        Vue.set(item,'description',descriptionHolder.replace("short_description: ",""))
                    })

                    this.cursor += this.perPage

                    let showingTopics = this.data.filter(i => i.content)

                    let graphql_viewerHasStarred = graphql.GRAPHQL_TOPICS_VIEWER_HAS_STARRED(showingTopics)
                    let res_viewerHasStarred = await authRequiredGitHubGraphqlApiQuery(graphql_viewerHasStarred)

                    let viewerHasStarredArr = []
                    let viewerHasStarredArrHolder
                    try{
                        viewerHasStarredArrHolder = res_viewerHasStarred.data.data
                    }catch(e) {
                        this.handleGraphqlError(res_viewerHasStarred)
                    }
                    for(let key in  viewerHasStarredArrHolder) {
                        viewerHasStarredArr.push(viewerHasStarredArrHolder[key])
                    }

                    this.viewerHasStarred = this.viewerHasStarred.concat(viewerHasStarredArr)
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

                    let graphql_topics = graphql.GRAPHQL_TOPICS(topicsSketchRosterToLoad)
                    let res_topics = await authRequiredGitHubGraphqlApiQuery(graphql_topics)

                    let topicsHolder
                    try{
                        topicsHolder = res_topics.data.data.repository
                    }catch(e) {
                        this.handleGraphqlError(res_topics)
                    }

                    for(let key in topicsHolder) {
                        topicsSketchRosterToLoad[parseInt(key.replace('object',''))].content = topicsHolder[key].text
                    }

                    topicsSketchRosterToLoad.forEach((item,index) => {
                        let magicArr = item.content.split('\n')
                        let displayNameHolder = magicArr.filter(i => i.match(/^display_name:/) != null)[0]
                        let descriptionHolder = magicArr.filter(i => i.match(/^short_description:/) != null)[0]
                        Vue.set(item,'displayName',displayNameHolder.replace("display_name: ",""))
                        Vue.set(item,'description',descriptionHolder.replace("short_description: ",""))
                    })

                    this.highlight.data = topicsSketchRosterToLoad

                    let graphql_viewerHasStarred = graphql.GRAPHQL_TOPICS_VIEWER_HAS_STARRED(topicsSketchRosterToLoad)
                    let res_viewerHasStarred = await authRequiredGitHubGraphqlApiQuery(graphql_viewerHasStarred)

                    let viewerHasStarredDataHolder
                    try{
                        viewerHasStarredDataHolder = res_viewerHasStarred.data.data
                    }catch(e) {
                       this.handleGraphqlError(res_viewerHasStarred) 
                    }

                    for(let key in  viewerHasStarredDataHolder) {
                        let item = viewerHasStarredDataHolder[key]
                        if(this.viewerHasStarred.indexOf(item) == -1) this.viewerHasStarred.push(item)
                    }

                }catch(e) {
                    this.handleError(e)
                }finally{
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