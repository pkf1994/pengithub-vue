<template>
    <Illustration class="d-flex position-relative">
        <span class="max-commits">{{maxCommitCountBySingleAuthor}} {{maxCommitCountBySingleAuthor > 1 ? 'commits' : 'commit'}}</span>
            <YAxis class="y-axis"></YAxis> 
            <YAxis class="y-axis" style="top: 36px"></YAxis> 
        <Column v-for="item in sortCommitterData.slice(0,10)" :key="item.login || item.name" >
            <Bar class="bar mb-2 d-flex flex-column flex-justify-end">
                <BarInner class="bar-inner width-full" :style="{height:parseInt(item.commits * 100 / maxCommitCountBySingleAuthor) + '%'}"> 
                </BarInner>   
            </Bar>
            <Avatar class="avatar d-block round-1" :src="item.gravatar" height="20" width="20"></Avatar>   
        </Column>   
    </Illustration> 
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        inject: ['repoBasicInfo'],
        props: {
           committerData: Array
        },
        computed: {
            maxCommitCountBySingleAuthor() {
                let maxCount = 1
                this.committerData.forEach(i => {
                    if(i.commits > maxCount) maxCount = i.commits
                })
                return maxCount
            },
            sortCommitterData() {
                let sortCommitterData = [
                    ...this.committerData
                ]
                sortCommitterData.sort((a, b) => {
                    return b.commits - a.commits
                })

                return sortCommitterData
            },
        },
        components: {
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