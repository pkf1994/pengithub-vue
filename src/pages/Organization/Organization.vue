<template>
    <Container>
        <BaseHeader>
            <div class="Header-item Header-item--full flex-justify-center d-lg-none position-relative">
                 <div class="css-truncate css-truncate-target width-fit position-absolute left-0 right-0 text-center">
                     <router-link class="Header-link" :to="`/orgs/${organization}`">{{organization}}</router-link>
                </div>
            </div> 

            <template v-slot:logout-slot>
                <div class="Header-item Header-item--full flex-justify-center d-lg-none position-relative">
                    <div class="css-truncate css-truncate-target width-fit position-absolute left-0 right-0 text-center">
                        <router-link class="Header-link" :to="`/orgs/${organization}`">{{organization}}</router-link>
                    </div>
                </div> 
            </template>
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
    import {authRequiredGet,commonGet} from '@/network'
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
                tabCounts: {
                    data: {},
                    loading: false
                },
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
                        meta: this.tabCounts.data.repositories && this.tabCounts.data.repositories.totalCount
                    },
                    {
                        routerLink: `/orgs/${this.organization}/packages`,
                        label: 'Packages',
                        meta: this.tabCounts.data.packages && this.tabCounts.data.packages.totalCount
                    },
                    {
                        routerLink: `/orgs/${this.organization}/people`,
                        label: 'People',
                        meta: this.tabCounts.data.members && this.tabCounts.data.members.totalCount
                    },
                    /* {
                        routerLink: `/orgs/${this.organization}/projects`,
                        label: 'Projects',
                        meta: this.tabCounts.data.projects && this.tabCounts.data.projects.totalCount
                    }, */
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
            network_getData() {
                this.network_getBasicInfo()
                this.network_getTabCounts()
            },
            async network_getTabCounts() {
                try{
                    this.tabCounts.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_tab_counts')

                    let url = api.API_PROXY_ORGANIZATION_TAB_COUNTS(this.organization)
                    
                    let res = await commonGet(
                        url,
                        {
                            headers: {
                                "Accept": "*/*"
                            }
                        }
                    )

                    this.tabCounts.data = res.data.data || {}

                }catch(e) {
                    console.log(e)
                }finally{
                    this.tabCounts.loading = false
                }
            },
            async network_getBasicInfo() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_ORG(this.organization)

                    let res = await authRequiredGet(
                            url,
                            {
                                cancelToken,
                                headers: {
                                    'Accept': 'application/vnd.github.surtur-preview+json'
                                }
                            }
                        )
                   
                    this.data = res.data

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            generateRouterMeta() {
                return this.organization
            }
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