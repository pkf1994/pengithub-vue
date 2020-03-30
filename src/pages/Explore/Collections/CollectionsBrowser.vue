<template>
    <Container>
        <Jumbotron title="Collections" paragraph="Curated lists and insight into burgeoning industries, topics, and communities.">
            <router-link to="/github/explore/blob/master/CONTRIBUTING.md#curating-a-new-topic-or-collection" class="btn btn-outline">
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
    import {CollectionListItem,CollectionHighlightListItem} from './components'
    import {CommonLoading} from '@/components'
    import * as graphql from './graphql'
    import {authRequiredGitHubGraphqlApiQuery} from '@/network'
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
                cursor: 0
            }
        },
        created() {
            this.network_getCollectionsSketchRosterData()
        },
        methods: {
            async network_getCollectionsSketchRosterData() {
                try{
                    this.loadingRoster = true
                    let graphql_collectionsSketchRoster = graphql.GRAPHQL_COLLECTIONS_ROSTER

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_collectionsSketchRoster)
                    let collectionsSketchRoster = res.data.data.repository.object.entries

                    let graphql_collectionsSketch = graphql.GRAPHQL_COLLECTIONS_SKETCH(collectionsSketchRoster)
                    let res_collectionsSketch = await authRequiredGitHubGraphqlApiQuery(graphql_collectionsSketch)
                    let collectionSketchRosterArr = []

                    for(let key in res_collectionsSketch.data.data.repository) {
                        let collectionAvatarObject = res_collectionsSketch.data.data.repository[key].entries.filter(i => i.name.match(/.png$/) != null) [0] 
                        let collectionSketchItem = {
                            name: collectionsSketchRoster[parseInt(key.replace('object',''))].name,
                            expression: `master:collections/${collectionsSketchRoster[parseInt(key.replace('object',''))].name}/index.md`,
                            avatar: collectionAvatarObject ? `https://raw.githubusercontent.com/github/explore/master/collections/${collectionsSketchRoster[parseInt(key.replace('object',''))].name}/${collectionAvatarObject.name}` : undefined 
                        }
                        collectionSketchRosterArr.push(collectionSketchItem)
                    }   

                    this.data = collectionSketchRosterArr
                    this.network_getHighlightCollections()
                    this.network_getData()

                    this.loadingRoster = false
                }catch(e) {
                    console.log(e)
                    this.loadingRoster = false
                }
            },
            async network_getData() {
                if(this.cursor >= this.data.length) return
                try{
                    this.loading = true
                    let collectionsSketchRosterToLoad = this.data.slice(this.cursor,this.cursor + this.perPage)
                   

                    let graphql_collections = graphql.GRAPHQL_COLLECTIONS(collectionsSketchRosterToLoad)
                    let res_collections = await authRequiredGitHubGraphqlApiQuery(graphql_collections)

                    for(let key in res_collections.data.data.repository) {
                        collectionsSketchRosterToLoad[parseInt(key.replace('object',''))].content = res_collections.data.data.repository[key].text
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
                    console.log(e)
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

                    let graphql_collections = graphql.GRAPHQL_COLLECTIONS(collectionsSketchRosterToLoad)
                    let res_collections = await authRequiredGitHubGraphqlApiQuery(graphql_collections)

                    for(let key in res_collections.data.data.repository) {
                        collectionsSketchRosterToLoad[parseInt(key.replace('object',''))].content = res_collections.data.data.repository[key].text
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
                    console.log(e)
                    this.highlight.loading = false
                } 
            }
        },
        components: {
            Jumbotron,
            LoadingMore,
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