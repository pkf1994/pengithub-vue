<template>
    <Other :data="data">
        <template v-slot:icon>
            <svg class="octicon octicon-git-branch" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path></svg>
        </template>
        <template v-slot:action>
            deleted the 
            <code class="width-fit commit-ref">{{headRefName}}</code>
            branch
        </template>
    </Other>
</template>

<script>
    import {Other} from '../../../../../../Issues/IssueDetail/components/TimelineItem/components'
    import {authRequiredGitHubGraphqlApiQuery} from '@/network'
    export default {
        props: { 
            data: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                headRefName: ''
            }
        },
        created() {
            this.getHeadRefDeletedName()
        },
        methods: {
            async getHeadRefDeletedName() {
                if(!this.accessToken) return
                try{
                    let res = await authRequiredGitHubGraphqlApiQuery(`
                        {
                            node(id: "${this.data.node_id}") {
                                ... on HeadRefDeletedEvent {
                                   headRefName
                                }
                            }
                        }
                    `)
                    
                    try{
                        this.headRefName = res.data.data.node.headRefName
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                }catch(e) {
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
.commit-ref{
    position: relative;
    display: inline-block;
    padding: 0 5px;
    font: .75em/2 SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    color: var(--color-branch-name-text,#274466);
    white-space: nowrap;
    background-color: var(--color-branch-name-bg,#eff7ff);
    border-radius: 6px;
}
</style>