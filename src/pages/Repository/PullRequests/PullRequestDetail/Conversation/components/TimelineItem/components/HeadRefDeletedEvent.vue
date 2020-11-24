<template>
    <Other :data="data">
        <template v-slot:icon>
            <svg class="octicon octicon-repo-push" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 3H3V2h1v1zM3 5h1V4H3v1zm4 0L4 9h2v7h2V9h2L7 5zm4-5H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h4v-1H1v-2h4v-1H2V1h9.02L11 10H9v1h2v2H9v1h2c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1z"></path></svg>
        </template>
        <template v-slot:action>
            deleted the 
            <code class="css-truncate css-truncate-target text-bold v-align-middle" style="max-width:165px;font-size:13px">{{headRefName}}</code>
            branch
        </template>
    </Other>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Other} from '../../../../../../Issues/IssueDetail/components/TimelineItem/components'
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

</style>