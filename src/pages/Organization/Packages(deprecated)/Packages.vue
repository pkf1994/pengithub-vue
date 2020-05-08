<template>
    <Container>
        <transition name="fade" appear>
            <CommonLoading v-if="loadingOrganizationBasicInfo() || loading" :position="loadingOrganizationBasicInfo() || loading ? 'center' : 'corner'"></CommonLoading>
        </transition>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoading,SimplePaginationRest} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import {util_queryParse} from '@/util'
    import * as graphql from './graphql'
    let parse = require('parse-link-header');
    export default {
        name: 'organization_packages_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['loadingOrganizationBasicInfo'],
        data() {
            return {
                data: [],
                loading: false,
                pageInfo: {}
            }
        },
        computed: {
            packageType() {
                let packageTypePool = [
                    'NPM',
                    'RUBYGEMS',
                    'MAVEN',
                    'DOCKER',
                    'DEBIAN',
                    'NUGET',
                    'PYTHON'
                ]
                return packageTypePool.filter(i => i.toLowerCase() == this.$route.query.package_type && this.$route.query.package_type.toLowerCase())[0]
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData(changePageFlag = false, nextFlag = true) {
                console.log('getData')
                if(!this.accessToken) return
                try{
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let variables = {
                        login: this.$route.params.organization,
                        packageType: this.packageType,
                        perPage: this.$route.query.per_page
                    }
                    if(changePageFlag && nextFlag) variables.after = this.pageInfo.endCursor
                    if(changePageFlag && !nextFlag) variables.before = this.pageInfo.startCursor
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_ORG_PACKAGES,
                        {
                            cancelToken,
                            variables
                        }
                    )
                    
                    console.log(res.data)
                }catch(e) {
                    this.handleError(e)
                }
            }
        },
        components: {
            CommonLoading,
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>