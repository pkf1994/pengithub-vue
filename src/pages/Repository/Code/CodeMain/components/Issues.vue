<template>
    <ComplexBubble :disableFlag="codeBasicInfo().issues && codeBasicInfo().issues.nodes.length === 0 && codeBasicInfo().id" 
                    disableNotice="There are no recent issues"
                    :delay="1500">
        <template v-slot:title>
            <Title  class="bubble-title" style="font-weight: 700">
                <svg class="v-align-text-bottom d-inline-block bubble-title-icon" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
                Issues
            </Title>   
        </template>

        <Content class="bubble-content p-0">
            <RestIssueItem v-for="item in issues" 
                        :key="item.node_id" 
                        :issue="item" 
                        :showLabels="true"
                        :showRepoFullName="false">
            </RestIssueItem>
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
    import {ComplexBubble} from '@/components'
    import {RestIssueItem} from '../../../components'
    import {util_dateFormat,util_color} from '@/util'
    import * as api from '@/network/api'
    import {authRequiredGet,cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    export default {
        name: 'repository_code_main_issues',
        inject: ['codeBasicInfo'],
        props: {
            issues: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                data: [],
                loading: false,
            }
        },
        created() {
            //this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = false
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_SEARCH('issues',{
                        q:`repo:${this.owner()}/${this.repo()} is:issue state:open is:public`,
                        sort: 'updated',
                        per_page: 5
                    })
                    let res = await authRequiredGet(url,{cancelToken: sourceAndCancelToken.cancelToken})
                    this.data = res.data.items
                }catch(e) {
                    console.log(e)
                }finally{
                    this.loading = false
                }
            }
        },
        components: {
            ComplexBubble,
            RestIssueItem,
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