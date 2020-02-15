<template>
    <Container class="px-3 pt-3">
        <Header>
            <HeaderActions class="flex flex-justify-between flex-items-center mb-3">
                <router-link to="/" class="btn btn-primary d-inline-block btn-sm">
                    New issue
                </router-link>

                <a href="javascript:return false">Jump to bottom</a>
            </HeaderActions>

            <HeaderTitle class="title f1">
                {{data.title}}
                <span class="number">#{{data.number}}</span>
            </HeaderTitle>

            <HeaderMeta class="flex mt-2 mb-3 pb-3 flex-items-center header-meta">
                <State class="State State--green mr-2" style="text-transform:capitalize;">
                    <svg height="16" class="octicon" viewBox="0 0 14 16" version="1.1" width="14" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
                    {{data.state}}
                </State>   

                <MetaContent class="meta-content">
                    <router-link to="/" class="text-bold link-gray">{{data.user && data.user.login}}</router-link>
                    {{data.state}} this issue
                    <span class="no-wrap">on {{createdAt}}</span>&nbsp;· {{data.comments}} {{data.comments > 1 ? 'comments' : 'comment'}} 
                </MetaContent>
            </HeaderMeta>
        </Header>

        <Labels class="flex pb-3 mb-4 border-bottom">
            <span class="text-gray text-bold flex-shrink-0 col-3">Labels</span>    
            <div class="min-width-0 flex flex-wrap mt-n1">
                <Label  v-for="item in data.labels" 
                        class="mr-1 mt-1"
                        :name="item.name"
                        :color="item.color"
                        :key="item.name"></Label> 
            </div>
        </Labels>

        <transition name="fade" appear>
            <CommonLoading v-if="loading || loadingAdditionalData"
                            :preventClickEvent="false"
                            :position="loading ? 'center' : 'corner'"/>
        </transition>  
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoading,Label} from '../../../components'
    import {util_dateFormat} from '../../../util'
    import {ACTION_REPOSITORY_REQUEST_ISSUE_DETAIL_DATA} from '../../../store/modules/repository/actionTypes'
    import {mapState,mapActions} from 'vuex'
    export default {
        inject: ['owner','repo'],
        computed: {
            ...mapState({
                data: state => state.repository.issue.issueDetail.data,
                loading: state => state.repository.issue.issueDetail.loading,
                loadingAdditionalData: state => state.repository.issue.issueDetail.loadingAdditionalData,
            }),
            number() {
                return this.$route.params.number
            },
            createdAt() {
                return util_dateFormat.dateFormat('dd zzz yyyy', new Date(this.data.created_at))
            },
            updatedAt() {
                return util_dateFormat.dateFormat('dd zzz yyyy', new Date(this.data.updated_at))
            }
        },
        created() {
            this.action_getData({
                owner: this.owner,
                repo: this.repo,
                number: this.number
            })
        },
        methods: {
            ...mapActions({
                action_getData: ACTION_REPOSITORY_REQUEST_ISSUE_DETAIL_DATA
            })
        },
        components: {
            CommonLoading,
            Label,
            Container: styled.span``,
            Header: styled.div``,
            HeaderActions: styled.div``,
            HeaderTitle: styled.h1``,
            HeaderMeta: styled.div``,
            State: styled.div``,
            MetaContent: styled.div``,
            Labels: styled.div``
        }
    }
</script>

<style scoped lang="scss">
.title{
    margin-bottom: 0;
    font-weight: 400;
    line-height: 1.125;
    .number{
        font-weight: 300;
        color: #6a737d;
    }
}

.header-meta{
    font-size: 14px;
    color: #586069;
    border-bottom: 1px solid #e1e4e8;
    .meta-content{
        word-wrap: break-word;
        white-space: normal;
    }
}

</style>