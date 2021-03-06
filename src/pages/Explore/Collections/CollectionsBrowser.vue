<template>
    <Container>
        <Jumbotron title="Collections" paragraph="Curated lists and insight into burgeoning industries, topics, and communities.">
            <router-link to="/github/explore/blob/main/CONTRIBUTING.md#curating-a-new-topic-or-collection" class="btn btn-outline">
                Create a collection
            </router-link>
        </Jumbotron>

        <Highlight  class="px-3 pt-6">
            <transition-group name="fade-group" appear>
                <CollectionHighlightListItem class="mb-4" v-for="item in highlight.data" :key="item.displayName" :collection="item"></CollectionHighlightListItem>
            </transition-group>
        </Highlight>

        <Main class="px-3 pt-6">
            <transition-group name="fade-group" appear>
                <CollectionListItem v-for="item in data.filter(i => i.content)" :key="item.displayName" :collection="item"></CollectionListItem>
            </transition-group>
            <SimpleLoadingMore v-if="data.filter(i => i.content).length > 0 &&  cursor <= data.length" :loading="loading" :dataGetter="network_getData"/>
        </Main>

        <transition name="fade" appear>
            <CommonLoading v-if="loadingRoster || (loading && data.filter(i => i.content).length == 0) || highlight.loading"></CommonLoading>
        </transition>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Jumbotron} from '../components'
    import {CollectionListItem,CollectionHighlightListItem} from './components'
    import {mapState} from 'vuex'
    import {CommonLoading,SimpleLoadingMore} from '@/components'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet} from '@/network'
    import Vue from 'vue'
    export default {
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
                documentTitle: 'Collections'
            }
        },
        created() {
            this.network_getCollectionsSketchRosterData()
        },
        methods: {
            async network_getCollectionsSketchRosterData() {
                try{
                    
                    this.loadingRoster = true

                    //explore/collections页面的数据存放于github/explore仓库
                    //已进行oauth登录。通过graphql获取数据
                    if(this.accessToken) {
                        let graphql_collectionsSketchRoster = graphql.GRAPHQL_COLLECTIONS_ROSTER

                        let res = await authRequiredGitHubGraphqlApiQuery(graphql_collectionsSketchRoster)
                       
                        let collectionsSketchRoster
                        try{
                            collectionsSketchRoster = res.data.data.repository.object.entries
                        }catch(e) {
                            this.handleGraphqlError(res)
                        }

                        let graphql_collectionsSketch = graphql.GRAPHQL_COLLECTIONS_SKETCH(collectionsSketchRoster)
                        let res_collectionsSketch = await authRequiredGitHubGraphqlApiQuery(graphql_collectionsSketch)
                        let collectionSketchRosterArr = []
                        let collectionSketchRosterArrHolder

                        try{
                            collectionSketchRosterArrHolder = res_collectionsSketch.data.data.repository
                        }catch(e) {
                            this.handleGraphqlError(res_collectionsSketches)
                        }

                        for(let key in collectionSketchRosterArrHolder) {
                            let collectionAvatarObject = collectionSketchRosterArrHolder[key].entries.filter(i => i.name.match(/.png$/) != null) [0] 
                            let collectionSketchItem = {
                                name: collectionsSketchRoster[parseInt(key.replace('object',''))].name,
                                expression: `main:collections/${collectionsSketchRoster[parseInt(key.replace('object',''))].name}/index.md`,
                                avatar: collectionAvatarObject ? `https://raw.githubusercontent.com/github/explore/main/collections/${collectionsSketchRoster[parseInt(key.replace('object',''))].name}/${collectionAvatarObject.name}` : undefined 
                            }
                            collectionSketchRosterArr.push(collectionSketchItem)
                        }   

                        this.data = collectionSketchRosterArr
                        

                    //未登录，通过rest api git trees获取数据
                    }else {

                        let url = api.API_TREE_LIST({
                            repo: 'explore',
                            owner: 'github',
                            sha: 'main'
                        })

                        let res = await authRequiredGet(url)

                        let collectionArr = []
                        
                        res.data.tree.forEach(i => {
                            if(i.path.match(/^collections\/[\S\s]+\/index\.md$/) !== null) {
                                let name = i.path.replace('collections/','').replace('/index.md','')
                                let avatarPath = `collections/${name}/${name}.png`
                                let withAvatarExist = res.data.tree.filter(i => {
                                    return i.path == avatarPath
                                }).length != 0
                                let avatar =  withAvatarExist ? `https://raw.githubusercontent.com/github/explore/main/collections/${name}/${name}.png` : undefined
                                collectionArr.push({
                                    name,
                                    avatar,
                                    path: i.path
                                })
                            } 
                        })
                        this.data = collectionArr
                    }

                    this.network_getData()
                    this.network_getHighlightCollections()

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

                    let collectionsSketchRosterToLoad = this.data.slice(this.cursor,this.cursor + this.perPage)

                    if(this.accessToken) {
                        let graphql_collections = graphql.GRAPHQL_COLLECTIONS(collectionsSketchRosterToLoad)

                        let res_collections = await authRequiredGitHubGraphqlApiQuery(graphql_collections)

                        let collectionsSketchRosterToLoadHolder

                        try{
                            collectionsSketchRosterToLoadHolder = res_collections.data.data.repository
                        }catch(e) {
                            this.handleGraphqlError(res_collections)
                        }

                        for(let key in collectionsSketchRosterToLoadHolder) {
                            collectionsSketchRosterToLoad[parseInt(key.replace('object',''))].content = collectionsSketchRosterToLoadHolder[key].text
                        }
                       
                    }else{
                        let getArr = []
                        collectionsSketchRosterToLoad.forEach(i => {
                            getArr.push(authRequiredGet(api.API_CONTENTS({
                                owner: 'github',
                                repo: 'explore',
                                path: i.path
                            })))
                        })

                        let res = await Promise.all(getArr)

                        res.forEach((i,index) => {
                            collectionsSketchRosterToLoad[index].content = window.atob(i.data.content)
                        })
                    }

                    collectionsSketchRosterToLoad.forEach((item,index) => {
                        let magicArr = item.content.split('\n')
                        let displayNameHolder = magicArr.filter(i => i.match(/^display_name:/) != null)[0]
                        Vue.set(item,'displayName',displayNameHolder.replace("display_name: ",""))
                        Vue.set(item,'description',item.content.split('---').pop().replace('\n',''))
                    })
                    
                    this.cursor += this.perPage
                    this.loading = false
                }catch(e) {
                    this.handleError(e)
                    this.loading = false
                } 
            },
            async network_getHighlightCollections() {
                 try{
                    this.highlight.loading = true

                    let collectionsSketchRosterToLoad = []
                    while(collectionsSketchRosterToLoad.length < 3) {
                        let randomItem = this.data[Math.floor(Math.random() * this.data.length)]
                        if(collectionsSketchRosterToLoad.indexOf(randomItem) == -1 && randomItem.avatar) {
                            collectionsSketchRosterToLoad.push(randomItem)
                        }
                    }

                    if(this.accessToken) {
                        let graphql_collections = graphql.GRAPHQL_COLLECTIONS(collectionsSketchRosterToLoad)
                        let res_collections = await authRequiredGitHubGraphqlApiQuery(graphql_collections)

                        let collectionsSketchRosterToLoadHolder
                        try{
                            collectionsSketchRosterToLoadHolder = res_collections.data.data.repository
                        }catch(e) {
                            this.handleGraphqlError(res_collections)
                        }

                        for(let key in collectionsSketchRosterToLoadHolder) {
                            collectionsSketchRosterToLoad[parseInt(key.replace('object',''))].content = collectionsSketchRosterToLoadHolder[key].text
                        }
                    } else {
                        let getArr = []
                        collectionsSketchRosterToLoad.forEach(i => {
                            getArr.push(authRequiredGet(api.API_CONTENTS({
                                owner: 'github',
                                repo: 'explore',
                                path: i.path
                            })))
                        })

                        let res = await Promise.all(getArr)

                        res.forEach((i,index) => {
                            collectionsSketchRosterToLoad[index].content = window.atob(i.data.content)
                        })
                    }

                    collectionsSketchRosterToLoad.forEach((item,index) => {
                        let magicArr = item.content.split('\n')
                        let displayNameHolder = magicArr.filter(i => i.match(/^display_name:/) != null)[0]
                        Vue.set(item,'displayName',displayNameHolder.replace("display_name: ",""))
                        Vue.set(item,'description',item.content.split('---').pop().replace('\n',''))
                    })

                    this.highlight.data = collectionsSketchRosterToLoad

                    this.highlight.loading = false
                }catch(e) {
                    this.handleError(e)
                    this.highlight.loading = false
                } 
            }
        },
        components: {
            Jumbotron,
            SimpleLoadingMore,
            CollectionListItem,
            CollectionHighlightListItem,
            CommonLoading,
            Container: styled.div``,
            Highlight: styled.div``,
            Main: styled.div``
        }
    }
</script>

<style scoped>

</style>