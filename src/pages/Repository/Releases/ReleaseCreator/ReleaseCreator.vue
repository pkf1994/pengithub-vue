<template>
    <Container class="px-3">
        <transition name="fade" appear>
            <PaddingPageTopTab class="subnav" style="margin-right:-16px;margin-left:-16px;" :tabs="tabs"></PaddingPageTopTab>
        </transition>  

        <Editor class="py-3 border-top border-bottom form-group">
            <div class="position-relative">
                <input @focus="tagNameInputFocusHandler" 
                        @blur="tagNameInputBlurHandler" 
                        @change="network_checkIfTagNameIsExisted" 
                        @input="tagNameInputInputHandler" type="text" placeholder="Tag version" autocomplete="off" v-model="tagName" class="form-control width-full mr-0">
                <div v-if="tagIsExisted.loading || tagNameIsInvalid.loading || tagNameAutoCompleteResults.loading" class="position-absolute input-loading-icon-wrapper d-flex flex-justify-end flex-items-center">
                    <LoadingIcon :size="22" class="mr-1"/>
                </div>
                <div v-if="tagNameAutoCompleteResults.data.length > 0" class="position-absolute autocomplete-results">
                    <AutoCompleteItem @click="() => chooseTheAutoCompleteItem(item)" class="autocomplete-item" v-for="item in tagNameAutoCompleteResults.data" :key="item">{{item}}</AutoCompleteItem>
                </div>
            </div>

            <div>
                <button class="btn mt-2 width-full">
                    <div class="d-flex flex-items-center">
                        <svg class="octicon octicon-git-branch mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path></svg>
                        <i>Target:</i>
                        <span class="flex-auto ml-1 text-left">master</span>
                        <span class="dropdown-caret ml-2"></span>
                    </div>
                </button>

                <p class="note">
                    Choose an existing tag, or create a new tag on publish
                </p>
            </div>

            <input type="text" placeholder="Release title" autocomplete="off" v-model="releaseTitle" class="form-control width-full mr-0 my-3">

            <Tab class="mx-0 mt-0 no-wrap tabnav d-flex flex-auto">
                <div class="tabnav-tabs">
                    <TabItem class="btn-link tabnav-tab px-3" @click="() => switchTab('Write')" :class="{'tab-selected':editorTab === 'Write'}">Write</TabItem>
                    <TabItem class="btn-link tabnav-tab px-3" @click="() => switchTab('Preview')" :class="{'tab-selected':editorTab === 'Preview'}">Preview</TabItem>
                </div>
            </Tab>

        </Editor>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {PaddingPageTopTab,HyperlinkWrapper,LoadingIcon} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as api from '@/network/api'
    import {authRequiredGet,authRequiredGitHubGraphqlApiQuery,commonGet} from '@/network'
    import * as graphql from './graphql'
    import {util_throttle} from '@/util'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_release_create_page',
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                tagName: '',
                target: '',
                releaseTitle: '',
                description: '',
                loading: false,
                isPreRelease: false,
                tagNameAutoCompleteResults: {
                    data: [],
                    loading: false
                },
                tagNameIsInvalid: {
                    data: false,
                    loading: false
                },
                tagIsExisted: {
                    data: false,
                    loading: false
                },
                editorTab: 'Write',
            }
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            tabs() {
                return [
                    {
                        label: 'Releases',
                        to: `/${this.owner}/${this.repo}/releases`,
                        activeFlag: true
                    },
                    {
                        label: 'Tags',
                        to: `/${this.owner}/${this.repo}/tags`
                    },
                ]
            },
            documentTitle() {
                return `New releases · ${this.owner}/${this.repo}`
            }
        },
        created() {
            //this.network_getData()
        },
        methods: {
            tagNameInputInputHandler() {
                util_throttle.throttleByDelay(this.network_getTagNameAutoCompleteResults,200,this)
            },
            async network_getTagNameAutoCompleteResults() {
                if(!this.tagName) return
                try{
                   this.tagNameAutoCompleteResults.loading = true 
                   let res = await commonGet(
                       api.API_PROXY_TAGS({
                           repo: this.repo,
                           owner: this.owner,
                           query: this.tagName
                       }),
                       {
                           headers: {
                               'accept': 'text/fragment+html'
                           }
                       }
                   )
                   this.parseTagNameAutoCompleteResults(res.data)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.tagNameAutoCompleteResults.loading = false
                }
            },
            async network_checkIfTagNameIsExisted() {
                try {
                    this.tagIsExisted.data = false
                    this.tagIsExisted.loading = true
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_TAG,
                        {
                            variables: {
                                name: this.repo,
                                owner: this.owner,
                                qualifiedName: `refs/tags/${this.tagName}`
                            },
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' check_if_tag_name_is_existed')
                        }
                    )

                    try{
                        let tag = res.data.data.repository.ref
                        if(ref) {
                            this.tagIsExisted.data = true
                        }else{
                            this.tagIsExisted.data = false
                        }
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }
                } catch (e) {
                    console.log(e)
                } finally {
                    this.tagIsExisted.loading = false
                }
            },
            parseTagNameAutoCompleteResults(HTML) {
                let pattern = /<li[^>]*>(.*)<\/li>/g
                let execResult = null
                let results = []
                while((execResult = pattern.exec(HTML)) != null) {
                    results.push(execResult[1])
                }
                this.tagNameAutoCompleteResults.data = results
            },
            tagNameInputFocusHandler() {
                this.tagNameInputInputHandler()
            },
            tagNameInputBlurHandler() {
                this.tagNameAutoCompleteResults.data = []
            },
            chooseTheAutoCompleteItem(payload) {
                this.tagName = payload
                this.tagNameAutoCompleteResults.data = []
            }
        },
        components: {
            PaddingPageTopTab,
            HyperlinkWrapper,
            LoadingIcon,
            Container: styled.div``,
            Editor: styled.div``,
            AutoCompleteItem: styled.div``,
            Tab: styled.div``,
            TabItem: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
@import 'node_modules/@primer/css/autocomplete/index.scss';
@import 'node_modules/@primer/css/navigation/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/blankslate/index.scss';
.input-loading-icon-wrapper{
    pointer-events: none;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
}
.tab-selected{
    background-color: #fff;
    border-color: #e1e4e8;
    border-radius: 6px 6px 0 0;
}
</style>