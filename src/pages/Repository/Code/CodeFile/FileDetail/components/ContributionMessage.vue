<template>
    <ComplexBubble :loading="contributors.loading || loading" 
                    :withFooterBorderTop=false>
        <LastUpdateMessage class="bg-blue-light Box-body d-flex py-2 px-3 flex-column flex-justify-between">
            <CommitterAndMessage class="f6">
                <img class="avatar" width="20" height="20" :src="lastCommit.data.committer && lastCommit.data.committer.avatarUrl" :alt="`@${lastCommit.data.committer && lastCommit.data.committer.user.login}`">
                <router-link to="/" class="text-bold link-gray-dark lh-default v-align-middle">
                    {{lastCommit.data.committer && lastCommit.data.committer.user.login}}
                </router-link>
                <Message class="lh-default v-align-middle">
                    {{lastCommit.data.message}}
                </Message>
            </CommitterAndMessage>   
            <AbbreviatedOidAndCommittedDate class="d-inline-block flex-shrink-0 v-align-bottom f6 mt-2">
                <router-link to="/" class="pr-2 text-mono link-gray">
                    {{lastCommit.data.abbreviatedOid}}
                </router-link>
                <CommittedDate class="no-wrap">
                    on {{committedDate}}
                </CommittedDate>   
            </AbbreviatedOidAndCommittedDate>   
        </LastUpdateMessage>

        <template v-slot:footer>
            <Contributors class="py-2 px-3 d-flex flex-items-center flex-auto f6 border-bottom-0 flex-wrap">
                <span class="btn-link mr-2">
                    <strong>{{contributors.data.length}}</strong> {{contributors.data.length > 1 ? 'contributors' : 'contributor'}}
                </span>
                <span>
                    <router-link class="avatar-link" to='/' v-for="item in contributors.data" :key="item.login">
                        <img class="avatar mr-1" height='20' width='20' :src="item.avatarUrl"/> 
                    </router-link>   
                </span>
            </Contributors>
        </template>    
    </ComplexBubble>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble,AnimatedHeightWrapper} from '../../../../../../components'
    import {util_dateFormat} from '../../../../../../util'
    import {mapState} from 'vuex'
    export default {
        computed: {
            ...mapState({
                loading: state => state.repository.code.codeFile.fileDetail.loading,
                lastCommit: state => state.repository.code.codeFile.fileDetail.lastCommit,
                contributors: state => state.repository.code.codeFile.fileDetail.contributors,
            }),
            committedDate() {
                return util_dateFormat.dateFormat('dd zzz yyyy',new Date(this.lastCommit.data.committedDate))
            }
        },
        components: {
            ComplexBubble,
            AnimatedHeightWrapper,
            LastUpdateMessage: styled.div``,
            CommitterAndMessage: styled.span``,
            Message: styled.span``,
            AbbreviatedOidAndCommittedDate: styled.span``,
            CommittedDate: styled.span``,
            Contributors: styled.div``
        }
    }
</script>

<style scoped>
.avatar-link{
    margin-top: 1px;
    margin-bottom: 1px;
}
</style>