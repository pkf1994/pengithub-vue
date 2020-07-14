<template>
    <CommonLoadingWrapper :loading="loading">
        <h1 class="px-3 mb-1">
            <span v-if="data.length > 0">{{data.length}}</span>
            Contributors
        </h1>
        <p class="px-3">Contributions to dev, excluding merge commits</p>
        <transition-group name="fade-group" appear>
            <ContributorsSkeleton v-if="data.length == 0 && loading" key="-1"></ContributorsSkeleton>
            <div v-for="(item,index) in data" :key="item.author.login" class="p-3 border-top">
                <span class="float-right f5 text-normal text-gray-light">
                    #{{index + 1}}
                </span>
                <div  class="d-flex flex-items-center">
                    <router-link :to="`/${item.author.login}`">
                         <ImgWrapper class="avatar avatar-user">
                            <img  class="avatar avatar-user" :src="item.author.avatar_url" :alt="`@${item.login}`" width="40" height="40">
                        </ImgWrapper>
                    </router-link>
                   
                    <div class="ml-3">
                        <h3>
                            <router-link class="text-normal" :to="`/${item.author.login}`">{{item.author.login}}</router-link>
                        </h3>
                        <div>
                            <router-link class="link-gray text-normal" :to="`/${owner}/${repo}/commits?author=${item.author.login}`">{{item.total}} {{item.total > 1 ? 'commits' : 'commit'}}</router-link>
                            &nbsp;
                            <span class="text-green text-normal">{{item.additions | thousands}} ++</span>
                            &nbsp;
                            <span class="text-red text-normal">{{item.deletions | thousands}} --</span>
                        </div>
                    </div>
                </div>
               
            </div>
        </transition-group>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {CommonLoadingWrapper,ImgWrapper} from '@/components'
    import * as api from '@/network/api'
    import {authRequiredGet} from '@/network'
    import ContributorsSkeleton from './ContributorsSkeleton'
    export default {
        name: 'repository_contributors_page',
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                data: [],
                loading: false
            }
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let url = api.API_REPOSITORY_STATISTIC_CONTRIBUTOR_LIST({
                        repo: this.repo,
                        owner: this.owner
                    })
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                        }
                    )
                    this.handleContributorsStatistic(res.data)
                }catch(e) {
                    console.log(e)
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            handleContributorsStatistic(contributors) {
                contributors.forEach(i => {
                    let additions = 0
                    let deletions = 0
                    i.weeks.forEach(i_ => {
                        additions += i_.a
                        deletions += i_.d
                    })
                    i.additions = additions
                    i.deletions = deletions
                })
                this.data = contributors.sort((a,b) => {
                    return b.total - a.total
                })
            }
        },
        components: {
            CommonLoadingWrapper,
            ImgWrapper,
            ContributorsSkeleton,
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/avatars/index.scss';
</style>