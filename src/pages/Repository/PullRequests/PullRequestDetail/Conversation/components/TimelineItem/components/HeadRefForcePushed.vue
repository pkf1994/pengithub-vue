<template>
    <Other :data="data">
        <template v-slot:icon>
            <svg class="octicon octicon-repo-push" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 3H3V2h1v1zM3 5h1V4H3v1zm4 0L4 9h2v7h2V9h2L7 5zm4-5H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h4v-1H1v-2h4v-1H2V1h9.02L11 10H9v1h2v2H9v1h2c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1z"></path></svg>
        </template>
        <template v-slot:action>
            force-pushed the 
            <span class="commit-ref user-select-contain">
                <span class="css-truncate-target">
                    {{pullRequestProvided().head && pullRequestProvided().head.label}}
                </span>
            </span>
            branch
            <span v-if="commit.abbreviatedOid">to</span>
            <code v-if="commit.abbreviatedOid" class="link-gray-dark text-bold">{{commit.abbreviatedOid}}</code>
            <span class="no-wrap">on {{data.created_at | dateFormat('dd zzz yyyy')}}</span>    
        </template>
    </Other>
</template>

<script>
    import {Other} from '../../../../../../Issues/IssueDetail/components/TimelineItem/components'
    import {authRequiredGitHubGraphqlApiQuery} from '@/network'
    import * as graphql from './graphql.js'
    export default {
        inject: ['owner','repo','pullRequestProvided'],
        props: { 
            data: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                loading: false,
                commit: {}, // referenced closed committed 
            }
        },
        created() {
            this.network_getCommit()
        },
        methods: {
        
            async network_getCommit() {
                try {
                    let res = await authRequiredGitHubGraphqlApiQuery(
                    graphql.GRAPHQL_HEAD_REF_FORCE_PUSH_EVENT,
                    {
                        variables: {
                            id: this.data.node_id
                        }
                    }
                    )

                    try {
                        this.commit = res.data.data.node.afterCommit || {}
                    } catch (e) {
                        console.log(e)
                    }

                } catch (e) {
                    console.log(e)
                }
                
            },
        },
        components: {
            Other,
        }
    }
</script>

<style scoped lang='scss'>
@import 'node_modules/@primer/css/truncate/index.scss';

.commit-ref {
    position: relative;
    display: inline-block;
    padding: 0 5px;
    font: .75em/2 SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    color:rgba(27, 31, 35, 0.6);
    white-space: nowrap;
    background-color: #eff7ff;
    border-radius: 6px;
}

</style>