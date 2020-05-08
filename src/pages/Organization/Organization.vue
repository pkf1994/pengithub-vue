<template>
    <Container>
        <BaseHeader>
            <div class="Header-item Header-item--full flex-justify-center d-lg-none position-relative">
                 <div class="css-truncate css-truncate-target width-fit position-absolute left-0 right-0 text-center">
                     <router-link class="Header-link" :to="`/orgs/${organization}`">{{organization}}</router-link>
                </div>
            </div> 
        </BaseHeader>
        <HeaderDetachTopTab :tabs="tabs"></HeaderDetachTopTab>

        <keep-alive>
            <router-view></router-view>
        </keep-alive>

        <transition name="fade" appear>
            <CommonLoading v-if="loading"></CommonLoading>
        </transition>

       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {BaseHeader,HeaderDetachTopTab,CommonLoading} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as api from '@/network/api'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery} from '@/network'
    var parse = require('parse-link-header');
    export default {
        name: 'organization_page',
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {
                organizationBasicInfo: () => this.data,
                loadingOrganizationBasicInfo: () => this.loading
            }
        },
        data() {
            return {
                data: {},
                memberCount: 0,
                loading: false,
            }
        },
        computed: {
            organization() {
                return this.$route.params.organization
            },
            tabs() {
                let tabs = [
                    {
                        routerLink: `/orgs/${this.organization}`,
                        label: 'Repositories',
                        exact: true,
                        meta: this.data.public_repos
                    },
                    {
                        routerLink: `/orgs/${this.organization}/people`,
                        label: 'People',
                        meta: this.memberCount
                    },
                ]
               /*  if(this.accessToken) {
                     tabs.push({
                        routerLink: `/orgs/${this.organization}/packages`,
                        label: 'Packages',
                        meta: this.extraData.data.registryPackages && this.extraData.data.registryPackages.totalCount
                    })
                } */
                return tabs
            },
            
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_ORG(this.organization)
                    let url_memberCount =  api.API_ORG_PUBLIC_MEMBER(
                        this.organization,
                        {
                            page:  1,
                            per_page: 1,
                        }
                    )

                    let res = await Promise.all([
                        authRequiredGet(
                            url,
                            {
                                cancelToken,
                                headers: {
                                    'Accept': 'application/vnd.github.surtur-preview+json'
                                }
                            }
                        ),
                        authRequiredGet(
                            url_memberCount,
                            {cancelToken}
                        ),
                    ])
                    
                   
                    this.data = res[0].data

                    let memberCountHolder = parse(res[1].headers.link)
                    this.memberCount = memberCountHolder.last ? memberCountHolder.last.page : 0

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
        },
        components: {
            BaseHeader,
            CommonLoading,
            HeaderDetachTopTab,
            Container: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/header/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
</style>