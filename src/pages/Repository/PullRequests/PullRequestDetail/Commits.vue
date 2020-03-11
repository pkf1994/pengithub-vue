<template>
    <Container>
        <Commit v-for="item in committedDateMarkedData" :key="item.commit.abbreviatedOid">
            <CommittedDate class="committed-date" v-if="!item.someCommittedDateWithPrevOne">
                <span>{{formatDate(item.commit.committer.date)}}</span>
            </CommittedDate>
            <CommitInfo class="commit-info-item bg-white">
                <img :src="item.commit.committer.user ? item.commit.committer.avatarUrl : item.commit.author.avatarUrl" width="20" height="20" :alt="item.commit.committer.user ? item.commit.committer.user.login : item.commit.author.user.login" class="avatar">
                <Title class="title">
                    <router-link to="/" v-html="item.commit.messageHeadlineHTML">
                    </router-link>
                </Title>
                <Meta class="meta">
                    committed by {{item.commit.committer.user ? item.commit.committer.user.login : item.commit.author.user.login}} ⋅ <router-link to="/">{{item.commit.abbreviatedOid}}</router-link>
                </Meta>
            </CommitInfo>
        </Commit>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import { cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery } from '@/network'
    import {util_dateFormat,util_emoji} from '@/util'
    import * as graphql from './graphql'
    export default {
        name: 'repository_pull_request_detail_commits_page',
        inject: ['owner','repo','number'],
        data() {
            return {
                data: [],
                loading: false,
                pageInfo: {},
                totalCount: 0
            }
        },
        computed: {
           committedDateMarkedData() {
                let data = []
                let lastItem
                this.data.forEach(item => {
                    if(lastItem) {
                        if(util_dateFormat.dateFormat('zzz dd, yyyy',item.commit.committer.date) === util_dateFormat.dateFormat('zzz dd, yyyy',lastItem.commit.committer.date)) {
                            item.someCommittedDateWithPrevOne = true
                        }
                    }
                    data.push(item)
                    lastItem = item
                })
                return data
            },
        },
        created() {
            this.network_getData()
        },
        methods: {
            formatDate(date) {
                return util_dateFormat.dateFormat('zzz dd, yyyy',date)
            },
            parseEmoji(raw) {
                return util_emoji.parse(raw)
            },
            async network_getData() {
                try{
                    this.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name)
                    let graphql_commits = graphql.GRAPHQL_PULLS_COMMITS({
                        owner: this.owner(),
                        repo: this.repo(),
                        number: this.number(),
                        after: this.pageInfo.endCursor
                    })
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_commits,{cancelToken:sourceAndCancelToken.cancelToken})
                    console.log(res.data.data)
                    this.data = this.data.concat(res.data.data.repository.pullRequest.commits.nodes)
                    this.totalCount = res.data.data.repository.pullRequest.commits.totalCount
                    this.pageInfo = res.data.data.repository.pullRequest.commits.pageInfo
                    this.loading = false
                }catch(e) {
                    this.loading = false
                    console.log(e)
                }
            }
        },
        components: {
            Container: styled.div``,
            Commit: styled.div``,
            CommittedDate: styled.div``,
            CommitInfo: styled.div``,
            Title: styled.div``,
            Meta: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.committed-date {
    position: relative;
    padding: 7px 15px;
    clear: both;
    font-size: 12px;
    font-weight: 600;
    color: #586069;
    background-color: #f6f8fa;
    border-top: 1px solid #eaecef;
}

.commit-info-item{
    border-top: 1px solid #eaecef;
    position: relative;
    width: 100%;
    padding: 14px 15px 14px 45px;
    overflow-wrap: break-word;
    line-height: inherit;
    text-align: left;
    display: block;
    img{
        position: absolute;
        top: 14px;
        left: 15px;
        border-radius: 3px;
    }
    a{
        color: #24292e;
    }
    .title{
        margin: 0 0 5px;
        font-size: 13px;
        font-weight: 600;
        line-height: 1.2;
        color: #0366d6;
        word-break: break-word;
    }
    .meta{
        display: block;
        margin: 0;
        font-size: 12px;
        color: #586069;
    }
}
</style>