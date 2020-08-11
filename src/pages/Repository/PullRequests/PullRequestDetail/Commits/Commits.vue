<template>
    <Container>
        <CutOffNotice class="cut-off-notice" v-if="totalCount > 250">
            This pull request is big! We’re only showing the most recent 250 commits.
        </CutOffNotice>
        <transition-group name="fade-group" appear >
            <CommittedDate key="0" class="committed-date" v-if="committedDateMarkedData.length == 0 && loading">
                <span>&nbsp;</span>
            </CommittedDate>
            <Skeleton v-for="item in committedDateMarkedData.length == 0 && loading ? [1,2,3,4,5,6,7] : []" :key="item" class="border-bottom d-flex flex-items-start" style="padding:14px">
                <SkeletonCircle :diameter="20" class="mr-2"></SkeletonCircle>
                <div class="flex-grow-1">
                    <SkeletonRectangle :height="14" style="width:100%"></SkeletonRectangle>
                    <SkeletonRectangle :height="12" style="width:60%;margin-top:12px"></SkeletonRectangle>
                </div>
            </Skeleton>
            <Commit v-for="item in committedDateMarkedData" :key="item.sha">
                <CommittedDate class="committed-date" v-if="!item.someCommittedDateWithPrevOne">
                    <span>{{item.commit.committer.date | dateFormat('zzz dd, yyyy')}}</span>
                </CommittedDate>
                <CommitInfo class="commit-info-item bg-white">
                    <ImgWrapper class="img">
                        <img :src="item.committer.avatar_url" width="20" height="20" :alt="item.committer.login" class="avatar avatar-user">
                    </ImgWrapper>
                    <Title class="title">
                        <router-link :to="`/${owner}/${repo}/commits/${item.sha}`">
                            {{item.commit.message.split('\n\n')[0]}}
                        </router-link>
                    </Title>
                    <Meta class="meta">
                        committed by {{item.author.login}} ⋅ <router-link to="/">{{item.sha.slice(0,8)}}</router-link>
                    </Meta>
                </CommitInfo>
            </Commit>
        </transition-group>
        
        <HiddenItemLoading v-if="data.length > 0 && pageInfo.hasNextPage" :loading="loading" :dataGetter="network_getData">
            {{(totalCount > 250 ? 250 : totalCount) - data.length}} {{(totalCount > 250 ? 250 : totalCount) - data.length > 1 ? 'commits' : 'commit'}} remained
        </HiddenItemLoading>
        
        <transition name="fade" appear>
            <CommonLoading v-if="loading && committedDateMarkedData.length != 0"
                            :preventClickEvent="false"
                            :position="loading ? 'center' : 'corner'"/>
        </transition> 
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {CommonLoading,ImgWrapper,SkeletonCircle,SkeletonRectangle} from '@/components'
    import {HiddenItemLoading} from '../components'
    import { authRequiredGet } from '@/network'
    import {util_dateFormat,util_emoji} from '@/util'
    import * as graphql from '../graphql'
    import * as api from '@/network/api'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_pull_request_detail_commits_page',
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                data: [],
                loading: false,
                pageInfo: {},
                totalCount: 0
            }
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
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
            async network_getData() {
                try{
                    this.loading = true

                    let url 
                    if(this.pageInfo.next) {
                        url = this.pageInfo.next.url
                    } else {
                        url = api.API_COMMITS_OF_PULL_REQUEST(this.$route.params)
                    }

                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                        }
                    )

                    this.data = this.data.concat(this.data,res.data)
                    this.pageInfo = parse(res.headers.link) || {}
                    
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            }
        },
        components: {
            CommonLoading,
            HiddenItemLoading,
            ImgWrapper,
            SkeletonCircle,
            SkeletonRectangle,
            Container: styled.div``,
            CutOffNotice: styled.div``,
            Commit: styled.div``,
            CommittedDate: styled.div``,
            CommitInfo: styled.div``,
            Title: styled.div``,
            Meta: styled.div``,
            Skeleton: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
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
    border-bottom: 1px solid #eaecef;
    position: relative;
    width: 100%;
    padding: 14px 15px 14px 45px;
    overflow-wrap: break-word;
    line-height: inherit;
    text-align: left;
    display: block;
    .img{
        position: absolute;
        top: 14px;
        left: 15px;
        border-radius: 3px;
    }
    .title{
        margin: 0 0 5px;
        font-size: 13px;
        font-weight: 600;
        line-height: 1.2;
        word-break: break-word;
        a{
            color: #24292e;
        }
    }
    .meta{
        display: block;
        margin: 0;
        font-size: 12px;
        color: #586069;
    }
}
</style>