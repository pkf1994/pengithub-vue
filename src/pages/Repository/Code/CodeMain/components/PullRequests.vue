<template>
    <ComplexBubble :loading="!codeBasicInfo().id" 
                    :disableFlag="pullRequests.totalCount === 0 && codeBasicInfo().id !== undefined" 
                    disableNotice="There are no recent pull request"
                    :delay="1500">
        <template v-slot:title>
            <Title  class="bubble-title" style="font-weight: 700">
                <svg class="v-align-text-bottom d-inline-block bubble-title-icon" fill="currentColor" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0010 15a1.993 1.993 0 001-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v6.56A1.993 1.993 0 002 15a1.993 1.993 0 001-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                pullRequests
            </Title>   
        </template>

        <Content class="bubble-content p-0">
           <IssueItem v-for="item in pullRequests.nodes || []" 
                    :key="item.id" 
                    :issue="item" 
                    :showLabels="true"
                    :showRepoFullName="false"
                        type="pullRequest"></IssueItem>    
        </Content>
        <template v-slot:footer>
            <router-link to="/" class="d-block footer text-center">
                View all pull requests
            </router-link>
        </template>
    </ComplexBubble>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble} from '../../../../../components'
    import {IssueItem} from '../../../components'
    import {WithRandomMetaMixin} from '../../../../../mixins'
    import {util_dateFormat,util_color} from '../../../../../util'
    export default {
        inject: ['codeBasicInfo'],
        
        computed: {
            pullRequests() {
                return this.codeBasicInfo().pullRequests || {}
            },
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
            IssueItem,
            Title: styled.div``,
            Content: styled.div``,
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