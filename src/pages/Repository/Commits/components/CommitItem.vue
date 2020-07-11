<template>
    <Container class="commit Box-row Box-row--focus-gray mt-0 p-2 ">
        <CommitTitle class="h5 text-gray-dark mb-0">
            <router-link style="color: #444d56" :to="commit.html_url.replace('https://github.com','')">
                {{messageTitle}}
            </router-link>
        </CommitTitle>
        
        <CommitMeta class="commit-meta mt-1 d-flex" style="color: #24292e;">

            <div class="flex-grow-1">
                <AvatarStack v-if="commit.author && commit.committer && commit.author.login != commit.committer.login" class="AvatarStack flex-self-start AvatarStack-body" :class="{'AvatarStack--two':committedNotByAuthor}">
                    <div class="AvatarStack-body">
                        <img class="avatar avatar-user" height="20" width="20" :src="commit.author.avatar_url" :alt="`@${commit.author && commit.author.name}`">
                        <img class="avatar avatar-user" height="20" width="20" :src="commit.committer.avatar_url" :alt="`@${commit.author.name}`">
                    </div>
                </AvatarStack>

                <ImgWrapper class="mr-1 avatar avatar-user" v-else-if="commit.author">
                    <img class="avatar avatar-user" height="20" width="20" :src="commit.author.avatar_url" :alt="`@${commit.author && commit.author.name || 'Unknow'}`">
                </ImgWrapper>

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
                <span>
                    <transition-group appear name="fade">
                        <svg v-if="state == 'SUCCESS'" key="1" class="octicon octicon-check v-align-middle text-green" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                        <svg v-else-if="state == 'FAILURE'" key="2" class="octicon octicon-x v-align-middle text-red" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                    </transition-group>
                </span>
            </div>

        </CommitMeta>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper,ImgWrapper} from '@/components'
    export default {
        inject: ['graphqlDataProvided'],
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
            state() {
                let dataHolder = this.graphqlDataProvided().filter(i => {
                    return i.id == this.commit.node_id
                })[0]
                return dataHolder && dataHolder.status && dataHolder.status.state
            },
            messageTitle() {
                return this.commit.commit.message.split('\n')[0]
            }
        },
        methods: {
           
        },
        components: {
            AnimatedHeightWrapper,
            ImgWrapper,
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