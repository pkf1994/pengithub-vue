<template>
    <Container class="position-relative">

        <input v-model="searchQuery" class="form-control width-full my-3" placeholder="Find a repository…" autocomplete="off">
        
        <FilterRow class="border-bottom pb-3">
            <button class="btn mr-1">
                <i>Type:</i>
                <span>{{type || 'All' | capitalize}}</span>
                <span class="dropdown-caret"></span>
            </button>  

            <button class="btn">
                <i>Language:</i>
                <span>{{language || 'All' | capitalize}}</span>
                <span class="dropdown-caret"></span>
            </button>  
        </FilterRow>

        <transition-group name="fade-group" appear>
            <RepoListItem v-for="item in data" :key="item.id" :repository="item"></RepoListItem>
        </transition-group>

        <Pagination class="paginate-container" v-if="data.length > 0">
            <div class="BtnGroup">
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.prev || loading" @click="() => changePage(true)">Previous</button>
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.next || loading"  @click="() => changePage(false)">Next</button>
            </div> 
        </Pagination>

        <LoadingWrapper  class="loading-wrapper">
            <div v-if="loading && !loadingUserBasicInfoProvided()" class="inner d-flex flex-items-center flex-justify-center">
                <LoadingIcon></LoadingIcon>
            </div>
        </LoadingWrapper>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {LoadingIcon} from '@/components'
    import {RepoListItem} from './components'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet} from '@/network' 
    import {util_queryParse} from '@/util'
    var parse = require('parse-link-header');
    export default {
        name: 'user_repositories_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['loadingUserBasicInfoProvided'],
        provide() {
            return {
                extraDataProvided: () => this.extraData
            }
        },
        data() {
            return {
                searchQuery: '',
                data: [],
                loading: false,
                perPage: 30,
                totalCount: 0,
                pageInfo: {
                },
                extraData: []
            }
        },
        computed: {
            login() {
                return this.$route.params.login
            },
            type() {
                return this.$route.query.type
            },
            page() {
                return this.$route.query.page
            },
            typeQueryFragment() {
                let type = this.$route.query.type
                if(type == 'fork') return 'fork:only'
                if(type == 'all') return 'fork:true'
                if(type == 'source') return ''
                if(type == 'archived') return 'archived:true'
                if(type == 'mirrors') return 'mirrors:true'
                return 'fork:true'
            },
            language() {
                return this.$route.query.language
            },
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)

                   /*  let graphql_repos = graphql.GRAPHQL_USER_REPOSITORY({
                        query: `user:${this.login} ${this.language ? 'language:' + this.language + ' ' : ''}${this.typeQueryFragment}`.trim(),
                        perPage: this.perPage,
                        after: changePageFlag && !getPreviousPageDataFlag && this.pageInfo.endCursor,
                        before: changePageFlag && getPreviousPageDataFlag && this.pageInfo.startCursor
                    })

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_repos,{cancelToken})
                    this.data = res.data.data.search.nodes
                    this.totalCount = res.data.data.search.repositoryCount
                    this.pageInfo = res.data.data.search.pageInfo */



                    let url = api.API_SEARCH('repositories', {
                        q: `user:${this.login} ${this.language ? 'language:' + this.language + ' ' : ''}${this.typeQueryFragment}`.trim(),
                        per_page: this.perPage,
                        page: this.page,
                        sort: 'updated'
                    })
                    let res_rest = await authRequiredGet(url,{
                        cancelToken,
                        headers: {
                            'Accept': 'application/vnd.github.mercy-preview+json'
                        }
                    })

                    this.data = res_rest.data.items
                    this.totalCount = res_rest.total_count
                    this.pageInfo = parse(res_rest.headers.link) || {}

                    let graphql_extraData = graphql.GRAPHQL_USER_REPOSITORY_EXTRA(this.data)
                    console.log(graphql_extraData)
                    let res_graphql = await authRequiredGitHubGraphqlApiQuery(graphql_extraData,{cancelToken})

                    console.log(res_graphql.data.data)

                    let extraData = []
                    for(let key in res_graphql.data.data) {
                        extraData.push(res_graphql.data.data[key])
                    }

                    this.extraData = extraData

                    this.loading = false
                }catch(e) {
                    console.log(e)
                    this.loading = false
                } 
            },
            changePage(goPrevPageFlag) {
                let queryStr = util_queryParse.querify({
                    ...this.$route.query,
                    page: goPrevPageFlag ? this.page - 1 : (this.page ? parseInt(this.page) + 1 : 2)
                })
                //console.log(`/${this.login}/repositories?${queryStr}`)
                this.$router.push(`/${this.login}/repositories?${queryStr}`)
            }
        },
        components: {
            RepoListItem,
            LoadingIcon,
            Container: styled.div``,
            LoadingWrapper: styled.div``,
            FilterRow: styled.div``,
            Pagination: styled.div``,

        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
.loading-wrapper{
    pointer-events: none;
    position:absolute;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    .inner{
        position:sticky;
        height:150px;
        top: calc(50% - 75px);
    }
}

.paginate-container {
    margin-top: 20px;
    margin-bottom: 15px;
    text-align: center;
}

</style>