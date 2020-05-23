<template>
    <Container class="py-6 px-3">
        <transition name="fade" appear>
             <Jumbotron v-if="rawContent != ''">
                <div class="h5 text-uppercase mb-2 text-gray">
                <router-link to="/explore/collections" class="link-gray">Collection</router-link>
                </div>
                <JumbotronTitle class="jumbotron-title mb-3 lh-condensed" style="font-size:40px">
                    {{displayName}}
                </JumbotronTitle>
                <JumbotronDescription class="jumbotron-description text-gray lh-condensed mb-3" v-html="descriptionHTML">
                </JumbotronDescription>
                <router-link to="/" class="f5">Suggest edits</router-link> 
            </Jumbotron>
        </transition>
       
        <Avatar class="col-6 mx-auto" v-if="avatar">
            <ImgWrapper>
                <img :src="avatar" :alt="displayName" class="width-full">
            </ImgWrapper>
        </Avatar>

        <transition-group appear name="fade">
            <RepoItemWrapper v-for="item in repositories.data" :key="item.id" class="repo-item-wrapper height-full border border-gray-light rounded-1 my-5">
                <RepoListItem :repository="item"></RepoListItem>
            </RepoItemWrapper>
        </transition-group>
     
        <transition name="fade" appear>
            <CommonLoading v-if="loading || repositories.loading" :position="loading ? 'center' : 'corner'"></CommonLoading>
        </transition>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {CommonLoading,ImgWrapper} from '@/components'
    import {RepoListItem} from './components'
    import * as graphql from './graphql'
    import {util_markdownParse} from '@/util'
    import {authRequiredGitHubGraphqlApiQuery} from '@/network'
    export default {
        name: 'explore_collection_detail_page',
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                rawContent: '',
                avatar: undefined,
                loading: false,
                repositories: {
                    data: [],
                    loading: false
                }
            }
        },
        computed: {
            collection() {
                return this.$route.params.collection
            },
            displayName() {
                let magicArr = this.rawContent.split('\n')
                let displayNameHolder = magicArr.filter(i => i.match(/^display_name:/) != null)[0]
                return displayNameHolder && displayNameHolder.replace("display_name: ","")
            },
            descriptionHTML() {
                return util_markdownParse.markdownToHTML(this.rawContent.split('---').pop().replace('\n',''))
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
                    let graphql_collectionSketchAndRaw = graphql.GRAPHQL_COLLECTION_SKETCH_AND_RAW(this.collection)
                    let res_collectionSketchAndRaw = await authRequiredGitHubGraphqlApiQuery(graphql_collectionSketchAndRaw,{cancelToken})

                    let dataHolder
                    try{
                        let dataHolder =  res_collectionSketchAndRaw.data.data.repository.sketch.entries
                    }catch(e) {
                        this.handleGraphqlError(res_collectionSketchAndRaw)
                    }

                    dataHolder.forEach(i => {
                        if(i.name.match(/\.png$/) != null) this.avatar = `https://raw.githubusercontent.com/github/explore/master/collections/${this.collection}/${i.name}`
                    })

                    try{
                        this.rawContent = res_collectionSketchAndRaw.data.data.repository.raw.text
                    }catch(e) {
                        this.handleGraphqlError(res_collectionSketchAndRaw)
                    }

                    this.network_getRepositories()
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getRepositories() {
                try{
                    this.repositories.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_repositories')

                    let magicArr = this.rawContent.split('\n')
                    let reposMetaArr = []
                    magicArr.forEach(i => {
                        if(i.indexOf(' - ') == 0) {
                            let fullName = i.replace(' - ','')
                            reposMetaArr.push({
                                owner: fullName.split('/')[0],
                                name: fullName.split('/')[1],
                            })
                        }
                    })

                    let graphql_repos = graphql.GRAPHQL_REPOS(reposMetaArr)
                    let res_repos = await authRequiredGitHubGraphqlApiQuery(graphql_repos,{cancelToken})
                    let repos = []

                    let dataHolder
                    try{
                        dataHolder = res_repos.data.data
                    }catch(e) {
                        this.handleGraphqlError(res_repos)
                    }

                    for(let key in dataHolder) {
                        repos.push(dataHolder[key])
                    }

                    this.repositories.data = repos.filter(i => i != null)
                    
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.repositories.loading = false
                }
            }
        },
        components: {
            CommonLoading,
            ImgWrapper,
            RepoListItem,
            Container: styled.div``,
            Jumbotron: styled.div``,
            JumbotronTitle: styled.h1``,
            JumbotronDescription: styled.div``,
            Avatar: styled.div``,
            RepoItemWrapper: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/layout/index.scss';
.jumbotron-title{
    font-family: Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
    font-weight: 500;
}
.jumbotron-description{
    font-size: 20px;
    font-weight: 400;
    font-family: Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
}

.repo-item-wrapper{

}
</style>