<template>
    <ComplexBubble :loading="!codeBasicInfo().id" 
                    :disableFlag="!codeBasicInfo().defaultBranchRef && !codeBasicInfo.id" 
                    :inactivatedFlagSignal="codeBasicInfo().id != undefined"
                    disableNotice="No branch yet">
        <template v-slot:title>
            <Title  class="bubble-title">
                <Inner class="inner">
                    <svg class="branch-icon" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 00-1-3.72C.88 1 0 1.89 0 3a2 2 0 001 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                    <SummaryAndDetail>
                        <template v-slot:summary>
                             <span>{{codeBasicInfo().defaultBranchRef && codeBasicInfo().defaultBranchRef.name}}</span>
                        </template>
                        <router-link to="/" class="branch-item d" v-for="item in activeBranchList" :key="item.name">
                            {{item.name}}
                        </router-link>
                        <router-link :to="`/${owner()}/${repo()}/branches`" class="branch-item d" style="font-weight: 400;">
                            View more branches
                        </router-link>
                    </SummaryAndDetail>
                </Inner>
            </Title>   
        </template>

        <Content class="bubble-content" v-if="codeBasicInfo().defaultBranchRef && codeBasicInfo().defaultBranchRef.target">
            Last commit by <strong>{{codeBasicInfo().defaultBranchRef.target.history.nodes[0].author.user.login}}</strong> {{commitAt}}
        </Content>

        <template v-slot:footer>
            <router-link :to="codeFileBrowserRouterLink" class="d-block footer text-center">
                <svg class="d-inline-block v-align-text-bottom" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"></path></svg>
                View code  
            </router-link>
        </template>
    </ComplexBubble>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble,AnimatedHeightWrapper,SummaryAndDetail} from '../../../../../components'
    import {util_dateFormat} from '../../../../../util'
    import { mapState, mapGetters } from 'vuex'
    export default {
        inject: ['owner','repo','codeBasicInfo'],
        data() {
            return {
                stretch: false
            }
        },
        computed: {
            //deprecated
            ...mapState({
                loading: state => state.repository.code.loading,
                defaultBranch: state => state.repository.code.data.defaultBranchRef,
            }),
            /* ...mapGetters([
                'activeBranchList'
            ]), */
            commitAt: function() {
                if(this.codeBasicInfo().defaultBranchRef){
                    return this.codeBasicInfo().defaultBranchRef.target && util_dateFormat.getDateDiff(new Date(this.codeBasicInfo().defaultBranchRef.target.history.nodes[0].authoredDate))
                }
            },
            codeFileBrowserRouterLink() {
                if(this.codeBasicInfo().defaultBranchRef){
                    return `/${this.owner()}/${this.repo()}/tree/${this.codeBasicInfo().defaultBranchRef.name}`
                }
            },
            activeBranchList() {
                let activeBranchList = []
                if(this.codeBasicInfo().refs) {
                    this.codeBasicInfo().refs.nodes.forEach(item => {
                        let lastCommitDate = new Date(item.target.history.nodes[0].committedDate)
                        if(Date.parse(new Date()) - Date.parse(lastCommitDate) < 90 * 24 * 3600000 ) {
                            if(item.name != (this.codeBasicInfo().defaultBranchRef && this.codeBasicInfo().defaultBranchRef.name)) activeBranchList.push(item)
                        }
                    })
                }
                return activeBranchList
            }
        },
        methods: {
            triggerStretch() {
                this.stretch = !this.stretch
            }
        },
        components: {
            ComplexBubble,
            AnimatedHeightWrapper,
            SummaryAndDetail,
            Title: styled.div``,
            Inner: styled.div``,
            Summary: styled.div``,
            Detail: styled.div``,
            Content: styled.div``,
            Footer: styled.div``
        }
    }
</script>

<style scoped>
.inner{
    position: relative;
    padding-left: 19px;
    font-weight: 600;
}
.branch-icon{
    position: absolute;
    top: 1px;
    left: 0;
    width: 16px;
    margin-right: 2px;
    margin-left: -3px;
    color: #586069;
    text-align: center;
    vertical-align: text-bottom;
    display: inline-block;
    fill: currentColor;
}
.branch-item{
    display: block;
    padding: 6px 0;
    font-size: 14px;
    font-weight: 600;
}
.footer{
    padding: 10px 15px;
    font-weight: 500;
    line-height: 1.5;
    color: #0366d6;
}
</style>