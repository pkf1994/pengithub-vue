<template>
    <Container class="pt-3">
        <transition name="fade" appear>
             <SimpleBubble v-if="defaultBranchProvided().name" title="Default branch" :headerStyle="bubbleHeaderStyle">
                <BranchItem :branch="defaultBranchProvided()"></BranchItem>
            </SimpleBubble>
        </transition>

        <transition name="fade" appear>
             <SimpleBubble  v-if="defaultBranchProvided().name" 
                            title="Active branches" 
                            :disableFlag="defaultBranchProvided().name && activeBranches.length == 0"
                            disableNotice="There aren't any active branches."
                            :headerStyle="bubbleHeaderStyle">
                <BranchItem v-for="item in activeBranches" :key="item.name" :branch="item"></BranchItem>
            </SimpleBubble>
        </transition>

        <transition name="fade" appear>
            <SimpleBubble v-if="defaultBranchProvided().name" 
                            :disableFlag="defaultBranchProvided().name && staleBranches.length == 0"
                            disableNotice="There aren't any stale branches."
                            title="Stale branches" 
                            :headerStyle="bubbleHeaderStyle">
                <BranchItem v-for="item in staleBranches.slice(0,5)" :key="item.name" :branch="item"></BranchItem>
                <router-link v-if="staleBranches.length > 5" :to="`/${owner()}/${repo()}/branches/stale`" class="all-stale-br-link d-block p-2 text-center">
                    View more stale branches
                    <svg class="octicon octicon-chevron-right ml-1" viewBox="0 0 8 16" version="1.1" width="8" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z"></path></svg>
                </router-link>
            </SimpleBubble>
        </transition>
       
        <transition name="fade" appear>
            <CommonLoading v-if="!defaultBranchProvided().name"
                            :preventClickEvent="false"/>
        </transition> 
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {SimpleBubble,CommonLoading} from '@/components'
    import BranchItem from './BrancheItem'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as graphql from './graphql.js'
    export default {
        name: 'repository_branches_overview_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['owner','repo', 'allBranchesProvided','defaultBranchProvided'],
        data() {
            return {
                bubbleHeaderStyle: {
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    paddingRight: '16px',
                    paddingLeft: '16px',
                }   
            }
        },
        computed: {
            activeBranches() {
                let nowStamp = Date.parse(new Date())
                let activeBranches = this.allBranchesProvided().filter(i => {
                    let lastCommittedStamp = Date.parse(new Date(i.target.history.nodes[0].committedDate))
                    return (nowStamp - lastCommittedStamp) < 3 * 30 * 24 * 60 * 60 * 1000
                })
                activeBranches.sort((a,b) => {
                    let lastCommittedStamp_a = Date.parse(new Date(a.target.history.nodes[0].committedDate))
                    let lastCommittedStamp_b = Date.parse(new Date(b.target.history.nodes[0].committedDate))
                    return lastCommittedStamp_b - lastCommittedStamp_a
                })
                return activeBranches.filter(i => i.name != this.defaultBranchProvided().name).slice(0,5)
            },
            staleBranches() {
                let nowStamp = Date.parse(new Date())
                let staleBranches = this.allBranchesProvided().filter(i => {
                    let lastCommittedStamp = Date.parse(new Date(i.target.history.nodes[0].committedDate))
                    return (nowStamp - lastCommittedStamp) > 3 * 30 * 24 * 60 * 60 * 1000
                })
                staleBranches.sort((a,b) => {
                    let lastCommittedStamp_a = Date.parse(new Date(a.target.history.nodes[0].committedDate))
                    let lastCommittedStamp_b = Date.parse(new Date(b.target.history.nodes[0].committedDate))
                    return lastCommittedStamp_a - lastCommittedStamp_b
                })
                return staleBranches.filter(i => i.name != this.defaultBranchProvided().name)
            }
        },
        components: {
            SimpleBubble,
            CommonLoading,
            BranchItem,
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