<template>
    <ComplexBubble :loading="loading || loadingCommitCount"
                    disableNotice="There are no recent code change">
        <template v-slot:title>
            <Title  class="bubble-title" style="font-weight: 700">
                <svg class="v-align-text-bottom d-inline-block bubble-title-icon" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9.5 3L8 4.5 11.5 8 8 11.5 9.5 13 14 8 9.5 3zm-5 0L0 8l4.5 5L6 11.5 2.5 8 6 4.5 4.5 3z"></path></svg>
                Code changes
            </Title>   
        </template>

        <Content class="bubble-content">
            <p class="mb-3">
                <strong>{{commitCount}} commits</strong> have been push to all branches. 
                On {{defaultBranch}},
                <strong>{{defaultBranchStatistic.authorCount}} authors </strong> have push
                <strong>{{defaultBranchStatistic.commitCount}} commits</strong>,
                <strong>{{defaultBranchStatistic.additionCount}} additions and {{defaultBranchStatistic.deletionCount}} deletions</strong>.
            </p>

            <Illustration v-if="authorRank.length > 0" class="flex position-relative">
                <span class="max-commits">{{maxCommitCountBySingleAuthor}} {{maxCommitCountBySingleAuthor > 1 ? 'commits' : 'commit'}}</span>
                 <YAxis class="y-axis"></YAxis> 
                 <YAxis class="y-axis" style="top: 36px"></YAxis> 
                <Column v-for="item in authorRank" :key="item.author.id" >
                    <Bar class="bar mb-2 flex-column flex-justify-end">
                        <BarInner class="bar-inner width-full" :style="{height:item.height + '%'}"> 
                        </BarInner>   
                    </Bar>
                    <Avatar class="avatar d-block round-1" :src="item.author.avatar_url" height="20" width="20"></Avatar>   
                </Column>    
            </Illustration> 
        </Content>
     
    </ComplexBubble>
</template>

<script>
    import styled from 'vue-styled-components'
      import { mapActions, mapState } from 'vuex'
    import {ComplexBubble,AnimatedHeightWrapper} from '../../../../components'
    import {util_numberFormat} from '../../../../util'
    export default {
        props: {
           
        },
        data() {
            return {
                authorRank: [],
                maxCommitCountBySingleAuthor: 0
            }
        },
        computed: {
            ...mapState({
                loading: state => state.repository.pulse.codeChanges.loading,
                contributors: state => state.repository.pulse.codeChanges.data,
                commitCount: state => state.repository.pulse.codeChanges.commitCount.data,
                loadingCommitCount: state => state.repository.pulse.codeChanges.commitCount.loading,
                defaultBranch: state =>{ 
                    return state.repository.basic.data.defaultBranchRef ? state.repository.basic.data.defaultBranchRef.name : ""
                }
            }),
            defaultBranchStatistic() {
                let authorCount = 0
                let commitCount = 0
                let additionCount = 0
                let deletionCount = 0
                let authorRank = []
                this.contributors.forEach(item => {
                    let lastWeekData = item.weeks[item.weeks.length - 1]
                    if(lastWeekData.c > 0){
                        if(!this.maxCommitCountBySingleAuthor || lastWeekData.c > this.maxCommitCountBySingleAuthor) {
                            this.maxCommitCountBySingleAuthor = lastWeekData.c
                        }
                        authorRank.push({
                            commitTimeLastWeek: lastWeekData.c,
                            ...item
                        })
                        authorCount += 1
                        commitCount += lastWeekData.c
                        additionCount += lastWeekData.a
                        deletionCount += lastWeekData.d
                    }
                })

                authorRank.sort((a,b) => {
                    return b.commitTimeLastWeek - a.commitTimeLastWeek
                }).slice(0,10)

                authorRank.forEach(item => {
                    item.height = parseInt((item.commitTimeLastWeek/this.maxCommitCountBySingleAuthor)*100)
                })

                this.authorRank = authorRank

                return {
                    authorCount:util_numberFormat.thousands(authorCount),
                    commitCount:util_numberFormat.thousands(commitCount),
                    additionCount:util_numberFormat.thousands(additionCount),
                    deletionCount:util_numberFormat.thousands(deletionCount)
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
.avatar{

}
</style>