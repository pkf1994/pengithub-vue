<template>
    <ComplexBubble :loading="loading"
                    :disableFlag="issues.length === 0 && !loading" 
                    disableNotice="There are no recent issues"
                    :delay="1500">
        <template v-slot:title>
            <Title  class="bubble-title" style="font-weight: 700">
                <svg class="v-align-text-bottom d-inline-block bubble-title-icon" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
                Issues
            </Title>   
        </template>

        <Content class="bubble-content p-0">
            <router-link to="/" class="d-block issue-item" v-for="item in issues" :key="item.id">
                <svg class="d-inline-block opened" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
                <Number class="number">
                    {{`#${item.number}`}}
                </Number> 
                <IssueTitle class="issue-title">
                    {{item.title}}
                </IssueTitle>
                <Byline class="by-line">
                    {{dateFormat(item.createdAt)}}
                </Byline>
                <Labels class="labels" v-if="item.labels.nodes.length > 0">
                    <span class="label d-inline-block" 
                        v-for="label in item.labels.nodes"
                        style="margin-right:2px"
                        :style="{color:isLight(`#${label.color}`) ? 'inherit' : '#fff',backgroundColor:`#${label.color}`}" 
                        :key="label.name">
                        {{label.name}}
                    </span>
                </Labels>
            </router-link>
        </Content>
        <template v-slot:footer>
            <router-link to="/" class="d-block footer text-center">
                View all issues
            </router-link>
        </template>
    </ComplexBubble>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble,AnimatedHeightWrapper} from '../../../../components'
    import {util_dateFormat,util_color} from '../../../../util'
    export default {
        props: {
            loading: {
                type: Boolean,
                default: false
            },
            totalCount: {
                type: Number,
                default: 0
            },
            issues: {
                type: Array,
                default: () => ([])
            }
        },
        computed: {
           
        },
        methods: {
            dateFormat(dataStr) {
                return util_dateFormat.getDateDiff(new Date(dataStr))
            },
            isLight(colorStr) {
                return util_color.isLight(colorStr)
            }
        },
        components: {
            ComplexBubble,
            AnimatedHeightWrapper,
            Title: styled.div``,
            Content: styled.div``,
            Number: styled.span``,
            IssueTitle: styled.strong``,
            Byline: styled.span``,
            Labels: styled.span``,
            Inner: styled.div``,
            Footer: styled.div``
        }
    }
</script>

<style scoped lang="scss">

.footer{
    padding: 10px 15px;
    font-weight: 500;
    line-height: 1.5;
    color: #0366d6;
}
.issue-item:first-child{
     border-top: none;
}
.issue-item{
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
.issue-title{
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
.labels{
    position: relative;
    display: block;
    margin-top: 2px;
    .label{
        height: 18px;
        padding: .15em 4px;
        font-size: 10px;
        line-height: 1.5;
        font-weight: 600;
        border-radius: 2px;
        box-shadow: inset 0 -1px 0 rgba(27,31,35,.12);
    }
}

</style>