<template>
    <ComplexBubble v-if="repoBasicInfo().node_id"
                    :inactivatedFlagSignal="codeBasicInfo().id != undefined"
                    disableNotice="No branch yet">
        <template v-slot:title>
            <Title  class="bubble-title">
                <Inner class="inner">
                    <svg class="branch-icon" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 00-1-3.72C.88 1 0 1.89 0 3a2 2 0 001 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                    <SummaryAndDetail>
                        <template v-slot:summary>
                             <span>{{repoBasicInfo().default_branch}}</span>
                        </template>
                        <router-link :to="`/${owner()}/${repo()}/tree/${item.name}`" class="branch-item d" v-for="item in activeBranches.data" :key="item.name">
                            {{item.name}}
                        </router-link>
                        <router-link :to="`/${owner()}/${repo()}/branches`" class="branch-item d" style="font-weight: 400;">
                            View more branches
                        </router-link>
                    </SummaryAndDetail>
                </Inner>
            </Title>   
        </template>

        <AnimatedHeightWrapper>
            <Content class="bubble-content" v-if="lastCommit.data.node_id">
                Last commit by 
                <strong v-if="lastCommit.data.author">{{lastCommit.data.author.login}}</strong>
                <strong v-else-if="lastCommit.data.commit.author">{{lastCommit.data.commit.author.name}}</strong>
                {{lastCommit.data.commit.committer.date | getDateDiff}}
            </Content>
        </AnimatedHeightWrapper>

        <template v-slot:footer>
            <span class="d-flex">
                 <router-link :to="codeFileBrowserRouterLink" class="flex-grow-1 footer text-center d-inline-block">
                    <svg class="d-inline-block v-align-text-bottom" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"></path></svg>
                    View code  
                </router-link>
                 <router-link :to="findFileRouterLink" class="flex-grow-1 footer text-center d-inline-block" style="border-left: 1px solid #d1d5da;">
                    <svg class="octicon octicon-search" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0013 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 000-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"></path></svg>
                    Jump to file 
                </router-link>
            </span>
        </template>
    </ComplexBubble>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble,AnimatedHeightWrapper,SummaryAndDetail} from '@/components'
    import {util_dateFormat} from '@/util'
    import * as api from '@/network/api'
    import {authRequiredGet,cancelAndUpdateAxiosCancelTokenSource,commonGet} from '@/network'
    import { mapState, mapGetters } from 'vuex'
    export default {
        name: 'repository_code_main_branches',
        inject: ['owner','repo','codeBasicInfo','repoBasicInfo'],
        data() {
            return {
                data: [],
                lastCommit: {
                    data: {},
                    loading: false
                },
                activeBranches: {
                    data: [],
                    loading: false
                },
                loading: false,
                stretch: false
            }
        },
        computed: {
            commitAt: function() {
                if(this.codeBasicInfo().defaultBranchRef){
                    return this.codeBasicInfo().defaultBranchRef.target && util_dateFormat.getDateDiff(new Date(this.codeBasicInfo().defaultBranchRef.target.history.nodes[0].authoredDate))
                }
            },
            codeFileBrowserRouterLink() {
                return `/${this.owner()}/${this.repo()}/tree/${this.repoBasicInfo().default_branch}`
            },
            findFileRouterLink() {
                return `/${this.owner()}/${this.repo()}/find/${this.repoBasicInfo().default_branch}`
            },
            activeBranchList() {
                let activeBranchList = []
                if(this.codeBasicInfo().refs) {
                    this.codeBasicInfo().refs.nodes.forEach(item => {
                        let lastCommitDate = new Date(item.target.history.nodes[0].committedDate)
                        if(Date.parse(new Date()) - Date.parse(lastCommit.Date) < 90 * 24 * 3600000 ) {
                            if(item.name != (this.codeBasicInfo().defaultBranchRef && this.codeBasicInfo().defaultBranchRef.name)) activeBranchList.push(item)
                        }
                    })
                }
                if(!this.accessToken) {
                    activeBranchList = this.data.filter(i => i.name != this.repoBasicInfo().default_branch).slice(0,4)
                }
                return activeBranchList
            },
            updateFlag() {
                return `${this.owner()}/${this.repo()}`
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            triggerStretch() {
                this.stretch = !this.stretch
            },
            network_getData() {
                this.network_getLastCommit()
                this.network_getActiveBranches()
                /* let url_lastCommit.data = api.API_REPOSITORY_COMMITS({
                    owner: this.owner(),
                    repo: this.repo(),
                    params: {per_page:1}
                })
                let url_branches = api.API_REPOSITORY_BRANCHES({
                    owner: this.owner(),
                    repo: this.repo(),
                    params: {per_page:5}
                })
                authRequiredGet(url_lastCommit.data).then(res => {
                    this.lastCommit.data = res.data[0]
                }).catch(e => {
                    console.log(e)
                })
                authRequiredGet(url_branches).then(res => {
                    this.data = res.data
                }).catch(e => {
                    console.log(e)
                }) */
            },
            async network_getLastCommit() {
                try{
                    this.lastCommit.loading = true
                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_last_commit').cancelToken
                    let url_lastCommit = api.API_REPOSITORY_COMMITS({
                        owner: this.owner(),
                        repo: this.repo(),
                        params: {per_page:1}
                    })
                    let res = await authRequiredGet(url_lastCommit,{cancelToken})
                    this.lastCommit.data = res.data[0]
                }catch(e) { 
                    console.log(e)
                }finally{
                    this.lastCommit.loading = false
                }
            },
            async network_getActiveBranches() {
                try{
                    this.activeBranches.loading = true
                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_active_branches').cancelToken
                    let url_activeBranches = api.API_REPOSITORY_ACTIVE_BRANCHES({
                        owner: this.owner(),
                        repo: this.repo(),
                    })
                    let res = await commonGet(url_activeBranches,{cancelToken})
                    this.activeBranches.data = this.parseActiveBranchesFromHTML(res.data)
                }catch(e) { 
                    console.log(e)
                }finally{
                    this.activeBranches.loading = false
                }
            },
            parseActiveBranchesFromHTML(HTML) {
                let execPattern = /<a class="d-block d-md-none position-absolute top-0 bottom-0 left-0 right-0" aria-label="Link to (.*)\." href="(.*)"><\/a>/g
                let execResult
                let result = []
                while((execResult = execPattern.exec(HTML)) != null) {
                    result.push({
                        routerLink: execResult[1],
                        name: execResult[2]
                    })
                }
                return result
            }
        },
        watch: {
            updateFlag() {
                this.network_getData()
            },
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