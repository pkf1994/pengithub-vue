<template>
    <Other :data="data">
        <template v-slot:icon>
            <svg class="octicon octicon-cross-reference" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M16 1.25v4.146a.25.25 0 01-.427.177L14.03 4.03l-3.75 3.75a.75.75 0 11-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0111.604 1h4.146a.25.25 0 01.25.25zM2.75 3.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-2.5a.75.75 0 111.5 0v2.5A1.75 1.75 0 0113.25 13H9.06l-2.573 2.573A1.457 1.457 0 014 14.543V13H2.75A1.75 1.75 0 011 11.25v-7.5C1 2.784 1.784 2 2.75 2h5.5a.75.75 0 010 1.5h-5.5z"></path></svg>
        </template>
        <template v-slot:action>
            referenced this issue
            <span class="no-wrap">{{data.created_at | dateFormat('dd zzz yyyy')}}</span>
        </template>
        <template v-slot:additional>
            <div v-if="commit.sha" class="d-flex flex-auto">
                <!-- commit user avatars -->
                <CommitAuthorAvatar :url="data.url.replace('/git','')"></CommitAuthorAvatar>

                <!-- commit message -->
                <div class="pr-1 flex-auto min-width-0">
                    <code>
                        <router-link :to="`/${owner}/${repo}/${data.sha}`" class="link-gray">{{commit.commit.message.split('\n\n')[0]}}</router-link>
                    </code>
                    <details v-if="commit.commit.message.split('\n\n')[1]">
                        <summary class="ellipsis-expander ml-1">
                            ...
                        </summary>
                        <div>
                            <code>
                                {{commit.commit.message.split('\n\n')[1]}}
                            </code> 
                        </div> 
                    </details> 
                </div> 

                <!-- commit status -->
                <CommitStatusIcon class="flex-shrink-0 mt-1" :sha="commit.sha"></CommitStatusIcon>

                <!-- commit sha -->

                <div class="text-right no-wrap">
                    <code>
                        <router-link class="link-gray" :to="`/${owner}/${repo}/${commit.sha}`">{{commit.sha.substring(0,7)}}</router-link>
                    </code>    

                </div> 
            </div> 
        </template>
    </Other>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_markdownParse} from '@/util'
    import Other from './Other'
    import { authRequiredGet } from '@/network'
    import IssueStateBadge from '../../IssueStateBadge.vue'
    import {CommitStatusIcon,CommitAuthorAvatar} from '../../../../../components'  
    export default {
        props: {
            data: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                loading: false,
                showCommitMessageBody: false,
                commit: {},
            }
        },
        computed: {
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
        },
        created() {
            this.getRelevantCommit()
        },
        methods: {
            async getRelevantCommit() {
                if(!this.data.commit_url || this.data.commit_url === null ) return
                this.loading = true
                let res = await authRequiredGet(
                    this.data.commit_url
                )
                this.commit = res.data
                this.loading = false
            },
        },
        components: {
            Other,
            CommitStatusIcon,
            CommitAuthorAvatar,
            SourceCommit: styled.div``,
        }
    }
</script>

<style scoped lang='scss'>
summary::-webkit-details-marker {
    display: none;
}
</style>