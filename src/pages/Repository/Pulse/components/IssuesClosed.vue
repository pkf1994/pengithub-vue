<template>
    <ComplexBubble :loading="loading" 
                    :disableFlag="data.length === 0 && !loading" 
                    disableNotice="There are no recent issue been closed">
        <template v-slot:title>
            <Title  class="bubble-title" style="font-weight: 700">
                <svg class="v-align-text-bottom d-inline-block bubble-title-icon" fill="currentColor"  viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 10h2v2H7v-2zm2-6H7v5h2V4zm1.5 1.5l-1 1L12 9l4-4.5-1-1L12 7l-1.5-1.5zM8 13.7A5.71 5.71 0 012.3 8c0-3.14 2.56-5.7 5.7-5.7 1.83 0 3.45.88 4.5 2.2l.92-.92A6.947 6.947 0 008 1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7l-1.52 1.52c-.66 2.41-2.86 4.19-5.48 4.19v-.01z"></path></svg>
                {{issueCount}} Issues closed
            </Title>   
        </template>

        <Content class="bubble-content p-0">
            <IssueListItem
                v-for="item in data" 
                :key="item.id"
                :issue="item"
                :showLabels="false"
                :showRepoFullName="false"
                type="issue"
            ></IssueListItem>
        </Content>
        <template v-slot:footer>
            <LoadMore v-if="hasNextPage" @click="() => getMoreData(loadingMore)" :class="{'text-gray':loadingMore}" class="text-center p-3 text-blue">
            {{loadingMore ? 'Loading...' : 'Load more...'}}
            </LoadMore>
        </template>
    </ComplexBubble>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble,AnimatedHeightWrapper,IssueListItem} from '../../../../components'
    import {WithRandomMetaMixin} from '../../../../mixins'
    import {util_dateFormat} from '../../../../util'
    import {mapState,mapActions} from 'vuex'
    import {ACTION_REPOSITORY_REQUEST_PULSE_PULLS_MERGED} from '../../../../store/modules/repository/actionTypes'
    export default {
        inject: ['owner','repo'],
        props: {
            getMoreData: {
                type: Function,
                required: true
            }
        },
        computed: {
           ...mapState({
                loading: state => state.repository.pulse.issuesClosed.loading,
               data: state => {
                    let data = []
                    state.repository.pulse.issuesClosed.nodes.forEach(item => {
                        if(item.id) data.push(item)
                    })
                    return data
                },
                loadingMore: state => state.repository.pulse.issuesClosed.loadingMore,
                hasNextPage: state => state.repository.pulse.issuesClosed.pageInfo.hasNextPage,
                issueCount: state => state.repository.pulse.issuesClosed.issueCount,
           })
        },
        methods: {
             dateFormat(dataStr) {
                return util_dateFormat.getDateDiff(new Date(dataStr))
            },
            
        },
        components: {
            ComplexBubble,
            AnimatedHeightWrapper,
            IssueListItem,
            Title: styled.div``,
            Content: styled.div``,
            LoadMore: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.pullrequest-item:first-child{
     border-top: none;
}
.pullrequest-item{
    position: relative;
    width: 100%;
    padding: 14px 15px 14px 35px;
    overflow-wrap: break-word;
    line-height: inherit;
    text-align: left;
    border-top: 1px solid #eaecef;
    svg{
        position: absolute;
        top: 14px;
        left: 12px;
        width: 16px;
        text-align: center;
        vertical-align: bottom;
    }
}
.number{
    float: right;
    margin-bottom: 5px;
    margin-left: 5px;
    font-size: 11px;
    color: #6a737d;
}
.pullrequest-title{
    display: block;
    margin-right: auto;
    margin-bottom: 3px;
    font-weight: 600;
    line-height: 1.2;
    color: #0366d6;
    word-break: break-word;
}
.by-line{
    display: block;
    margin: 0;
    font-size: 12px;
    color: #586069;
}

</style>