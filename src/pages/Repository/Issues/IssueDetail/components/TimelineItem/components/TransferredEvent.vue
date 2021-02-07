<template>
    <Other :data="data">
        <template v-slot:icon>
            <svg class="octicon octicon-primitive-dot" viewBox="0 0 8 16" version="1.1" width="8" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"></path></svg>
        </template>
        <template v-slot:action>
                transferred this issue from {{transferredFrom}}<!-- {{transferredEvent.fromRepository.owner}}/{{transferredEvent.fromRepository.repo}} -->
                <span class="no-wrap">
                    on
                    {{data.created_at | getDateDiff}}
                </span>
        </template>
    </Other>
</template>

<script>
    import styled from 'vue-styled-components'
    import Other from './Other'
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
                loading: false,
                transferredFrom: '',
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
            this.getTransferredFrom()
        },
        methods: {
            async getTransferredFrom() {
                this.loading = true
                
                let res = await authRequiredGitHubGraphqlApiQuery(
                    `
                    {
                        node(id: "${this.data.node_id}") {
                            ... on TransferredEvent {
                                fromRepository {
                                    nameWithOwner
                                }
                            }
                        }
                    }
                    `
                )
                try{
                    this.transferredFrom = res.data.data.node.fromRepository.nameWithOwner 
                }catch(e) {
                    this.handleGraphqlError(res)
                }
                this.loading = false
            },
        },
        components: {
            Other,
        }
    }
</script>

<style scoped lang='scss'>
</style>