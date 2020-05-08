<template>
    <Container class="p-3">
        <transition name="fade" appear>
            <button v-if="firstLoadedFlag" :disabled="refType.loading || !refType.data" class="btn css-truncate btn-sm" @click="() => openModal('switchBranchOrTagModal')">
                <i>{{refType.data || 'branch'}}:</i>
                <span class="css-truncate-target" v-if="ref">{{ref}}</span>
                <span class="dropdown-caret"></span>
            </button>
        </transition>
        
        <transition-group name="fade-group" appear>
            <CommitGroup v-for="item in commitGroups" class="the-commit-group" :key="item[0].node_id" :commitGroup="item"></CommitGroup>
        </transition-group>

        <Pagination class="paginate-container" v-if="data.length > 0 && (pageInfo.prev || pageInfo.next)">
            <div class="BtnGroup">
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.prev || loading" @click="() => changePage(true)">Newer</button>
                <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.next || loading"  @click="() => changePage(false)">Older</button>
            </div> 
        </Pagination>

        <transition name="fade" appear>
            <CommonLoading  v-if="loading || graphqlData.loading"
                            :position="loading ? 'center' : 'corner'"
                            :preventClickEvent="false"/>
        </transition> 
 
         <Modal ref="switchBranchOrTagModal" title="Switch branches/tags" :modalStyle="{height:'80vh'}" @show="network_getAllBranchesAndTags">
             <div v-if="allBranchesAndTags.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div class="select-menu-text-filter">
                <div class="p-3">
                    <input type="text" v-model="allBranchesAndTags.searchQuery" class="form-control" placeholder="Filter spoken languages" autofocus="" autocomplete="off"/>
                </div>
                <ModalTab class="SelectMenu-tabs" style="background-color: #f6f8fa;">
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('branch')" :class="{'active-modal-tab':allBranchesAndTags.modalCurrentTab == 'branch'}">Branches</button>
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('tag')" :class="{'active-modal-tab':allBranchesAndTags.modalCurrentTab == 'tag'}">Tags</button>
                </ModalTab>
            </div>
            <transition-group v-if="allBranchesAndTags.modalCurrentTab == 'branch'" name="fade-group" appear>
                <SelectMenuItem :key="defaultRef" v-if="defaultRef" @click.native="() => routerWithRef(defaultRef)" :selected="ref == defaultRef">
                    <span class="flex-1">{{defaultRef}}</span>    
                    <span class="Label Label--gray flex-self-start">default</span>
                </SelectMenuItem>
                <SelectMenuItem @click.native="() => routerWithRef(item.name)" v-for="item in filterAllBranches" :key="item.name" :selected="ref == item.name">
                    <span>{{item.name}}</span>    
                </SelectMenuItem>
            </transition-group>
            <transition-group v-if="allBranchesAndTags.modalCurrentTab == 'tag'" name="fade-group" appear>
                 <SelectMenuItem @click.native="() => routerWithRef(item.name)" v-for="item in filterAllTags" :key="item.name" :selected="ref == item.name">
                    <span>{{item.name}}</span>    
                </SelectMenuItem>
            </transition-group>
        </Modal>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoading,SelectMenuItem,LoadingIconEx,Modal} from '@/components'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import {util_queryParse} from '@/util'
    import CommitGroup from './CommitGroup'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {RouteUpdateAwareMixin,WithModalMixin} from '@/mixins'
    var parse = require('parse-link-header');
    export default {
        name: 'repository_commits_page',
        mixins: [RouteUpdateAwareMixin,WithModalMixin],
        inject: ['repoBasicInfo'],
        provide() {
            return {
                graphqlDataProvided: () => this.graphqlData.data
            }
        },
        data() {
            return {
                data: [],
                loading: false,
                pageInfo: {},
                perPage: 20,
                paramIsBranch: true,
                refType: {
                    data: undefined,
                    loading: false
                },
                graphqlData: {
                    data: [],
                    loading: false
                },
                firstLoadedFlag: false,
                allBranchesAndTags: {
                    modalCurrentTab: 'branch',
                    searchQuery: '',
                    branches: [],
                    tags: [],
                    loading: false
                }
            }
        },
        computed: {
            defaultRef() {
                return this.repoBasicInfo().defaultBranchRef && this.repoBasicInfo().defaultBranchRef.name
            },
            ref() {
                return this.$route.params.pathMatch || this.defaultRef
            },
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
            page() {
                return this.$route.query.page || 1
            },
            refTypeUpdateFlag() {
                return `${this.ref}-${this.owner}-${this.repo}`
            },
            commitGroups() {
                let commitGroups = []
                this.data.forEach(i => {
                    if(commitGroups.length == 0) {
                        commitGroups.push([i])
                        return false
                    }
                    let commitDate = new Date(i.commit.committer.date)
                    let prevCommitDate = new Date(commitGroups[commitGroups.length - 1][0].commit.committer.date)
                    if(commitDate.getFullYear() == prevCommitDate.getFullYear() && commitDate.getMonth() == prevCommitDate.getMonth() && commitDate.getDate() == prevCommitDate.getDate()) {
                        commitGroups[commitGroups.length - 1].push(i)
                    } else {
                        commitGroups.push([i])
                    }
                })
                return commitGroups
            },
            filterAllBranches() {
                 return this.allBranchesAndTags.branches.filter(i => (i.name.indexOf(this.allBranchesAndTags.searchQuery) != -1) && i.name !== this.defaultRef)
            },
            filterAllTags() {
                 return this.allBranchesAndTags.tags.filter(i => (i.name.indexOf(this.allBranchesAndTags.searchQuery) != -1))
            }
        },
        created() {
            console.log(this.$route)
            this.network_getData()
            this.network_determineRefType()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_REPOSITORY_COMMITS(this.owner,this.repo,{
                        perPage: this.perPage,
                        ...this.$route.query,
                        sha: this.ref,
                    })
                    let res = await authRequiredGet(url,{cancelToken})

                    this.data = res.data
                    this.pageInfo = parse(res.headers.link) || {}

                    this.network_getGraphqlData(this.data)
                    this.firstLoadedFlag = true
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_getGraphqlData(payload) {
                try{
                    this.graphqlData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_graphql_data')
                    
                    let graphql_ = graphql.GRAPHQL_COMMITS(payload)

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_,{cancelToken})

                    let graphqlData = []
                    for(let key in res.data.data){
                        graphqlData.push(res.data.data[key])
                    }
                    this.graphqlData.data = graphqlData

                }catch(e) {
                    console.log(e)
                }finally{
                    this.graphqlData.loading = false
                }
            },
            async network_determineRefType() {
                if(!this.ref) return 
                try{
                    this.refType.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' determine_ref_type')
                    let graphql_determineRefType = graphql.GRAPHQL_BRANCH_OR_TAG({
                        owner: this.owner,
                        repo: this.repo,
                        ref: this.ref
                    })
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_determineRefType,{cancelToken})
                    if(!res.data.data.repository.ref) {
                        throw new Error('404')
                    }
                    let refPrefix = res.data.data.repository.ref.prefix
                    if(refPrefix == 'refs/tags/') {
                        this.refType.data = 'tag'
                    } else {
                        this.refType.data = 'branch'
                    }

                }catch(e) {
                    console.log(e)
                }finally{
                    this.refType.loading = false
                }
            },
            async network_getAllBranchesAndTags() {
                if(this.allBranchesAndTags.branches.length > 0) return 
                try{
                    this.allBranchesAndTags.loading = true
                    
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_all_refs')
                    let graphql_allRefs = graphql.GRAPHQL_ALL_REFS({
                        repo: this.repo,
                        owner: this.owner
                    })

                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_allRefs,{cancelToken})

                    this.allBranchesAndTags.branches = res.data.data.repository.allBranches.nodes
                    this.allBranchesAndTags.tags = res.data.data.repository.allTags.nodes

                }catch(e) {
                    console.log(e)
                }finally{
                    this.allBranchesAndTags.loading = false
                }
            },
            changePage(goPrevPageFlag) {
                let queryStr = util_queryParse.querify({
                    ...this.$route.query,
                    page: goPrevPageFlag ? this.page - 1 : (this.page ? parseInt(this.page) + 1 : 2)
                })
                this.$router.push(`${this.$route.path}?${queryStr}`)
            },
            routerWithRef(ref) {
                this.closeModal()
                this.$router.push(`/${this.owner}/${this.repo}/commits/${ref}`)
            },
            switchModalTab(payload) {
                this.allBranchesAndTags.modalCurrentTab = payload
            }
        },
        watch: {
            refTypeUpdateFlag() {
                this.network_determineRefType()
            }
        },
        components: {
            CommonLoading,
            CommitGroup,
            Modal,
            SelectMenuItem,
            LoadingIconEx,
            Container: styled.div``,
            Pagination: styled.div``,
            ModalTab: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/truncate/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/select-menu/index.scss';
@import 'node_modules/@primer/css/labels/index.scss';
.the-commit-group:first-child{
    padding-top: 0px;
    margin-top: 15px;
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

.active-modal-tab{
    background: white
}
</style>