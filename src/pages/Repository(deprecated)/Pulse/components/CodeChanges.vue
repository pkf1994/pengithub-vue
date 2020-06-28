<template>
    <ComplexBubble :loading="commitStatistic().loading || commitCount().loading"
                    :disabledAnimatedWrapper="false"
                    disabledNotice="There are no recent code change">
        <template v-slot:title>
            <Title  class="bubble-title" style="font-weight: 700">
                <svg class="v-align-text-bottom d-inline-block bubble-title-icon" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9.5 3L8 4.5 11.5 8 8 11.5 9.5 13 14 8 9.5 3zm-5 0L0 8l4.5 5L6 11.5 2.5 8 6 4.5 4.5 3z"></path></svg>
                Code changes
            </Title>   
        </template>

        <Content class="bubble-content">
            <p class="mb-3">
                <strong>{{allBranchAuthorAndCommitCount.authors.length}} authors</strong> have pushed
                <strong>{{defaultBranchStatistic.commitCount}} {{defaultBranchStatistic.commitCount > 1 ? 'commits' : 'commit'}}</strong>
                to {{defaultBranch}} and
                <strong>{{allBranchAuthorAndCommitCount.totalCommitCount}} {{allBranchAuthorAndCommitCount.totalCommitCount > 1 ? 'commits' : 'commit'}}</strong>
                to all branches.
                On {{defaultBranch}},
                <strong>{{defaultBranchStatistic.changedfiles}} {{defaultBranchStatistic.changedfiles > 1 ? 'files' : 'file'}} </strong>
                have changed and there have been 
                <strong class="text-green">{{defaultBranchStatistic.additions | thousands}}</strong>
                <strong>{{defaultBranchStatistic.additions > 1 ? 'additions' : 'addition'}}</strong>
                and 
                <strong class="text-red">{{defaultBranchStatistic.deletions | thousands}}</strong>.
                {{defaultBranchStatistic.deletions > 1 ? 'deletions' : 'deletion'}}
            </p>

            <Illustration v-if="allBranchAuthorAndCommitCount.authors.length > 0" class="d-flex position-relative">
                <span class="max-commits">{{allBranchAuthorAndCommitCount.maxCommitCountBySingleAuthor}} {{allBranchAuthorAndCommitCount.maxCommitCountBySingleAuthor > 1 ? 'commits' : 'commit'}}</span>
                 <YAxis class="y-axis"></YAxis> 
                 <YAxis class="y-axis" style="top: 36px"></YAxis> 
                <Column v-for="item in allBranchAuthorAndCommitCount.authors" :key="item.user.id" >
                    <Bar class="bar mb-2 d-flex flex-column flex-justify-end">
                        <BarInner class="bar-inner width-full" :style="{height:parseInt(item.commitCount * 100 / allBranchAuthorAndCommitCount.maxCommitCountBySingleAuthor) + '%'}"> 
                        </BarInner>   
                    </Bar>
                    <Avatar class="avatar d-block round-1" :src="item.avatarUrl" height="20" width="20"></Avatar>   
                </Column>   
            </Illustration> 

            <p v-if="allBranchAuthorAndCommitCount.authors.length == 0">No contribution graph is available. Try adding some commits.</p>
        </Content>
     
    </ComplexBubble>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble,AnimatedHeightWrapper} from '@/components'
    import {util_numberFormat} from '@/util'
    export default {
        inject: ['commitStatistic','commitCount','repoBasicInfo'],
        props: {
           
        },
        data() {
            return {
                maxCommitCountBySingleAuthor: 0
            }
        },
        computed: {
            defaultBranch() {
                return this.repoBasicInfo().defaultBranchRef ? this.repoBasicInfo().defaultBranchRef.name : ""
            },
            defaultBranchStatistic() {
                let defaultBranchStatisticHolder = this.commitStatistic().data.filter(i => {
                    return i.name == this.defaultBranch
                })[0]

                if(!defaultBranchStatisticHolder) return {}

                let commitHistory = defaultBranchStatisticHolder.target.history.nodes

                let changedfiles = []     
                let additions = 0     
                let deletions = 0
                let commitCount = 0
                
                commitHistory.forEach(i => {
                    commitCount += 1
                    additions += i.additions
                    deletions += i.deletions
                    i.tree.entries.forEach(i_ => {
                        if(!changedfiles.some(i__ => i__.oid == i_.oid)) {
                            changedfiles.push(i_)
                        }
                    })
                })  

                return {
                    changedfiles: changedfiles.length,
                    additions,
                    deletions,
                    commitCount
                }
            },
            allBranchAuthorAndCommitCount() {
                let authors = []
                let totalCommitCount = 0
                this.commitStatistic().data.forEach(i => {
                    i.target.history.nodes.forEach(i_ => {
                        if(i_.status.state != 'SUCCESS') return false
                        totalCommitCount += 1
                        if(i_.author.user && i_.author.user.login) {
                            if(!authors.some(i__ => i__.user.login == i_.author.user.login)) {
                                authors.push({
                                    ...i_.author,
                                    commitCount: 1
                                })
                            } else {
                                let authorHolder = authors.filter(i___ => i___.user.login == i_.author.user.login)[0]
                                authorHolder.commitCount += 1
                            }
                        }
                    })
                })
                authors.sort((a,b) => {
                    return a.commitCount - b.commitCount
                })

                authors.reverse()
                return {
                    authors,
                    totalCommitCount,
                    maxCommitCountBySingleAuthor: authors[0] && authors[0].commitCount
                }
            }
        },
        components: {
            ComplexBubble,
            AnimatedHeightWrapper,
            Title: styled.div``,
            Content: styled.div``,
            Inner: styled.div``,
            Illustration: styled.div``,
            Column: styled.div``,
            Bar: styled.div``,
            BarInner: styled.div``,
            Avatar: styled.img``,
            YAxis: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/avatars/index.scss';
.bubble-content{
    padding: 15px;
    font-size: 15px;
}
.bar{
    width: 20px;
    height: 75px;
    margin-right: 5px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    opacity: .8;
    .bar-inner {
        background-color: #fb8532;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
    }
}
.y-axis{
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
    background: #f6f8fa;
}
.max-commits {
    position: absolute;
    top: 3px;
    right: 15px;
    font-size: 10px;
    color: #586069;
}

</style>