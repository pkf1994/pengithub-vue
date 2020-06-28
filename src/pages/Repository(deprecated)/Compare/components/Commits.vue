<template>
    <Container>
        <Header class="header p-3">
            <svg class="octicon octicon-git-commit mr-2" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z"></path></svg>
            <span v-if="commits.length == 250">More than</span>
            <span class="text-emphasized">{{commits.length}}</span>
            {{commits.length > 1 ? 'commits' : 'commit'}}
        </Header>
        <CutOffNotice class="cut-off-notice px-2" v-if="commits.length == 250">
            This comparison is big! We’re only showing the most recent 250 commits.
        </CutOffNotice>
        <CommitGroup v-for="item in commitGroups.slice(0,cursor)" :key="item.sha" :commitGroup="item"></CommitGroup>
        <SimpleLoadingMore v-if="cursor < commitGroups.length" :loading="loading" :dataGetter="showMore"></SimpleLoadingMore>
    </Container>
</template>

<script>
import styled from 'vue-styled-components'
import {SimpleLoadingMore} from '@/components'
import {authRequiredGitHubGraphqlApiQuery,cancelAndUpdateAxiosCancelTokenSource} from '@/network'
import CommitGroup from './CommitGroup'
import {util_throttle} from '@/util'
import * as graphql from '../graphql'
export default {
    name: 'repository_compare_commits',
    provide() {
        return {
            graphqlDataProvided: () => this.extraData.data
        }
    },
    props: {
        commits: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            cursor: 3,
            perPage: 3,
            loading: false,
            extraData: {
                data: [],
                loading: false
            }
        }
    },
    
    computed: {
        commitGroups() {
            let commitGroups = []
            this.commits.forEach(i => {
                if(commitGroups.length == 0) {
                    commitGroups.push([i])
                    return false
                }
                let commitDate = new Date(i.commit.committer.date)
                let prevCommitDate = new Date(commitGroups[commitGroups.length - 1][0].commit.committer.date)
                if(commitDate.getFullYear() == prevCommitDate.getFullYear() && commitDate.getMonth() == prevCommitDate.getMonth() && commitDate.getDate() == prevCommitDate.getDate()) {
                    commitGroups[commitGroups.length - 1].push(i)
                } else {
                    commitGroups.push([i])
                }
            })
            return commitGroups
        },
    },
    created() {
        if(this.accessToken) this.network_getData()
    },
    methods:{
        async network_getData() {
            try{
                this.loading = true
                let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                let grapqhl_extraData = graphql.GRAPHQL_COMMITS
                let commitsToGet = []
                this.commitGroups.slice(this.cursor - this.perPage, this.cursor).forEach(i => {
                    commitsToGet = commitsToGet.concat(i)
                })
                let res = await authRequiredGitHubGraphqlApiQuery(
                    grapqhl_extraData,
                    {
                        cancelToken,
                        variables: {
                            ids: commitsToGet.map(i => i.node_id)
                        }
                    }
                )
                this.extraData.data = res.data.data.nodes
            }catch(e) {
                console.log(e)
            }finally{
                this.loading = false
            }
        },
        showMore() {
            if(this.cursor >= this.commitGroups.length) return
            this.loading = true
            util_throttle.throttleByGap(() => {
                this.cursor += this.perPage
                this.network_getData()
                this.loading = false
            },500,'repository_compare_commits_show_more')
        }
    },
    components: {
        CommitGroup,
        SimpleLoadingMore,
        Container: styled.div``,
        Header: styled.div``,
        CutOffNotice: styled.div``,
    }
}
</script>

<style scoped lang="scss">
.header{
    position: relative;
    margin-bottom: 10px;
    border: 1px solid #dfe2e5;
    border-radius: 3px;
    color: #586069;
}
.cut-off-notice{
    padding: 8px 0;
    margin: 5px 2px;
    font-weight: 600;
    color: #4c4a42;
    text-align: center;
    background-color: #fff9ea;
    border: 1px solid #dfd8c2;
    border-radius: 3px;
}
</style>