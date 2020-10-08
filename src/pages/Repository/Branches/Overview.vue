<template>
    <CommonLoadingWrapper class="pt-3" :loading="loading">
        <transition name="fade" appear>
             <SimpleBubble v-if="defaultBranch.name" title="Default branch" :headerStyle="bubbleHeaderStyle">
                <BranchItem :branch="defaultBranch"></BranchItem>
            </SimpleBubble>
        </transition>

        <transition name="fade" appear>
             <SimpleBubble  v-if="defaultBranch.name" 
                            title="Active branches" 
                            :disableFlag="defaultBranch.name && activeBranches.length == 0"
                            disableNotice="There aren't any active branches."
                            :headerStyle="bubbleHeaderStyle">
                <BranchItem v-for="item in activeBranches" :key="item.name" :branch="item"></BranchItem>
                  <router-link v-if="withMoreActiveBranches" :to="`/${owner()}/${repo()}/branches/active`" class="all-stale-br-link d-block p-2 text-center">
                    View more active branches
                    <svg class="octicon octicon-chevron-right ml-1" viewBox="0 0 8 16" version="1.1" width="8" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z"></path></svg>
                </router-link>
            </SimpleBubble>
        </transition>

        <transition name="fade" appear>
            <SimpleBubble v-if="defaultBranch.name" 
                            :disableFlag="defaultBranch.name && staleBranches.length == 0"
                            disableNotice="There aren't any stale branches."
                            title="Stale branches" 
                            :headerStyle="bubbleHeaderStyle">
                <BranchItem v-for="item in staleBranches.slice(0,5)" :key="item.name" :branch="item"></BranchItem>
                <router-link v-if="withMoreStaleBranches" :to="`/${owner()}/${repo()}/branches/stale`" class="all-stale-br-link d-block p-2 text-center">
                    View more stale branches
                    <svg class="octicon octicon-chevron-right ml-1" viewBox="0 0 8 16" version="1.1" width="8" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z"></path></svg>
                </router-link>
            </SimpleBubble>
        </transition>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {SimpleBubble,CommonLoadingWrapper} from '@/components'
    import BranchItem from './BrancheItem'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {commonGet} from '@/network'
    import * as api from '@/network/api'
    export default {
        name: 'repository_branches_overview_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['owner','repo',],
        data() {
            return {
                loading: false,
                defaultBranch: {
                    updatedAt: '',
                    updatedBy: '',
                    name: '',
                    stateSvg: undefined
                },
                activeBranches: [],
                staleBranches: [],
                withMoreActiveBranches: false,
                withMoreStaleBranches: false,
                bubbleHeaderStyle: {
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    paddingRight: '16px',
                    paddingLeft: '16px',
                }   
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_BRANCHES_OVERVIEW_INFO({
                        owner: this.owner(),
                        repo: this.repo()
                    })
                    let res = await commonGet(url,{cancelToken})
                    this.defaultBranch = this.parseDefaultBranchFromHTML(res.data) || {}
                    this.activeBranches =  this.parseActiveBranchesFromHTML(res.data) || []
                    this.staleBranches =  this.parseStaleBranchesFromHTML(res.data) || []
                    this.withMoreActiveBranches = res.data.indexOf('View more active branches') != -1
                    this.withMoreStaleBranches = res.data.indexOf('View more stale branches') != -1
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            parseDefaultBranchFromHTML(HTML) {
                console.log(HTML)
                let defaultBranchHolderPattern = /<h3[^>]*>Default branch<\/h3>([\s\S]*?)<\/ul>/g
                let defaultBranchHolder = HTML.match(defaultBranchHolderPattern)[0]
                let execPattern = /<branch-filter-item branch="(.*?)"[^>]*>(?:.|\n|\r)*?<time-ago datetime="(.*?)"[^>]*>.*<\/time-ago> by (?:<a[^>]*>(.*)<\/a>|(.*))/g
                let execResult = execPattern.exec(HTML)
                if(!execResult) return
                let stateSvgHolder = defaultBranchHolder.match(/<span class=".*"[^>]*>(?:\n|\r)\s*<svg[^>]*>.*<\/svg>(?:\n|\r)\s*<\/span>/g)
                return {
                    name: execResult[1],
                    updatedAt: execResult[2],
                    updatedBy: execResult[3] || execResult[4],
                    updatedByIsUser: defaultBranchHolder.indexOf('data-hovercard-type="user"') != -1,
                    stateSvg: stateSvgHolder && stateSvgHolder[0]
                }
                
            },
            parseActiveBranchesFromHTML(HTML) {
                let branchesHolderMatchPattern = /<span class="Box-title">Active branches<\/span>(?:\r|\n)\s*<\/div>(?:\r|\n)\s*<ul>((?:.|\n|\r)*?)<\/ul>/g
                let matchResult = HTML.match(branchesHolderMatchPattern)
                if(!matchResult || matchResult.length == 0) return
                let execPattern = /<li class="Box-row position-relative">(?:\r|\n)\s*<branch-filter-item branch="(.*)" class="d-flex flex-items-center Details">(?:.|\r|\n)*?<time-ago datetime="(.*)" class="no-wrap">(?:.*)<\/time-ago> by (?:<a[^>]*>(.*)<\/a>|(.*))(?:.|\r|\n)*?<\/li>/g
                let execResult
                let result = []
                while((execResult = execPattern.exec(matchResult[0])) != null) {
                    let stateSvgHolder = execResult[0].match(/<span class=".*" aria-label="(?:.*)">(?:\n|\r)\s*<svg[^>]*>.*<\/svg>(?:\n|\r)\s*<\/span>/g)
                    result.push({
                        name: execResult[1],
                        updatedAt: execResult[2],
                        updatedBy: execResult[3] || execResult[4],
                        updatedByIsUser: execResult[0].indexOf('data-hovercard-type="user"') != -1,
                        stateSvg: stateSvgHolder && stateSvgHolder[0]
                    })
                }
                return result
            }, 
            parseStaleBranchesFromHTML(HTML) {
                let branchesHolderMatchPattern = /<span class="Box-title">Stale branches<\/span>(?:\r|\n)\s*<\/div>(?:\r|\n)\s*<ul>((?:.|\n|\r)*?)<\/ul>/g
                let matchResult = HTML.match(branchesHolderMatchPattern)
                if(!matchResult || matchResult.length == 0) return
                let execPattern = /<li class="Box-row position-relative">(?:\r|\n)\s*<branch-filter-item branch="(.*)" class="d-flex flex-items-center Details">(?:.|\r|\n)*?<time-ago datetime="(.*)" class="no-wrap">(?:.*)<\/time-ago> by (?:<a[^>]*>(.*)<\/a>|(.*))(?:.|\r|\n)*?<\/li>/g
                let execResult
                let result = []
                while((execResult = execPattern.exec(matchResult[0])) != null) {
                    let stateSvgHolder = execResult[0].match(/<span class=".*" aria-label="(?:.*)">(?:\n|\r)\s*<svg[^>]*>.*<\/svg>(?:\n|\r)\s*<\/span>/g)
                    result.push({
                        name: execResult[1],
                        updatedAt: execResult[2],
                        updatedBy: execResult[3] || execResult[4],
                        updatedByIsUser: execResult[0].indexOf('data-hovercard-type="user"') != -1,
                        stateSvg: stateSvgHolder && stateSvgHolder[0]
                    })
                }
                return result
            } 
        },
        components: {
            SimpleBubble,
            BranchItem,
            CommonLoadingWrapper,
            Container: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
.all-stale-br-link{
    background-color: #f1f8ff;
    margin-top: -1px;
    list-style-type: none;
    border-top: 1px solid #e1e4e8;
}
</style>