<template>
    <Container class="commit Box-row--focus-gray mt-0 p-2">
        <CommitTitle class="h5 text-gray-dark mb-0">
            <router-link style="color: #444d56" :to="commit.html_url.replace('https://github.com','')">
                {{messageTitle}}
            </router-link>
        </CommitTitle>
        
        <CommitMeta class="commit-meta mt-1 d-flex" style="color: #24292e;">
            <CommitAuthorAvatar :commit="commit"></CommitAuthorAvatar>

            <div class="flex-grow-1">
                

                <span class="f6 text-gray min-width-0 mr-1" v-if="commit.author || commit.committer">
                    <router-link v-if="commit.author && committedNotByAuthor" class="commit-author tooltipped tooltipped-s user-mention" :to="`/${commit.author.login}`">{{commit.author.login}}</router-link>
                    <span v-if="commit.author && committedNotByAuthor" >authored and</span> 
                    <router-link class="commit-author tooltipped tooltipped-s user-mention" v-if="commit.committer" :to="`/${commit.committer.login}`">{{commit.committer.login}}</router-link>
                    committed 
                    <span>{{commit.commit.author.date | getDateDiff}}</span>
                </span>

                <span class="f6 text-gray min-width-0 mr-1" v-else>
                    <span v-if="commit.commit.author" class="commit-author tooltipped tooltipped-s user-mention">{{commit.commit.author.name}}</span>
                    <span v-if="commit.commit.author" >authored and</span> 
                    <span class="commit-author tooltipped tooltipped-s user-mention" v-if="commit.commit.committer">{{commit.commit.committer.name}}</span>
                    committed 
                    <span>{{commit.commit.author.date | getDateDiff}}</span>
                </span>

            </div>
            
            <div class="mx-1 d-flex flex-items-center"> 
                <CommitStatusIcon :commit="commit"></CommitStatusIcon>
            </div>

        </CommitMeta>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper,ImgWrapper} from '@/components'
    import {CommitStatusIcon} from '../../components'
    import {CommitAuthorAvatar} from '@/pages/Repository/components'
    import {mapActions} from 'vuex'
    import * as actionTypes from '@/store/modules/graphqlData/actionTypes'
    export default {
        props: {
            commit: {
                type: Object,
                required: true
            }
        },
        computed: {
            committedNotByAuthor() {
                if(!this.commit.author) return
                if(!this.commit.committer) return
                return this.commit.author.login != this.commit.committer.login
            },
            messageTitle() {
                return this.commit.commit.message.split('\n')[0]
            }
        },
        created() {
            if(!this.commitGraphqlData) this.action_getCommitGraphqlData({
                id: this.commit.node_id,
                graphql: `
                    query($ids:[ID!]!){
                        nodes(ids: $ids) {
                        ... on Commit {
                            id
                            authors (first: 4) {
                                nodes {
                                    name
                                    user {
                                    avatarUrl
                                    login
                                    name
                                    }
                                }
                            }
                            status {
                                state
                            }
                        }
                        }
                    }
                    `
            })
        },
        methods: {
           ...mapActions({
               action_getCommitGraphqlData: actionTypes.GET_NODES 
           })
        },
        components: {
            AnimatedHeightWrapper,
            ImgWrapper,
            CommitStatusIcon,
            CommitAuthorAvatar,
            Container: styled.div``,
            Time: styled.div``,
            CommitTitle: styled.p``,
            CommitMeta: styled.div``,
            AvatarStack: styled.div``,
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