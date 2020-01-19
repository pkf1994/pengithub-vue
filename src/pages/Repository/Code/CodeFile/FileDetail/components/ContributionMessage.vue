<template>
    <ComplexBubble>
        <LastUpdateMessage class="bg-blue-light Box-body d-flex py-2 px-3 flex-column flex-justify-between">
            <CommitterAndMessage class="f6">
                <img class="avatar" width="20" height="20" :src="lastCommit.data.committer && lastCommit.data.committer.avatarUrl" :alt="`@${lastCommit.data.committer && lastCommit.data.committer.user.login}`">
                <router-link to="/" class="text-bold link-gray-dark lh-default v-align-middle">
                    {{lastCommit.data.committer && lastCommit.data.committer.user.login}}
                </router-link>
                <Message class="lh-default v-align-middle">
                    {{lastCommit.data.committer && lastCommit.data.committer.message}}
                </Message>
            </CommitterAndMessage>   
            <AbbreviatedOidAndCommittedDate class="d-inline-block flex-shrink-0 v-align-bottom f6 mt-2 mt-md-0">
                <router-link to="/" class="pr-2 text-mono link-gray">
                    {{lastCommit.data.committer && lastCommit.data.committer.abbreviatedOid}}
                </router-link>
                <CommittedDate class="no-wrap">
                    on {{committedDate}}
                </CommittedDate>   
            </AbbreviatedOidAndCommittedDate>   
        </LastUpdateMessage>

        <template v-slot:footer>
            <Contributors class="Box-body d-flex flex-items-center flex-auto f6 border-bottom-0 flex-wrap">
                
            </Contributors>
        </template>    
    </ComplexBubble>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble} from '../../../../../../components'
    import {util_dateFormat} from '../../../../../../util'
    export default {
        computed: {
            ...mapState({
                lastCommit: state => state.repository.code.codeFile.fileDetail.lastCommit,
                contributors: state => state.repository.code.codeFile.fileDetail.contributors,
                data: state => state.repository.code.codeFile.fileDetail.data,
                loading: state => state.repository.code.codeFile.fileDetail.loading
            }),
            committedDate() {
                return util_dateFormat.dateFormat('dd zzz yyyy',new Date(this.lastCommit.data.committer && this.lastCommit.data.committer.committedDate))
            }
        },
        components: {
            ComplexBubble,
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

</style>