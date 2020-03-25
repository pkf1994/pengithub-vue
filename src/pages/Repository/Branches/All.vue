<template>
    <Container class="pt-3">
        <transition name="fade" appear>
            <SimpleBubble v-if="allBranchesProvided().length != 0" title="All branches" :headerStyle="bubbleHeaderStyle">
                <transition-group name="fade" appear>
                     <BranchItem v-for="item in sortedAllBranches.slice(0,cursor)" 
                                :key="item.name" 
                                :branch="item" 
                                :magicStyle="{lineHeight: '1.5'}"
                                :style="{padding:'16px'}"></BranchItem>
                </transition-group>
            </SimpleBubble>
        </transition>

         <LoadMore v-if="cursor <= allBranchesProvided().length" @click="getMore" class="text-center px-3 pb-3 text-blue">
            Load more...({{allBranchesProvided().length - cursor}} items remained)
        </LoadMore>

        <transition name="fade" appear>
            <CommonLoading v-if="allBranchesProvided().length == 0"
                            :preventClickEvent="false"/>
        </transition> 
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {SimpleBubble,CommonLoading} from '@/components'
    import BranchItem from './BrancheItem'
    export default {
        name: 'repository_branches_all_page',
        inject: ['allBranchesProvided'],
        data() {
            return {
                cursor: 10,
                perPage: 10,
                bubbleHeaderStyle: {
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    paddingRight: '16px',
                    paddingLeft: '16px',
                }   
            }
        },
        computed: {
            sortedAllBranches() {
                let newAllBranches = [...this.allBranchesProvided()]
                newAllBranches.sort((a,b) => {
                    let lastCommittedStamp_a = Date.parse(new Date(a.target.history.nodes[0].committedDate))
                    let lastCommittedStamp_b = Date.parse(new Date(b.target.history.nodes[0].committedDate))
                    return lastCommittedStamp_b - lastCommittedStamp_a
                })
                return newAllBranches
            }
        },
        methods: {
            getMore() {
                this.cursor += this.perPage
            }
        },
        components: {
            SimpleBubble,
            CommonLoading,
            BranchItem,
            Container: styled.div``,
            LoadMore: styled.div``,
        }
    }
</script>

<style scoped>

</style>