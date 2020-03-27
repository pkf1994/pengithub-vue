<template>
    <Container>
        <Jumbotron title="Collections" paragraph="Curated lists and insight into burgeoning industries, topics, and communities.">
            <router-link to="/github/explore/blob/master/CONTRIBUTING.md#curating-a-new-topic-or-collection" class="btn btn-outline">
                Create a collection
            </router-link>
        </Jumbotron>

        <Main class="px-3 pt-6">

        </Main>

        <transition name="fade" appear>
            <CommonLoading v-if="data.length == 0"></CommonLoading>
        </transition>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Jumbotron} from '../components'
    import {CommonLoading} from '@/components'
    import * as graphql from './graphql'
    import {authRequiredGitHubGraphqlApiQuery} from '@/network'
    export default {
        data() {
            return {
                collectionsRoster: {
                    data: [],
                    loading: false
                },
                data: [],
                loading: false,
                perPage: 10,
                cursor: 0
            }
        },
        async created() {
            await this.network_getCollectionsRosterData()
            this.network_getData()
        },
        methods: {
            async network_getCollectionsRosterData() {
                try{
                    this.collectionsRoster.loading = true
                    let graphql_collectionsRoster = graphql.GRAPHQL_COLLECTIONS_ROSTER

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_collectionsRoster)
                    this.collectionsRoster.data = res.data.data.repository.object.entries

                    this.collectionsRoster.loading = false
                }catch(e) {
                    console.log(e)
                    this.collectionsRoster.loading = false
                }
            },
            async network_getData() {
                if(this.cursor >= this.collectionsRoster.data.length) return
                try{
                    this.loading = true
                    let collectionsRosterToLoad = this.collectionsRoster.data.slice(this.cursor,this.cursor + this.perPage)
                    let graphql_collectionsSketch = graphql.GRAPHQL_COLLECTION_SKETCH(collectionsRosterToLoad)
                    let res_collectionsSketch = await authRequiredGitHubGraphqlApiQuery(graphql_collectionsSketch)

                    let collectionArr = []
                    for(let key in res_collectionsSketch.data.data.repository) {
                        let collectionAvatarObject = res_collectionsSketch.data.data.repository[key].entries.filter(i => i.name.match(/.png$/) != null) [0] 
                        let collectionSketchIten = {
                            expression: `master:collections/${collectionsRosterToLoad[parseInt(key.replace('object',''))].name}/index.md`,
                            avatar: collectionAvatarObject ? `https://raw.githubusercontent.com/github/explore/master/collections/${collectionsRosterToLoad[parseInt(key.replace('object',''))].name}/${collectionAvatarObject.name}` : undefined 
                        }
                        collectionArr.push(collectionSketchIten)
                    }   

                    let graphql_collections = graphql.GRAPHQL_COLLECTIONS(collectionArr)
                    let res_collections = await authRequiredGitHubGraphqlApiQuery(graphql_collections)

                    for(let key in res_collections.data.data.repository) {
                        collectionArr[parseInt(key.replace('object',''))].content = res_collections.data.data.repository[key].text
                    }

                    collectionArr.forEach(item => {
                        let magicArr = item.content.split('\n')
                        let displayNameHolder = magicArr.filter(i => i.match(/^display_name:/) != null)[0]
                        item.displayName = displayNameHolder.replace("display_name: ","")
                        item.description = item.content.split('---').pop().replace('\n','')
                    })

                    this.data = this.data.concat(collectionArr)
                    
                    this.cursor += this.perPage
                    this.loading = false
                }catch(e) {
                    console.log(e)
                    this.loading = false
                } 
            }
        },
        components: {
            Jumbotron,
            CommonLoading,
            Container: styled.div``,
            Main: styled.div``
        }
    }
</script>

<style scoped>

</style>