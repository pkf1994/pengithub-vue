<template>
    <Container class="px-3">
        <AnimatedHeightWrapper class="jumbotron-wrapper">
            <Jumbotron v-if="organizationBasicInfo().node_id" class="container-lg py-4 px-3 mt-lg-0 clearfix d-flex flex-items-start jumbotron"> 
                <transition name="fade" appear>
                    <ImgWrapper v-if="organizationBasicInfo().avatar_url" class="flex-shrink-0">
                        <img class="avatar" :src="organizationBasicInfo().avatar_url" width="100" height="100" :alt="`@${organizationBasicInfo().login}`">
                    </ImgWrapper>
                </transition>
                

                <OrgInfo class="pb-1 pb-md-0" style="padding-left: 20px;">
                    <h1 v-if="organizationBasicInfo().name" class="org-name text-gray-dark lh-condensed mb-1 mb-md-2">
                        {{organizationBasicInfo().name}}
                    </h1>
                    <OrgDescription v-if="organizationBasicInfo().description" class="text-gray-light">
                        {{organizationBasicInfo().description}}
                    </OrgDescription>
                    <div class="d-flex list-style-none f6 flex-column flex-md-row">
                        <OrgInfoRow v-if="organizationBasicInfo().location" class="mr-md-3 mb-2 v-align-middle text-gray-dark mb-1 css-truncate css-truncate-target">
                            <svg class="octicon octicon-location flex-shrink-0" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                            <span>{{organizationBasicInfo().location}}</span>
                        </OrgInfoRow>  
                        <OrgInfoRow v-if="organizationBasicInfo().blog" class="mr-md-3 my-2 v-align-middle text-gray-dark mb-1 css-truncate css-truncate-target">
                            <svg class="octicon octicon-link flex-shrink-0" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg>
                            <a class="text-gray-dark" :title="organizationBasicInfo().blog" :href="organizationBasicInfo().blog">{{organizationBasicInfo().blog}}</a>
                        </OrgInfoRow>  
                        <OrgInfoRow v-if="organizationBasicInfo().twitter_username" class="mr-md-3 my-2 v-align-middle text-gray-dark mb-1 css-truncate css-truncate-target">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 273.5 222.3" class="flex-shrink-0 octicon" height="16" width="16"><path d="M273.5 26.3a109.77 109.77 0 0 1-32.2 8.8 56.07 56.07 0 0 0 24.7-31 113.39 113.39 0 0 1-35.7 13.6 56.1 56.1 0 0 0-97 38.4 54 54 0 0 0 1.5 12.8A159.68 159.68 0 0 1 19.1 10.3a56.12 56.12 0 0 0 17.4 74.9 56.06 56.06 0 0 1-25.4-7v.7a56.11 56.11 0 0 0 45 55 55.65 55.65 0 0 1-14.8 2 62.39 62.39 0 0 1-10.6-1 56.24 56.24 0 0 0 52.4 39 112.87 112.87 0 0 1-69.7 24 119 119 0 0 1-13.4-.8 158.83 158.83 0 0 0 86 25.2c103.2 0 159.6-85.5 159.6-159.6 0-2.4-.1-4.9-.2-7.3a114.25 114.25 0 0 0 28.1-29.1" fill="currentColor"></path></svg>
                            <a class="text-gray-dark" :title="organizationBasicInfo().twitter_username" :href="`https://twitter.com/${organizationBasicInfo().twitter_username}`">@{{organizationBasicInfo().twitter_username}}</a>
                        </OrgInfoRow>  
                        <OrgInfoRow v-if="organizationBasicInfo().email" class="mr-md-3 my-2 v-align-middle text-gray-dark mb-1 css-truncate css-truncate-target">
                            <svg class="octicon octicon-mail v-align-middle flex-shrink-0" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zm-13 1.74v6.441c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809z"></path></svg>
                            <a class="text-gray-dark" :href="`mailto:${organizationBasicInfo().email}`">{{organizationBasicInfo().email}}</a>
                        </OrgInfoRow> 
                        <OrgInfoRow v-if="organizationBasicInfo().is_verified" class="d-inline-block v-align-middle mt-2 mb-0 mt-md-0 mb-md-1">
                            <span @click="() => openModal('verifyNotice')" class="label Label--outline" :class="{'label--success': organizationBasicInfo().is_verified, 'label--danger': !organizationBasicInfo().is_verified}">
                                {{organizationBasicInfo().is_verified ? 'Verified' : 'Unverified'}}
                            </span>
                        </OrgInfoRow> 
                    </div>
                </OrgInfo>
            </Jumbotron>
        </AnimatedHeightWrapper>

        <!-- <h2 class="f4 text-normal d-md-none my-3" v-if="pinnedRepositories.data.length > 0 || !accessToken">Pinned repositories</h2>

        <LoginNecessaryNotice v-if="!accessToken" class="px-3 py-4 text-gray-light text-center">
            <a href="javascript:void(0)" class="btn-link" @click="() => signIn()">Sign up with Oauth&nbsp;</a> 
            to show pinned repositories.
        </LoginNecessaryNotice>

        <transition-group name="fade-group" appear>
            <PinnedRepoListItem v-for="item in pinnedRepositories.data" :key="item.id" :repository="item" class="mb-3"></PinnedRepoListItem>
        </transition-group> -->
        
        <transition name="fade" appear>
            <input v-if="firstLoadedFlag" v-model="searchQuery" class="form-control width-full my-3" placeholder="Find a repository…" autocomplete="off">
        </transition>

        <transition name="fade" appear>
            <FilterRow v-if="firstLoadedFlag" class="border-bottom pb-3">
                <button class="btn mr-1 mb-1" @click="() => openModal('selectTypeModal')">
                    <i>Type:</i>
                    <span>{{type || 'All' | capitalize}}</span>
                    <span class="dropdown-caret"></span>
                </button>  

                <button class="btn mr-1 mb-1" @click="() => openModal('selectLanguageModal')">
                    <i>Language:</i>
                    <span>{{language || 'All'}}</span>
                    <span class="dropdown-caret"></span>
                </button>  

                <button class="btn mb-1" @click="() => openModal('selectSortOrderModal')">
                    <i>Sort:</i>
                    <span>{{sortOrderModalRouterLink.filter(i => i.meta == sort)[0] && sortOrderModalRouterLink.filter(i => i.meta == sort)[0].label || 'Last updated'}}</span>
                    <span class="dropdown-caret"></span>
                </button>  
            </FilterRow>
        </transition>

        <AnimatedHeightWrapper>
            <ClearFilterRow v-if="firstLoadedFlag && (type || language) && !loading" class="d-flex flex-justify-between border-bottom border-gray-light py-3">
                <div class="user-repo-search-results-summary">
                    <strong>{{totalCount}}</strong>
                    {{data.length > 1 ? 'results' : 'result'}} for 
                    <strong v-if="type">{{type}}</strong>
                    <span v-if="type">repositories</span>
                    <span v-if="language">written in</span>
                    <strong v-if="language">{{language}}</strong>
                </div>

                <div class="text-right v-align-top flex-shrink-0">
                    <router-link :to="`${$route.path}`" class="text-normal d-inline-block ml-3" style="color: #586069;">
                        <svg class="octicon octicon-x issues-reset-query-icon mt-1" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                        Clear filter
                    </router-link>      
                </div>
            </ClearFilterRow>
        </AnimatedHeightWrapper>

       <h2 class="f4 text-normal d-md-none mt-3" v-if="data.length > 0">Repositories</h2>

        <transition-group name="fade-group" appear>
            <RepoListItem v-for="item in data" :key="item.id" :repository="item"></RepoListItem>
        </transition-group>

        <Pagination class="paginate-container mb-5" v-if="data.length > 0 && (pageInfo.prev || pageInfo.next)">
            <div class="BtnGroup">
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.prev || loading" @click="() => changePage(true)">Previous</button>
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.next || loading"  @click="() => changePage(false)">Next</button>
            </div> 
        </Pagination>

        <transition name="fade" appear>
            <TopLanguages class="Box mb-3 p-3" v-if="statistic.topLanguages.length > 0">
                <h4 class="f4 mb-2 text-normal">Top languages</h4>
                <span v-for="item in statistic.topLanguages.slice(0,5)" :key="item.language" class="no-wrap text-gray d-inline-block muted-link mt-2">
                    <span class="ml-0 mr-2">
                        <span class="repo-language-color" :style="{backgroundColor: getLanguageColor(item.language)}"></span>
                        <span itemprop="programmingLanguage">{{item.language}}</span>
                    </span>
                    <span>&nbsp;</span>
                </span>
            </TopLanguages>
        </transition>

        <transition name="fade" appear>
            <MostUsedTopics class="Box mb-3 p-3" v-if="statistic.mostUsedTopics.length > 0">
                <h4 class="f4 mb-2 text-normal">Most used topics</h4>
                <router-link :to="`/search?q=topic:${item.topic}+org:${organization}+fork:true`" v-for="item in statistic.mostUsedTopics.slice(0,5)" :key="item.topic" class="topic-tag d-inline-block">
                    <Label :name="item.topic"></Label>
                </router-link>
            </MostUsedTopics>
        </transition>

        <transition name="fade" appear>
            <PinnedPeople class="Box mb-3 p-3" v-if="pinnedPeople.peopleCount > 0">
                <router-link tag="h4" class="f4 mb-2 text-normal" :to="`/orgs/${organization}/people`">
                    <span class="float-right f5 color-text-secondary">
                        <span class="js-profile-member-count">{{pinnedPeople.peopleCount}}</span>
                        <svg class="octicon octicon-chevron-right" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"></path></svg>
                    </span>
                    People
                </router-link>
                <router-link :to="`/${item.login}`" v-for="item in pinnedPeople.data" :key="item.id" class="topic-tag d-inline-block">
                    <ImgWrapper class="avatar avatar-user">
                        <img :src="item.avatarUrl" width="48" height="48" class="avatar avatar-user">
                    </ImgWrapper>
                </router-link>
            </PinnedPeople>
        </transition>
       

        <transition name="fade" appear>
            <CommonLoading v-if="loadingOrganizationBasicInfo() || loading || statistic.loading || pinnedRepositories.loading" :position="loadingOrganizationBasicInfo() || loading ? 'center' : 'corner'"></CommonLoading>
        </transition>

        <Modal title="Select type" ref="selectTypeModal">
            <router-link v-for="item in sortTypeModalRouterLink" :key="item.label" :to='item.routerLink'>
                <SelectMenuItem :selected="type == item.meta" @click.native="closeModal">
                    <span>{{item.label}}</span>    
                </SelectMenuItem>
            </router-link> 
        </Modal>

        <Modal title="Select order" ref="selectSortOrderModal">
            <router-link v-for="item in sortOrderModalRouterLink" :key="item.label" :to='item.routerLink'>
                <SelectMenuItem :selected="sort == item.meta" @click.native="closeModal">
                    <span>{{item.label}}</span>    
                </SelectMenuItem>
            </router-link> 
        </Modal>

        <Modal ref="selectLanguageModal" title="Select language" :modalStyle="{height:'80vh'}" @show="network_getAvailableLanguage">
             <div v-if="availableLanguage.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div v-else class="select-menu-text-filter p-3">
                <input type="text" v-model="availableLanguage.searchQuery" class="form-control" placeholder="Filter spoken languages" autofocus="" autocomplete="off"/>
            </div>
            <router-link v-if="language" :to="`${$route.path}${type ? '?type=' + type : '' }`">
                <SelectMenuItem>
                    <template v-slot:icon>
                        <svg height="16" class="octicon octicon-x select-menu-item-icon mr-2" class_names="select-menu-item-icon" viewBox="0 0 12 16" version="1.1" width="12" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
                    </template>
                    <span>Clear language</span>    
                </SelectMenuItem>
            </router-link> 
            <transition-group name="fade-group" appear>
                <!-- <router-link class="d-block" v-for="item in availableLanguage.data" :key="item.urlParam" :to='item.to'>
                   
                </router-link>  -->
                 <SelectMenuItem @click.native="() => routerWithLanguage(item.urlParam)" v-for="item in filterAvailableLanguage" :key="item.urlParam" :selected="language == item.name">
                    <span>{{item.name}}</span>    
                </SelectMenuItem>
            </transition-group>
        </Modal>

         <Modal title="Verified" ref="verifyNotice">
            <div class="verified-modal-body p-3">
                <p>
                    We've verified that the organization <strong>{{organizationBasicInfo().name}}</strong> controls the domain:
                </p>
                <div class="mb-1">
                    <svg class="octicon octicon-verified mr-1 text-green" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M15.67 7.066l-1.08-1.34a1.5 1.5 0 01-.309-.77l-.19-1.698a1.51 1.51 0 00-1.329-1.33l-1.699-.19c-.3-.03-.56-.159-.78-.329L8.945.33a1.504 1.504 0 00-1.878 0l-1.34 1.08a1.5 1.5 0 01-.77.31l-1.698.19c-.7.08-1.25.63-1.33 1.329l-.19 1.699c-.03.3-.159.56-.329.78L.33 7.055a1.504 1.504 0 000 1.878l1.08 1.34c.17.22.28.48.31.77l.19 1.698c.08.7.63 1.25 1.329 1.33l1.699.19c.3.03.56.159.78.329l1.339 1.08c.55.439 1.329.439 1.878 0l1.34-1.08c.22-.17.48-.28.77-.31l1.698-.19c.7-.08 1.25-.63 1.33-1.329l.19-1.699c.03-.3.159-.56.329-.78l1.08-1.339a1.504 1.504 0 000-1.878zM6.5 12.01L3 8.51l1.5-1.5 2 2 5-5L13 5.56l-6.5 6.45z"></path></svg>
                    <strong>{{orgDomain}}</strong>
                </div>
                <div class="pt-2">
                    <HyperlinkWrapper>
                        <a href="https://help.github.com/articles/verifying-your-organization-s-domain/">Learn more about verified organizations</a>
                    </HyperlinkWrapper>
                </div> 
            </div>
        </Modal>

    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {CommonLoading,Modal,SelectMenuItem,AnimatedHeightWrapper,LoadingIconEx,ImgWrapper,HyperlinkWrapper,Label} from '@/components'
    import {RepoListItem,PinnedRepoListItem} from './components'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    import {authRequiredGet,commonGet,authRequiredGitHubGraphqlApiQuery} from '@/network' 
    import {util_queryParse,util_analyseFileType} from '@/util'
    var parse = require('parse-link-header');
    export default {
        name: 'organization_repositories_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['loadingOrganizationBasicInfo','organizationBasicInfo'],
        data() {
            return {
                searchQuery: '',
                data: [],
                loading: false,
                perPage: 10,
                totalCount: 0,
                pageInfo: {
                },
                firstLoadedFlag: false,
                availableLanguage: {
                    searchQuery: '',
                    data: [],
                    loading: false
                },
                statistic: {
                    topLanguages: [],
                    mostUsedTopics: [],
                    loading: false
                },
                pinnedPeople: {
                    data: [],
                    peopleCount: 0,
                    loading: false
                },
                pinnedRepositories: {
                    data: [],
                    loading: false
                }
            }
        },
        computed: {
            organization() {
                return this.$route.params.organization
            },
            type() {
                return this.$route.query.type && this.$route.query.type.toLowerCase()
            },
            page() {
                return this.$route.query.page
            },
            typeQueryFragment() {
                if(this.type == 'forks') return 'fork:only'
                if(this.type == 'all') return 'fork:true'
                if(this.type == 'sources') return ''
                if(this.type == 'archived') return 'archived:true'
                if(this.type == 'mirrors') return 'mirrors:true'
                return 'fork:true'
            },
            sort() {
                return this.$route.query.sort && this.$route.query.sort.toLowerCase() || 'updated'
            },
            sortQueryFragment() {   
                return `sort:${this.sort}`
            },
            language() {
                return this.$route.query.language
            },
            sortOrderModalRouterLink() {
                return [
                    {
                        routerLink: `/orgs/${this.organization}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                sort: 'updated',
                                page: 1
                            })
                        }`,
                        label: 'Last updated',
                        meta: 'updated'
                    },
                   /*  {
                        routerLink: `/orgs/${this.organization}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                sort: 'name'
                            })
                        }`,
                        label: 'Name',
                        meta: 'name',
                    }, */
                    {
                        routerLink: `/orgs/${this.organization}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                sort: 'stars',
                                page: 1
                            })
                        }`,
                        label: 'Stars',
                        meta: 'stars',
                    },
                ]
            },
            sortTypeModalRouterLink() {
                return [
                    {
                        routerLink: `/orgs/${this.organization}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                type: 'all',
                                page: 1
                            })
                        }`,
                        label: 'All',
                    },
                    {
                        routerLink: `/orgs/${this.organization}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                type: 'sources',
                                page: 1
                            })
                        }`,
                        label: 'Sources',
                        meta: 'sources',
                    },
                    {
                        routerLink: `/orgs/${this.organization}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                type: 'forks',
                                page: 1
                            })
                        }`,
                        label: 'Forks',
                        meta: 'forks',
                    },
                    {
                        routerLink: `/orgs/${this.organization}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                type: 'archived',
                                page: 1
                            })
                        }`,
                        label: 'Archived',
                        meta: 'archived',
                    },
                    {
                        routerLink: `/orgs/${this.organization}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                type: 'mirrors',
                                page: 1
                            })
                        }`,
                        label: 'Mirrors',
                        meta: 'mirrors',
                    },
                ]
            },
            filterAvailableLanguage() {
                return this.availableLanguage.data.filter(i => (i.name.toLowerCase().indexOf(this.availableLanguage.searchQuery.toLowerCase()) != -1 || i.urlParam.toLowerCase().indexOf(this.availableLanguage.searchQuery.toLowerCase()) != -1))
            },
            query() {
                return `user:${this.organization} ${this.language ? 'language:' + this.language + ' ' : ''}${this.typeQueryFragment} ${this.sortQueryFragment}`.trim()
            },
            orgDomain() {
                if(!this.organizationBasicInfo().blog) return
                return this.organizationBasicInfo().blog.replace(/^http(s)?:\/\//,'').split('/')[0]
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true

                    /* if(this.accessToken) {
                        this.network_getPinnedRepos()
                    } */
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_SEARCH({
                        type: 'repositories',
                        params: {
                            q: this.query,
                            per_page: this.perPage,
                            page: this.page,
                        }
                    })
                    let res_rest = await authRequiredGet(url,{
                        cancelToken,
                        headers: {
                            'Accept': 'application/vnd.github.mercy-preview+json'
                        }
                    })

                    this.data = res_rest.data.items
                    this.totalCount = res_rest.data.total_count
                    this.pageInfo = parse(res_rest.headers.link) || {}
                    this.firstLoadedFlag = true

                    this.network_getStatisticData()

                    this.network_getPinnedPeople() 
                    
                }catch(e) {
                    this.handleError(e,{
                        httpErrorHandler: {
                            404: () => this.$router.replace('/404')
                        }
                    })
                }finally{
                    this.loading = false
                }
            },
            async network_getPinnedPeople() {
                try{
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_pinned_people')

                    let res = await authRequiredGitHubGraphqlApiQuery(
                            graphql.GRAPHQL_ORG_PINNED_PEOPLE,
                            {
                                variables: {
                                    login: this.organization
                                },
                                cancelToken
                            }
                        )
                    
                    try{
                        this.pinnedPeople.data = res.data.data.organization.membersWithRole.nodes
                        this.pinnedPeople.peopleCount = res.data.data.organization.membersWithRole.totalCount
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                }catch(e) {
                    this.handleError(e)
                }
            },
            network_getStatisticData() {
                if(this.accessToken) {
                    this.network_getStatisticDataFromGraphqlApi()
                } else {
                    this.network_getStatisticDataFromRestApi()
                }
            },
            async network_getStatisticDataFromRestApi() {
                try{
                    this.statistic.loading = true
                    //let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_statistic')
                    let currentPage = 1
                    let lastPage = 1
                    let repos = []
                    //记录organization，响应url变化
                    let organizationOrignal = this.organization
                    let organization = this.organization
                    while(currentPage <= lastPage && repos.length < 300) {
                        if(organization != organizationOrignal) {
                            throw new Error("cancel")
                        }
                        let url = api.API_ORG_REPOS(
                            this.organization,
                            {
                                page: currentPage,
                                per_page: 100
                            }
                        )
                        console.log(url)
                        let res = await authRequiredGet(url,{
                            headers: {
                                'Accept':"application/vnd.github.mercy-preview+json"
                            }
                        })
                        let pageInfo = parse(res.headers.link) || {}
                        currentPage += 1
                        lastPage = pageInfo.last ? pageInfo.last.page : 1
                        repos = repos.concat(res.data)
                        organization = this.organization
                    }

                    let languages = []
                    let topics = []
                    repos.forEach(i => {
                        let languageRecord = languages.filter(i_ => i.language && i_.language == i.language)[0]
                        if((!languageRecord) && i.language) {
                            languages.push({
                                language: i.language,
                                count: 1
                            })
                        } else if (languageRecord) {
                            languageRecord.count += 1
                        }

                        i.topics && i.topics.forEach(i_ => {
                            let topicRecord = topics.filter(i__ => i_ == i__.topic)[0]
                            if(!topicRecord) {
                                topics.push({
                                    topic: i_,
                                    count: 1
                                })
                            } else {
                                topicRecord.count += 1
                            }
                        })
                    })

                    languages.sort((a,b) => {
                        return b.count - a.count
                    })

                    topics.sort((a,b) => {
                        return b.count - a.count
                    })
                    
                    this.statistic.topLanguages = languages
                    this.statistic.mostUsedTopics = topics
                   
                }catch(e) {
                    if(e.message == 'cancel') return
                    this.handleError(e)
                }finally{
                    this.statistic.loading = false
                }
            },
            async network_getStatisticDataFromGraphqlApi() {
                try{
                    this.statistic.loading = true
                    //let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_statistic')
                    let endCursor
                    let hasNextPage = true
                    let repos = []
                    //记录organization，响应url变化
                    let organizationOrignal = this.organization
                    let organization = this.organization
                    while(hasNextPage && repos.length < 300) {
                        if(organization != organizationOrignal) {
                            throw new Error("cancel")
                        }
                        let res = await authRequiredGitHubGraphqlApiQuery(
                            graphql.GRAPHQL_ORG_STATISTIC,
                            {
                                variables: {
                                    query: this.query,
                                    after: endCursor
                                }
                            }
                        )
                        try{
                            repos = repos.concat(res.data.data.search.nodes)
                            hasNextPage = res.data.data.search.pageInfo.hasNextPage
                            endCursor = res.data.data.search.pageInfo.endCursor
                        }catch(e) {
                            this.handleGraphqlError(res)
                        }
                       
                        organization = this.organization
                    }

                    let languages = []
                    let topics = []
                    repos.forEach(i => {
                        let languageRecord = languages.filter(i_ => i.primaryLanguage && i_.language == i.primaryLanguage.name)[0]
                        if((!languageRecord) && i.primaryLanguage && i.primaryLanguage.name) {
                            languages.push({
                                language: i.primaryLanguage.name,
                                count: 1
                            })
                        } else if (languageRecord) {
                            languageRecord.count += 1
                        }

                        i.repositoryTopics && i.repositoryTopics.nodes.forEach(i_ => {
                            let topicRecord = topics.filter(i__ => i_.topic && i_.topic.name == i__.topic)[0]
                            if(!topicRecord) {
                                topics.push({
                                    topic: i_.topic.name,
                                    count: 1
                                })
                            } else {
                                topicRecord.count += 1
                            }
                        })
                    })

                    languages.sort((a,b) => {
                        return b.count - a.count
                    })

                    topics.sort((a,b) => {
                        return b.count - a.count
                    })
                    
                    this.statistic.topLanguages = languages
                    this.statistic.mostUsedTopics = topics
                   
                }catch(e) {
                    if(e.message == 'cancel') return
                    this.handleError(e)
                }finally{
                    this.statistic.loading = false
                }
            },
            async network_getAvailableLanguage() {
                if(this.availableLanguage.loading || this.availableLanguage.data.length > 0) return 
                try{
                    this.availableLanguage.loading = true
                    let url = api.API_ALL_LANGUAGE
                    let res = await commonGet(url)
                    this.availableLanguage.data = res.data
                }catch(e) {
                    console.log(e)
                }finally{
                    this.availableLanguage.loading = false
                }
            },
            changePage(goPrevPageFlag) {
                let queryStr = util_queryParse.querify({
                    ...this.$route.query,
                    page: goPrevPageFlag ? this.page - 1 : (this.page ? parseInt(this.page) + 1 : 2)
                })
                //console.log(`/orgs/${this.organization}?${queryStr}`)
                this.$router.push(`/orgs/${this.organization}?${queryStr}`)
            },
            openModal(ref) {
                this.$refs[ref].show = true
            },
            closeModal() {
                for(let key in this.$refs){
                    if(this.$refs[key].show) this.$refs[key].show = false
                }
            },
            routerWithLanguage(language) {
                this.closeModal()
                this.$router.push(`${this.$route.path}?` + util_queryParse.querify({
                    ...this.$route.query,
                    language:language
                }))
            },
            getLanguageColor(language) {
                return util_analyseFileType.getColorOfLanguage(language)
            },
        },
        watch: {
            organization() {
                this.componentActive && this.network_getStatisticData()
            }
        },
        components: {
            RepoListItem,
            CommonLoading,
            Modal,
            SelectMenuItem,
            AnimatedHeightWrapper,
            ImgWrapper,
            LoadingIconEx,
            PinnedRepoListItem,
            HyperlinkWrapper,
            Label,
            Container: styled.div``,
            LoadingWrapper: styled.div``,
            Jumbotron: styled.div``,
            OrgInfo: styled.div``,
            OrgName: styled.div``,
            OrgDescription: styled.div``,
            OrgInfoRow: styled.div``,
            FilterRow: styled.div``,
            ClearFilterRow: styled.div``,
            Pagination: styled.div``,
            TopLanguages: styled.div``,
            MostUsedTopics: styled.div``,
            PinnedPeople: styled.div``,
            LoginNecessaryNotice: styled.div``,

        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/table-object/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
.jumbotron-wrapper{
    margin-right: -16px;
    margin-left: -16px;
}
.jumbotron{
    color: #666;
    background-color: #fafbfc;
    border-bottom: 1px solid #eee;
}
.loading-wrapper{
    pointer-events: none;
    position:absolute;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    .inner{
        position:sticky;
        height:150px;
        top: calc(50% - 75px);
    }
}
.user-repo-search-results-summary {
    white-space: normal;
}

.issues-reset-query-icon {
    width: 18px;
    height: 18px;
    padding: 1px;
    margin-right: 3px;
    color: #fff;
    text-align: center;
    background-color: #6a737d;
    border-radius: 3px;
}

.paginate-container {
    margin-top: 20px;
    margin-bottom: 15px;
    text-align: center;
}

.select-menu-text-filter{
    position: sticky;
    top: 0px;
    background-color: #f6f8fa;
    border-bottom: 1px solid #dfe2e5;
    input {
        display: block;
        width: 100%;
        max-width: 100%;
        padding: 5px;
        border: 1px solid #dfe2e5;
        border-radius: 3px;
    }
}

.repo-language-color {
    position: relative;
    top: 1px;
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.org-name {
    min-height: 32px;
    margin-top: 0;
    font-size: 20px;
    font-weight: 400;
}
.css-truncate-target{
    max-width: 280px!important;
}

.dropdown-caret {
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: middle;
    content: "";
    border-top-style: solid;
    border-top-width: 4px;
    border-right: 4px solid transparent;
    border-bottom: 0 solid transparent;
    border-left: 4px solid transparent;
}

.topic-tag {
    margin: 0 .125em .333em 0;
}

.label{
    display: inline-block;
    padding: 0 7px;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    border-radius: 2em;
    background-color: initial!important;
    border: 1px solid transparent;
}

.label--success {
    color: var(--color-label-success-text);
    border-color: var(--color-label-success-border);
}

.label--danger {
    color: var(--color-label-danger-text);
    border-color: var(--color-label-danger-border);
}
</style>