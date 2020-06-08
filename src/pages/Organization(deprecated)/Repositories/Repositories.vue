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
                    <OrgDescription v-if="organizationBasicInfo().description" class="text-gray-light">{{organizationBasicInfo().description}}</OrgDescription>
                        <div class="d-flex mt-3 list-style-none f6 flex-column flex-md-row">
                            <OrgInfoRow v-if="organizationBasicInfo().location" class="mr-md-3 v-align-middle text-gray-dark mb-1 css-truncate css-truncate-target">
                                <svg class="octicon octicon-location flex-shrink-0" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 0C2.69 0 0 2.5 0 5.5 0 10.02 6 16 6 16s6-5.98 6-10.5C12 2.5 9.31 0 6 0zm0 14.55C4.14 12.52 1 8.44 1 5.5 1 3.02 3.25 1 6 1c1.34 0 2.61.48 3.56 1.36.92.86 1.44 1.97 1.44 3.14 0 2.94-3.14 7.02-5 9.05zM8 5.5c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>
                                <span>{{organizationBasicInfo().location}}</span>
                            </OrgInfoRow>  
                            <OrgInfoRow v-if="organizationBasicInfo().blog" class="mr-md-3 v-align-middle text-gray-dark mb-1 css-truncate css-truncate-target">
                                <svg class="octicon octicon-link flex-shrink-0" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>
                                <a class="text-gray-dark" :title="organizationBasicInfo().blog" :href="organizationBasicInfo().blog">{{organizationBasicInfo().blog}}</a>
                            </OrgInfoRow>  
                            <OrgInfoRow v-if="organizationBasicInfo().email" class="mr-md-3 v-align-middle text-gray-dark mb-1 css-truncate css-truncate-target">
                                <svg class="octicon octicon-mail v-align-middle flex-shrink-0" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 4v8c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H1c-.55 0-1 .45-1 1zm13 0L7 9 1 4h12zM1 5.5l4 3-4 3v-6zM2 12l3.5-3L7 10.5 8.5 9l3.5 3H2zm11-.5l-4-3 4-3v6z"></path></svg>
                                <a class="text-gray-dark" :href="`mailto:${organizationBasicInfo().email}`">{{organizationBasicInfo().email}}</a>
                            </OrgInfoRow> 
                            <OrgInfoRow v-if="organizationBasicInfo().is_verified" class="d-inline-block v-align-middle mt-2 mb-0 mt-md-0 mb-md-1">
                                <span @click="() => openModal('verifyNotice')" class="Label Label--outline text-green rounded-1" :class="{'text-green': organizationBasicInfo().is_verified, 'text-red': !organizationBasicInfo().is_verified}">
                                    {{organizationBasicInfo().is_verified ? 'Verified' : 'Unverified'}}
                                </span>
                            </OrgInfoRow> 
                        </div>
                </OrgInfo>
            </Jumbotron>
        </AnimatedHeightWrapper>

        <h2 class="f4 text-normal d-md-none my-3" v-if="pinnedRepositories.data.length > 0">Pinned repositories</h2>

        <transition-group name="fade-group" appear>
            <PinnedRepoListItem v-for="item in pinnedRepositories.data" :key="item.id" :repository="item" class="mb-3"></PinnedRepoListItem>
        </transition-group>
        
        <transition name="fade" appear>
            <input v-if="firstLoadedFlag" v-model="searchQuery" class="form-control width-full my-3" placeholder="Find a repository…" autocomplete="off">
        </transition>

        <transition name="fade" appear>
            <FilterRow v-if="firstLoadedFlag" class="border-bottom pb-3">
                <button class="btn mr-1" @click="() => openModal('selectTypeModal')">
                    <i>Type:</i>
                    <span>{{type || 'All' | capitalize}}</span>
                    <span class="dropdown-caret"></span>
                </button>  

                <button class="btn" @click="() => openModal('selectLanguageModal')">
                    <i>Language:</i>
                    <span>{{language || 'All'}}</span>
                    <span class="dropdown-caret"></span>
                </button>  
            </FilterRow>
        </transition>

        <AnimatedHeightWrapper>
            <ClearFilterRow v-if="firstLoadedFlag && (type || language) && !loading" class="d-flex flex-justify-between border-bottom border-gray-light py-3">
                <div class="user-repo-search-results-summary" v-if="filterNoticeHTML" v-html="filterNoticeHTML">
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
            <RepoListItem v-for="item in data" :key="item.name" :repository="item"></RepoListItem>
        </transition-group>

        <SimplePagination v-if="pageInfo.withNext || pageInfo.withPrev" :loading="loading" :withPrev="pageInfo.withPrev" :withNext="pageInfo.withNext"></SimplePagination>

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
                <router-link :to="`/search?q=topic:${item.topic}+org:${organization}+fork:true`" v-for="item in statistic.mostUsedTopics.slice(0,5)" :key="item.topic" class="topic-tag topic-tag-link">
                        {{item.topic}}
                </router-link>
            </MostUsedTopics>
        </transition>
       

        <transition name="fade" appear>
            <CommonLoading v-if="loadingOrganizationBasicInfo() || loading || statistic.loading || pinnedRepositories.loading" :position="loadingOrganizationBasicInfo() || loading ? 'center' : 'corner'"></CommonLoading>
        </transition>

        <Modal title="Select type" ref="selectTypeModal">
            <router-link v-for="item in sortModalRouterLink" :key="item.label" :to='item.routerLink'>
                <SelectMenuItem :selected="type == item.meta" @click.native="closeModal">
                    <span>{{item.label}}</span>    
                </SelectMenuItem>
            </router-link> 
        </Modal>

        <Modal ref="selectLanguageModal" title="Select language" :modalStyle="{height:'80vh'}" @show="network_getAvailableLanguage">
             <div v-if="availableLanguage.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div class="select-menu-text-filter p-3">
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
    import {CommonLoading,Modal,SelectMenuItem,AnimatedHeightWrapper,LoadingIconEx,ImgWrapper,HyperlinkWrapper,SimplePagination} from '@/components'
    import {RepoListItem,PinnedRepoListItem} from './components'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet,commonGet} from '@/network' 
    import {util_queryParse,util_analyseFileType} from '@/util'
    var parse = require('parse-link-header');
    export default {
        name: 'organization_repositories_page',
        mixins: [RouteUpdateAwareMixin],
        inject: ['loadingOrganizationBasicInfo','organizationBasicInfo'],
        provide() {
            return {
                extraDataProvided: () => this.extraData
            }
        },
        data() {
            return {
                searchQuery: '',
                data: [],
                count: 0,
                loading: false,
                perPage: 10,
                totalCount: 0,
                pageInfo: {
                    withNext: false,
                    withPrev: false
                },
                filterNoticeHTML: '',
                topLanguages: [],
                mostUsedTopics: [],
                people: [],
                extraData: [],
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
                return this.$route.query.type
            },
            page() {
                return this.$route.query.page
            },
            language() {
                return this.$route.query.language
            },
           
            sortModalRouterLink() {
                return [
                    {
                        routerLink: `/orgs/${this.organization}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                type: 'all',
                            })
                        }`,
                        label: 'All',
                    },
                    {
                        routerLink: `/orgs/${this.organization}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                type: 'sources'
                            })
                        }`,
                        label: 'Sources',
                        meta: 'sources',
                    },
                    {
                        routerLink: `/orgs/${this.organization}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                type: 'forks'
                            })
                        }`,
                        label: 'Forks',
                        meta: 'forks',
                    },
                    {
                        routerLink: `/orgs/${this.organization}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                type: 'archived'
                            })
                        }`,
                        label: 'Archived',
                        meta: 'archived',
                    },
                    {
                        routerLink: `/orgs/${this.organization}?${
                            util_queryParse.querify({
                                ...this.$route.query,
                                type: 'mirrors'
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
            orgDomain() {
                if(!this.organizationBasicInfo().blog) return
                return this.organizationBasicInfo().blog.replace(/^http(s)?:\/\//,'').split('/')[0]
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            network_getData() {
                this.network_getRepositoresAndStatisticData()
                if(this.accessToken) this.network_getPinnedRepos()
            },
            async network_getRepositoresAndStatisticData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_PROXY_OGRANIZATION_REPOSITORIES_AND_STATISTIC({
                        login: this.organization,
                        params: this.$route.query
                    })
                    let res = await commonGet(url,{cancelToken,headers: {"Accept":"*/*"}})

                    this.parseHTML(res.data)
                    this.firstLoadedFlag = true
                    
                }catch(e) {
                    this.handleError(e,{handle404: true})
                }finally{
                    this.loading = false
                }
            },
            async network_getPinnedRepos() {
                try{
                    this.pinnedRepositories.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_pinned_repos')

                    let graphql_pinnedRepos = graphql.GRAPHQL_ORG_PINNED_REPOS

                    let res = await authRequiredGitHubGraphqlApiQuery(
                            graphql.GRAPHQL_ORG_PINNED_REPOS,
                            {
                                variables: {
                                    login: this.organization
                                }
                            }
                        )
                    
                    try{
                        this.pinnedRepositories.data = res.data.data.organization.pinnableItems.nodes
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.pinnedRepositories.loading = false
                }
            },
            parseHTML(HTML) {

                //let repositoryPattern = /<li [^>]*>(?:.|\r|\n)*?<a.*href="(.*?)".*data-hovercard-type="repository"[^>]*>(?:\r|\n)?\s*(.*)(?:\r|\n)?\s*<\/a>(?:.|\r|\n)*?<p.*itemprop="description">((?:.|\r|\n)*?)<\/p>(?:.|\r|\n)*?<span class="repo-language-color" style="background-color: (.*)">(?:.|\r|\n)*?<span itemprop="programmingLanguage">(.*)<\/span>(?:.|\r|\n)*?<span class="mr-3">(?:\r|\n)\s*<svg.*class="octicon octicon-law mr-1"[^>]*>.*<\/svg>(?:\r|\n)\s*(.*)(?:\r|\n)\s*<\/span>(?:.|\r|\n)*?<a[^>]*>(?:\r|\n)\s*<svg.*aria-label="fork"[^>]*>.*<\/svg>(?:\r|\n)\s*(.*)(?:\r|\n)\s*<\/a>(?:.|\r|\n)*?<a[^>]*>(?:\r|\n)\s*<svg.*class="octicon octicon-star"[^>]*>.*<\/svg>(?:\r|\n)\s*(.*)(?:\r|\n)\s*<\/a>(?:.|\r|\n)*?<a[^>]*>(?:\r|\n)\s*<svg.*class="octicon octicon-issue-opened"[^>]*>.*<\/svg>(?:\r|\n)\s*(.*)(?:\r|\n)\s*<\/a>(?:.|\r|\n)*?<a[^>]*>(?:\r|\n)\s*<svg.*class="octicon octicon-git-pull-request"[^>]*>.*<\/svg>(?:\r|\n)\s*(.*)(?:\r|\n)\s*<\/a>(?:.|\r|\n)*?<relative-time datetime="(.*?)"[^>]*>.*<\/relative-time>/g
                let repositoriesPattern = /<li [^>]*>(?:.|\r|\n)*?<\/relative-time>/g

                let topicsPattern = /<a class="topic-tag topic-tag-link f6 my-1"[^>]*>(?:\n|\r)\s*(.*)(?:\n|\r)\s*<\/a>/g
                let namePattern = /<a.*href="(.*?)".*data-hovercard-type="repository"[^>]*>(?:\r|\n)?\s*(.*)(?:\r|\n)?\s*<\/a>/g
                let forkedFromPattern = /Forked from(?:.|\r|\n)*?<a class=" muted-link " href="(.*?)">(?:\r|\n)\s*(.*)(?:\r|\n)\s*<\/a>/g
                let descriptionPattern = /<p.*itemprop="description">((?:.|\r|\n)*?)<\/p>/g
                let languageColorPattern = /<span class="repo-language-color" style="background-color: (.*)">/g
                let languagePattern = /<span itemprop="programmingLanguage">(.*)<\/span>/g
                let licensePattern = /<span class="mr-3">(?:\r|\n)\s*<svg.*class="octicon octicon-law mr-1"[^>]*>.*<\/svg>(?:\r|\n)\s*(.*)(?:\r|\n)\s*<\/span>/g
                let forksCountPattern = /<a[^>]*>(?:\r|\n)\s*<svg.*aria-label="fork"[^>]*>.*<\/svg>(?:\r|\n)\s*(.*)(?:\r|\n)\s*<\/a>/g
                let starsCountPattern = /<a[^>]*>(?:\r|\n)\s*<svg.*class="octicon octicon-star"[^>]*>.*<\/svg>(?:\r|\n)\s*(.*)(?:\r|\n)\s*<\/a>/g
                let openIssuesCountPattern = /<a[^>]*>(?:\r|\n)\s*<svg.*class="octicon octicon-issue-opened"[^>]*>.*<\/svg>(?:\r|\n)\s*(.*)(?:\r|\n)\s*<\/a>/g
                let pullRequestsCountPattern = /<a[^>]*>(?:\r|\n)\s*<svg.*class="octicon octicon-git-pull-request"[^>]*>.*<\/svg>(?:\r|\n)\s*(.*)(?:\r|\n)\s*<\/a>/g
                let updatedAtPattern = /<relative-time datetime="(.*?)"[^>]*>.*<\/relative-time>/g

                let repositories = []
                let repositoriesExecResult 

                //解析repositories
                while((repositoriesExecResult = repositoriesPattern.exec(HTML)) != null) {

                    let repositoryHolder = repositoriesExecResult[0]

                    let topics = []
                    let topicsExecResult
                    while((topicsExecResult = topicsPattern.exec(repositoryHolder)) != null) {
                        topics.push(topicsExecResult[1])
                    }

                    let name 
                    let routerLink
                    let nameExecResult
                    while((nameExecResult = namePattern.exec(repositoryHolder)) != null) {
                        routerLink = nameExecResult[1]
                        name = nameExecResult[2]
                    }

                    let forkedFrom
                    let forkedFromExecResult
                    while((forkedFromExecResult = forkedFromPattern.exec(repositoryHolder)) != null) {
                        forkedFrom = {
                            routerLink: forkedFromExecResult[1],
                            fullName: forkedFromExecResult[2]
                        }
                    }

                    let languageColor
                    let languageColorExecResult
                    while((languageColorExecResult = languageColorPattern.exec(repositoryHolder)) != null) {
                        languageColor = languageColorExecResult[1]
                    }

                    let language
                    let languageExecResult
                    while((languageExecResult = languagePattern.exec(repositoryHolder)) != null) {
                        language = languageExecResult[1]
                    }

                    let license
                    let licenseExecResult
                    while((licenseExecResult = licensePattern.exec(repositoryHolder)) != null) {
                        license = licenseExecResult[1]
                    }

                    let descriptionHTML
                    let descriptionExecResult
                    while((descriptionExecResult = descriptionPattern.exec(repositoryHolder)) != null) {
                        descriptionHTML = descriptionExecResult[1]
                    }

                    let forksCount
                    let forksCountExecResult
                    while((forksCountExecResult = forksCountPattern.exec(repositoryHolder)) != null) {
                        forksCount = forksCountExecResult[1]
                    }

                    let starsCount
                    let starsCountExecResult
                    while((starsCountExecResult = starsCountPattern.exec(repositoryHolder)) != null) {
                        starsCount = starsCountExecResult[1]
                    }

                    let openIssuesCount
                    let openIssuesCountExecResult
                    while((openIssuesCountExecResult = openIssuesCountPattern.exec(repositoryHolder)) != null) {
                        openIssuesCount = openIssuesCountExecResult[1]
                    }

                    let pullRequestsCount
                    let pullRequestsCountExecResult
                    while((pullRequestsCountExecResult = pullRequestsCountPattern.exec(repositoryHolder)) != null) {
                        pullRequestsCount = pullRequestsCountExecResult[1]
                    }

                    let updatedAt
                    let updatedAtExecResult
                    while((updatedAtExecResult = updatedAtPattern.exec(repositoryHolder)) != null) {
                        updatedAt = updatedAtExecResult[1]
                    }
                    
                    repositories.push({
                        topics,
                        routerLink,
                        name,
                        descriptionHTML,
                        languageColor,
                        language,
                        license,
                        forksCount,
                        starsCount,
                        openIssuesCount,
                        pullRequestsCount,
                        updatedAt,
                        forkedFrom
                    })
                }

                this.data = repositories

                //解析filter notice
                let filterNoticeHTMLPattern = /<div class="TableObject-item TableObject-item--primary v-align-top">((?:.|\r|\n)*?)<\/div>/g   
                let filterNoticeHTMLExecResult
                if((filterNoticeHTMLExecResult = filterNoticeHTMLPattern.exec(HTML)) != null ) {
                    this.filterNoticeHTML = filterNoticeHTMLExecResult[1]
                }else{
                    this.filterNoticeHTML = ''
                }

                //解析pagination
                let paginationNextPattern = /<a class="next_page"[^>]*>Next<\/a>/g
                let paginationPrevPattern = /<a class="next_page"[^>]*>Previous<\/a>/g

                if((HTML.match(paginationNextPattern)) != null) {
                    this.pageInfo.withNext = true
                }else{
                    this.pageInfo.withNext = false
                }
                if((HTML.match(paginationPrevPattern)) != null) {
                    this.pageInfo.withPrev = true
                }else{
                    this.pageInfo.withPrev = false
                }

                //解析top repositories
                let topLanguagesPattern = /<div class="Box-body">(?:\r|\n)\s*<h4 class="f4 mb-2 text-normal">Top languages<\/h4>((?:.|\r|\n)*?)<\/div>/g
                let topLanguagesMatchResult
                let topLanguages = []
                if((topLanguagesMatchResult = HTML.match(topLanguagesPattern)) != null) {
                    let topLanguagesHolder = topLanguagesMatchResult[0]
                    let topLanugageItemPattern = /<a[^>]*>(?:.|\n|\r)*?(?:<span class="repo-language-color" style="background-color: (.*)"><\/span>)?(?:\n|\r)\s*<span itemprop="programmingLanguage">(.*)<\/span>(?:\n|\r)\s*<\/span>(?:\n|\r)\s*<\/a>/g
                    let topLanguageItemExecResult
                    while((topLanguageItemExecResult = topLanugageItemPattern.exec(topLanguagesHolder)) != null) {
                        topLanguages.push({
                            color: topLanguageItemExecResult[1],
                            name: topLanguageItemExecResult[2],
                        })
                    }
                }
                this.topLanguages = topLanguages

                //解析most used topics
                let mostUsedTopicsPattern = /<h4[^>]*>Most used topics<\/h4>(?:\r|\n)\s*?<\/div>(?:\r|\n)\s*?<div[^>]*>(?:.|\r|\n)*?<\/div>/g
                let mostUsedTopicsMatchResult
                let mostUsedTopics = []
                if((mostUsedTopicsMatchResult = HTML.match(mostUsedTopicsPattern)) != null) {
                    let mostUsedTopicsHolder = mostUsedTopicsMatchResult[0]
                    let mostUsedTopicItemExecPattern = /<a[^>]*>(?:\n|\r)\s*(.*)(?:\n|\r)\s*<\/a>/g
                    let mostUsedTopicItemExecResult
                    while((mostUsedTopicItemExecResult = mostUsedTopicItemExecPattern.exec(mostUsedTopicsHolder)) != null) {
                        mostUsedTopics.push(mostUsedTopicItemExecResult[1])
                    }
                }
                this.mostUsedTopics = mostUsedTopics

                //解析people
                let peoplePattern = /<a.*href="(.*?)"[^>]*>(?:\n|\r)\s*<img.*src="(.*?)".*alt="@(.*)"[^>]*\/>(?:\n|\r)\s*<\/a>/g
                let peopleExecResult 
                let people = []
                while((peopleExecResult = peoplePattern.exec(HTML)) != null) {
                    people.push({
                        routerLink: peopleExecResult[1],
                        avatarUrl: peopleExecResult[2],
                        login: peopleExecResult[3]
                    })
                }
                this.people = people
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
                this.network_getPinnedRepos()
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
            SimplePagination,
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

        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/table-object/index.scss';
@import 'node_modules/@primer/css/labels/index.scss';
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

.topic-tag {
    display: inline-block;
    padding: .3em .9em;
    margin: 0 .5em .5em 0;
    white-space: nowrap;
    background-color: #f1f8ff;
    border-radius: 3px;
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
</style>