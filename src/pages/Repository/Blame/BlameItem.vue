<template>
    <Container class="blame-commit px-3 py-2" :class="`blame-age-${blameItem.age}`">
        <BlameCommitDate class="ml-3 float-right date">
            {{blameItem.commit.committedDate | getDateDiff}}
        </BlameCommitDate>

        <AvatarStack class="d-inline-block mr-1 flex-shrink-0 AvatarStack">
            <div class="AvatarStack-body" :class="{'AvatarStack-body':committedNotByAuthor}">
                <router-link class="avatar avatar-user" v-if="blameItem.commit.author.user" :to="`/${blameItem.commit.author.user.login}`">
                    <img :src="blameItem.commit.author.avatarUrl" 
                        width="20"
                        height="20"
                        :alt="`@${blameItem.commit.author.user.login}`">
                </router-link>
                <span class="avatar avatar-user" v-else-if="blameItem.commit.author.avatarUrl">
                    <img :src="blameItem.commit.author.avatarUrl" 
                        width="20"
                        height="20"
                        :alt="`@${blameItem.commit.author.name}`">
                </span>
                <router-link class="avatar avatar-user" v-if="committedNotByAuthor && blameItem.commit.committer.user" :to="`/${blameItem.commit.committer.user.login}`">
                    <img :src="blameItem.commit.committer.avatarUrl" 
                        width="20"
                        height="20"
                        :alt="`@${blameItem.commit.committer.user.login}`">
                </router-link>
                 <span class="avatar avatar-user" v-else-if="committedNotByAuthor && blameItem.commit.committer.avatarUrl">
                    <img :src="blameItem.commit.committer.avatarUrl" 
                        width="20"
                        height="20"
                        :alt="`@${blameItem.commit.committer.name}`">
                </span>
            </div>
        </AvatarStack>

        <LineMessage class="d-inline-block v-align-top" style="color: #6a737d;line-height:20px">
            lines: from {{blameItem.startingLine}} to {{blameItem.endingLine}}
        </LineMessage>

        <CommitMessage class="blame-commit-content d-flex flex-items-center">
            <div class="blame-commit-message overflow-hidden pt-1">
                <router-link class="message f4 text-gray-dark" :to="blameItem.commit.commitResourcePath">
                    {{blameItem.commit.message}}
                </router-link>
            </div>
        </CommitMessage>
        
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        inject: ['owner','repo'],
        props: {
            blameItem: {
                type: Object,
                required: true
            }
        },
        computed: {
            committedNotByAuthor() {
                let authorLogin = this.blameItem.commit.author.user && this.blameItem.commit.author.user.login
                let committerLogin = this.blameItem.commit.committer.user && this.blameItem.commit.committer.user.login
                return authorLogin != committerLogin
            }
        },
        methods: {
       
        },
        components: {
            Container: styled.div``,
            BlameCommitDate: styled.div``,
            AvatarStack: styled.div``,
            CommitMessage: styled.div``,
            LineMessage: styled.div``,
            
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/avatars/index.scss';
.blame-commit{
    border-bottom: 1px solid #e1e4e8;
    border-right: 4px solid;
    .date{
        color: #6a737d;
    }
}

.blame-commit-content {
    flex-grow: 2;
    overflow: hidden;
}

.blame-age-1 {
    border-right-color: #f66a0a;
}
.blame-age-2 {
    border-right-color: rgba(246,106,10,.9);
}
.blame-age-3 {
    border-right-color: rgba(246,106,10,.8);
}
.blame-age-4 {
    border-right-color: rgba(246,106,10,.7);
}
.blame-age-5 {
    border-right-color: rgba(246,106,10,.6);
}
.blame-age-6 {
    border-right-color: rgba(246,106,10,.5);
}
.blame-age-7 {
    border-right-color: rgba(246,106,10,.4);
}
.blame-age-8 {
    border-right-color: rgba(246,106,10,.3);
}
.blame-age-9 {
    border-right-color: rgba(246,106,10,.2);
}
.blame-age-10 {
    border-right-color: rgba(246,106,10,.1);
}
</style>