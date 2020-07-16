<template>
    <CommonLoadingWrapper :loading="loading">
        
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import * as api from '@/network/api'
    import {authRequiredGet} from '@/network'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {CommonLoadingWrapper,SimplePagination} from '@/components'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_stargazers_page',
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                data: [],
                loading: false,
                pageInfo: {}
            }
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            page() {
                return this.$route.query.page || 1
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let url = api.API_REPOSITORY_STARGAZERS({
                        owner: this.owner,
                        repo: this.repo,
                        params: {
                            per_page: 15,
                            page: this.page
                        }
                    })
                    
                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                        }
                    )

                    this.data = res.data
                    this.pageInfo = parse(res.headers.link) || {}
                }catch(e) { 
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            }
        },
        components: {
            SimplePagination,
            CommonLoadingWrapper,
            Container: styled.div``
        }
    }
</script>

<style scoped>
</style>
