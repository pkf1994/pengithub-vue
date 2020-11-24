<template>
    <Container>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </Container>   
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import { cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import * as graphql from './graphql'
    export default {
        mixins: [RouteUpdateAwareMixin],
        inject: ['repoBasicInfo'],
        data() {
            return {
                data: {},
                loading: false,
                branches: {
                    data: [],
                    loading: false
                },
                isDynamicDocumentTitle: true
            }
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            documentTitle() {
                if(!this.repoBasicInfo().description) return `${this.owner}/${this.repo}`
                return `${this.owner}/${this.repo}: ${this.repoBasicInfo().description}`
            }
        },
        created() {
            //if(this.accessToken) this.network_getData()
        },
        methods: {
            //获取仓库文件基本信息
          /*   network_getData() {
                if(this.accessToken) {
                    this.network_getGraphql
                }
            }, */
            async network_getData() {
                try{
                    this.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource()
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let graphql_codeBasicInfo = graphql.GRAPHQL_REPOSITORY_CODE_BASIC_INFO(this.owner(),this.repo())
                    const res = await authRequiredGitHubGraphqlApiQuery(graphql_codeBasicInfo,{cancelToken:sourceAndCancelToken.cancelToken})
                    try{
                        this.data = res.data.data.repository || {}
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            generateRouterMeta() {
                return `${this.$route.params.owner}/${this.$route.params.repo}`
            },
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>