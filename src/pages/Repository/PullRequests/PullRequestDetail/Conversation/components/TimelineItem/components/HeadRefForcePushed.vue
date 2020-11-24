<template>
    <Other :data="data">
        <template v-slot:icon>
            <svg class="octicon octicon-repo-push" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1 2.5A2.5 2.5 0 013.5 0h8.75a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V1.5h-8a1 1 0 00-1 1v6.708A2.492 2.492 0 013.5 9h3.25a.75.75 0 010 1.5H3.5a1 1 0 100 2h5.75a.75.75 0 010 1.5H3.5A2.5 2.5 0 011 11.5v-9zm13.23 7.79a.75.75 0 001.06-1.06l-2.505-2.505a.75.75 0 00-1.06 0L9.22 9.229a.75.75 0 001.06 1.061l1.225-1.224v6.184a.75.75 0 001.5 0V9.066l1.224 1.224z"></path></svg>
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
    import styled from 'vue-styled-components'
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