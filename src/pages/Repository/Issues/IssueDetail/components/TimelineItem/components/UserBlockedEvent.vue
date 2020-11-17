<template>
    <Other :data="data">
        <template v-slot:icon>
            <svg class="octicon octicon-primitive-dot" :class="{'loading-animation':loading}" viewBox="0 0 8 16" version="1.1" width="8" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"></path></svg>
        </template>
        <template v-slot:action>
            blocked <strong>{{blockedUser.login}}</strong> 
        </template>
    </Other>
</template>

<script>
    import styled from 'vue-styled-components'
    import Other from './Other'
    import { authRequiredGitHubGraphqlApiQuery  } from '@/network'
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
                blockedUser: {},
            }
        },
        created() {
            this.getBlockedUser()
        },
        methods: {
           async getBlockedUser() {
                this.loading = true
                
                let res = await authRequiredGitHubGraphqlApiQuery(
                    `
                    {
                        node(id: "${this.data.node_id}") {
                            ... on UserBlockedEvent {
                                subject{
                                    login
                                }
                            }
                        }
                    }
                    `
                )
                try{
                    this.blockedUser = res.data.data.node.subject 
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