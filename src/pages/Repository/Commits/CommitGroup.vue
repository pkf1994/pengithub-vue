<template>
    <Container class="container">
        <Time class="commit-group-title">
            <svg class="octicon octicon-git-commit" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z"></path></svg>
            {{commitGroup.length > 1 ? 'Commits' : 'Commit'}} on {{commitGroup[0].commit.author.date | dateFormat('zzz d, yyyy')}}
        </Time>

        <ol class="commit-group Box Box--condensed">
            <li v-for="item in commitGroup" :key="item.node_id" class="commit Box-row Box-row--focus-gray mt-0 p-2 ">
                <AnimatedHeightWrapper>
                    <CommitTitle v-if="getMessaageHeadlineHTML(item.node_id)" class="h5 text-gray-dark pb-2">
                        <router-link style="color: #444d56" :to="item.html_url.replace('https://github.com','')" v-html="getMessaageHeadlineHTML(item.node_id)">
                        </router-link>
                    </CommitTitle>
                </AnimatedHeightWrapper>
                
                <CommitMeta class="commit-meta d-flex flex-items-center" style="color: #24292e;">
                    <img class="avatar mr-1" height="20" width="20" :src="item.author.avatar_url" :alt="`@${item.author.name}`">

                    <div class="f6 text-gray min-width-0 mr-1">
                        <router-link class="commit-author tooltipped tooltipped-s user-mention" :to="`/${item.author.login}`">{{item.author.login}}</router-link>
                        committed 
                        <span>{{commitGroup[0].commit.author.date | getDateDiff}}</span>
                    </div>

                    <div>
                        <transition-group appear name="fade">
                            <svg v-if="getState(item.node_id) == 'SUCCESS'" key="1" class="octicon octicon-check v-align-middle text-green" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                            <svg v-else-if="getState(item.node_id) == 'FAILURE'" key="2" class="octicon octicon-x v-align-middle text-red" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                        </transition-group>
                    </div>
                </CommitMeta>
            </li>
        </ol>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper} from '@/components'
    export default {
        inject: ['graphqlDataProvided'],
        props: {
            commitGroup: {
                type: Array,
                required: true
            }
        },
        methods: {
            getMessaageHeadlineHTML(nodeID) {
                let dataHolder = this.graphqlDataProvided().filter(i => {
                    return i.id == nodeID
                })[0]
                return dataHolder && dataHolder.messageHeadlineHTML
            },
            getState(nodeID) {
                let dataHolder = this.graphqlDataProvided().filter(i => {
                    return i.id == nodeID
                })[0]
                return dataHolder && dataHolder.status && dataHolder.status.state
            }
        },
        components: {
            AnimatedHeightWrapper,
            Container: styled.div``,
            Time: styled.div``,
            CommitTitle: styled.p``,
            CommitMeta: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
.container{
    padding-top: 15px;
    padding-left: 39px;
    position: relative;
}
.container:before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 14px;
    z-index: -1;
    display: block;
    width: 2px;
    content: "";
    background-color: #eff1f3;
}
.commit-group-title {
    margin-left: -31px;
    color: #586069;
    svg{
        margin-right: 17px;
        color: #c6cbd1;
        background: #fff;
    }
}

.commit-group {
    margin-top: 10px;
    list-style-type: none;
}

.user-mention {
    font-weight: 600;
    color: #24292e;
    white-space: nowrap;
}
</style>