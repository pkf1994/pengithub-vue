<template>
        <CommonLoadingWrapper :loading="loading || allBranchesAndTags.loading || viewerPermission().loading" position="corner"> 

            <AnimatedHeightWrapper :stretch="viewerPermission().data == 'READ' && !viewerPermission().loading" >
                <DontHaveWriteAccessNotice class="pb-4">
                    <div class="mx-3 p-3 flash">
                        You’re making changes in a project you don’t have write access to. Submitting a change will write it to a new branch in your fork {{viewer.login}}/{{repo}}, so you can send a pull request.
                    </div>
                </DontHaveWriteAccessNotice>
            </AnimatedHeightWrapper>
            

            <Breadcrumb class="breadcrumb d-flex flex-items-center px-3 flex-wrap mr-sm-4 text-bold">
                <span class="d-inline-block wb-break-all">
                    <router-link :to="`/${owner}/${repo}`">{{repo}}</router-link>
                </span>
                <span class="separator">/</span>
                <input type="text" :disabled="inputDisabledFlag" class="form-control mr-1 mt-1 mt-sm-0 col-12 width-sm-auto" v-model="fileName" placeholder="Name your file…" autofocus="">
            </Breadcrumb>

            <FileEditor class="file">
                <div class="file-header">
                    <svg class="octicon octicon-code mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z"></path></svg>
                    Edit new file
                </div>  

                <div class="p-2 pt-5 textarea-wrapper" :disabled="inputDisabledFlag">
                    <textarea :disabled="inputDisabledFlag" v-model="content" class="form-control file-editor-textarea" rows="35" name="value" placeholder="Enter file contents here" spellcheck="false" wrap="off" autofocus=""></textarea>
                </div>
            </FileEditor>

            <ActionPane class="p-3">
                <h3>Commit new file</h3>
                <input v-model="commitMessageHeadline" type="text" :disabled="inputDisabledFlag" :placeholder="`Create ${fileName || 'new file'}`" class="form-control input-block input-contrast"  name="message" value="" autocomplete="off">
                <textarea v-model="commitMessageBody" :disabled="inputDisabledFlag" id="commit-description-textarea" name="description" class="form-control input-block input-contrast comment-form-textarea" placeholder="Add an optional extended description…"></textarea>

                <div v-if="viewerPermission().data == 'ADMIN'">
                    <CommitChoice  class="form-group mb-2">
                        <div class="form-checkbox pl-4 mt-0 mb-2">
                            <label class="text-normal">
                                <input :disabled="inputDisabledFlag" type="radio" name="commit-choice" autocomplete="off" value="direct" v-model="commitMode">
                                <svg height="16" class="octicon octicon-git-commit text-gray mr-1 text-center" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z"></path></svg>
                                Commit directly to the 
                                <strong class="branch-name">{{currentRef}}</strong> 
                                branch.
                            </label>
                        </div>
                        <div class="form-checkbox pl-4 mt-0 mb-2">
                            <label class="text-normal">
                                <input :disabled="inputDisabledFlag" type="radio" name="commit-choice" autocomplete="off" value="quick-pull" v-model="commitMode">
                                <svg height="16" class="octicon octicon-git-pull-request text-gray mr-1 text-center" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"></path></svg>
                                Create a 
                                <strong>new branch</strong>
                                for this commit and start a pull request.
                                <HyperlinkWrapper>
                                    <a href="https://help.github.com/articles/using-pull-requests" target="_blank">
                                        Learn more about pull requests.
                                    </a>
                                </HyperlinkWrapper>
                            </label>

                            <AnimatedHeightWrapper>
                                <div class="pt-2 pb-1 px-1" v-if="commitMode == 'quick-pull'" >
                                    <div class="position-relative">
                                        <svg height="16" class="octicon octicon-git-branch quick-pull-new-branch-icon text-gray-light position-absolute text-center" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path></svg>
                                        <input v-model="newBranchName" :disabled="inputDisabledFlag" type="text" class="form-control input-contrast mr-1 pl-5 input-monospace js-quick-pull-new-branch-name" placeholder="New branch name">
                                    </div> 

                                    <div class="text-red mt-2" v-if="alreadyHaveSameBranchWithNewBranchName">
                                        Already have the ref with name of "<strong>{{newBranchName}}</strong>".
                                    </div>
                                </div>
                            </AnimatedHeightWrapper>
                        
                        </div>
                    </CommitChoice>

                    <button class="btn btn-primary my-3 width-full" :disabled="inputDisabledFlag || alreadyHaveSameBranchWithNewBranchName || !fileName" @click="network_createNewFile">
                        {{loading ? 'Committing...' : 'Commit new file'}}
                    </button>

                    <button class="btn mb-3 width-full" :disabled="inputDisabledFlag || alreadyHaveSameBranchWithNewBranchName || !fileName" @click="test">
                        Cancel
                    </button>
                </div>

                <div v-else>
                    <button class="btn btn-primary my-3 width-full" :disabled="inputDisabledFlag || !fileName" @click="network_forkAndCreateNewBranchAndCommit">
                        {{loading ? 'Trying...' : 'Propose new file'}}
                    </button>

                    <button class="btn mb-3 width-full" :disabled="inputDisabledFlag || !fileName" @click="test">
                        Cancel
                    </button>
                </div>
                
            </ActionPane>
        </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper,HyperlinkWrapper,AnimatedHeightWrapper} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {authRequiredPut,commonPost,authRequiredPost,authRequiredGet} from '@/network'
    import * as api from '@/network/api'
    import {WithRefDistinguishMixin} from '../components'
        export default {
        name: "repository_new_file_page",
        inject: ['repoBasicInfo','viewerPermission'],
        mixins: [WithRefDistinguishMixin,RouteUpdateAwareMixin],
        data() {
            return {
                fileName: '',
                content: '',
                commitMode: 'direct',
                commitMessageHeadline: '',
                commitMessageBody: '',
                loading: false,
                newBranchName: '',
                documentTitle: 'New File',
                newBranchOfNewForkRepo: undefined
            }
        },
        computed: {
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
            currentRef() {
                let pathMatch = this.$route.params.pathMatch
                if(!pathMatch && this.defaultBranch) return this.defaultBranch

                if(this.allBranchesAndTags.branches.length == 0) return

                let ref

                try {
                    this.allBranchesAndTags.branches.forEach(item => {
                        let candidateBranch =  item.ref.replace('refs/heads/','')
                        if(pathMatch == candidateBranch) {
                            ref = candidateBranch
                            throw new Error('abort')
                        }
                    })
                } catch (e) {
                    
                }

                if(!ref && pathMatch[pathMatch.length - 1] == '/') {
                    pathMatch = pathMatch.slice(0,pathMatch.length - 1)
                    try {
                        this.allBranchesAndTags.branches.forEach(item => {
                            let candidateBranch =  item.ref.replace('refs/heads/','')
                            if(pathMatch == candidateBranch) {
                                ref = candidateBranch
                                throw new Error('abort')
                            }
                        })
                    } catch (e) {
                        
                    }
                }

                if(!ref && this.allBranchesAndTags.branches.length > 0) {
                    this.emitNotFoundEvent(this.$el)
                }
                return ref
            },
            defaultBranch() {
                return this.repoBasicInfo().default_branch
            },
            commitMessage() {
                return `${this.commitMessageHeadline || 'Create ' + this.fileName}\n\n${this.commitMessageBody}`
            },
            inputDisabledFlag() {
                return this.loading || this.allBranchesAndTags.loading || this.viewerPermission().loading
            },
            alreadyHaveSameBranchWithNewBranchName() {
                return [
                    ...this.allBranchesAndTags.branches,
                    ...this.allBranchesAndTags.tags
                ].some(i => {
                    return i.ref.replace('refs/heads/','') == this.newBranchName
                })
            },
            currentBranchSha() {
                return this.allBranchesAndTags.branches.filter(i => {
                    return i.ref.replace('refs/heads/','') == this.currentRef
                })[0].object.sha
            },
        },
        created() {
            this.network_getData()
        },
        methods: {
            network_getData() {
                this.network_getAllBranchesAndTags()
            },
            network_createNewFile() {
                switch(this.commitMode) {
                    case 'quick-pull':
                        this.network_createBranchAndStartAPullRequest()
                        break
                    default:
                        this.network_commitDirectly()
                }
            },
            async network_createBranchAndStartAPullRequest() {
                if(!this.accessToken) {
                    this.signIn()
                    return
                }
                try {
                    this.loading = true
                    let url_createNewBranch = api.API_CREATE_REF({
                        repo: this.repo,
                        owner: this.owner
                    })

                    let res_createNewBranch = await authRequiredPost(
                        url_createNewBranch,
                        {
                            ref: `refs/heads/${this.newBranchName}`,
                            sha: this.currentBranchSha
                        },
                        {
                            headers: {
                                'Accept': 'application/vnd.github.v3+json'
                            }
                        }
                    )

                    if(res_createNewBranch.data.ref) {
                        await this.network_commitDirectly(res_createNewBranch.data.ref.replace('refs/heads/',''))
                    }else {
                        throw new Error('create new branch fail.')
                    }
                } catch (e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            async network_commitDirectly(targetBranch) {
                if(!this.accessToken) {
                    this.signIn()
                    return
                }
                try{
                    this.loading = true
                    let url = api.API_FILE_ACTION({
                        repo: this.repo,
                        owner: this.owner,
                        path: this.fileName
                    })

                    let contentBase64 = window.btoa(this.content)

                    let res = await authRequiredPut(
                        url,
                        {
                            message: this.commitMessage,
                            content: contentBase64,
                            branch: targetBranch || this.currentRef
                        }
                    )
                   
                    if(targetBranch) {
                        this.$router.replace(`/${this.owner}/${this.repo}/compare/${this.currentRef}...${targetBranch}`)
                    } else {
                        this.$router.replace(`/${this.owner}/${this.repo}/tree/${this.currentRef}?update_file_browser=true`)
                    }
                    this.routeResetHook()
                }catch(e) {
                    this.handleError(e)
                    if(e.response && e.response.status == 422) {
                        this.scrollToTop()
                        this.topNoticeShow('repository','A file with the same name already exists. Please choose a different name and try again.','error',true)
                    }
                }finally{
                    this.loading = false
                }
            },
            async network_forkAndCreateNewBranchAndCommit() {
                try {
                    this.loading = true

                    //fork操作
                    let url_createFork = api.API_FORK({
                        repo: this.repo,
                        owner: this.owner
                    })
                    let res_createFork = await authRequiredPost(url_createFork)

                    let url_newForkRepo = res_createFork.data.url
                    let res_newForkRepo = await authRequiredGet(url_newForkRepo)

                    //确定新建branch的name
                    let magicIndex = 1
                    let nameOfNewBranchOfNewForkRepo = this.newBranchOfNewForkRepo || `patch-${magicIndex}`

                    if(!this.newBranchOfNewForkRepo) {
                        let alreadyHaveABranchWithTheName = true
                        while(alreadyHaveABranchWithTheName) {
                            try{
                                let url_branchCheck = api.API_BRANCH({
                                    repo: this.repo,
                                    owner: this.viewer.login,
                                    branch: nameOfNewBranchOfNewForkRepo
                                })

                                await authRequiredGet(url_branchCheck)

                                nameOfNewBranchOfNewForkRepo = `patch-${++magicIndex}`

                            }catch(e) {
                                if(e.response && e.response.status == 404) {
                                    alreadyHaveABranchWithTheName = false
                                }else{
                                    throw e
                                    break
                                }
                            }
                        }

                        let url_createNewBranch = api.API_CREATE_REF({
                            repo: this.repo,
                            owner: this.viewer.login
                        })

                        let res_createNewBranch = await authRequiredPost(
                            url_createNewBranch,
                            {
                                ref: `refs/heads/${nameOfNewBranchOfNewForkRepo}`,
                                sha: this.currentBranchSha
                            },
                            {
                                headers: {
                                    'Accept': 'application/vnd.github.v3+json'
                                }
                            }
                        )

                        if(res_createNewBranch.data.ref) {
                            this.newBranchOfNewForkRepo = res_createNewBranch.data.ref.replace('refs/heads/','')

                            let url = api.API_FILE_ACTION({
                                repo: this.repo,
                                owner: this.viewer.login,
                                path: this.fileName
                            })

                            let contentBase64 = window.btoa(this.content)

                            let res = await authRequiredPut(
                                url,
                                {
                                    message: this.commitMessage,
                                    content: contentBase64,
                                    branch: nameOfNewBranchOfNewForkRepo
                                }
                            )
                        
                            this.$router.replace(`/${this.owner}/${this.repo}/compare/${this.currentRef}...${this.viewer.login}:${nameOfNewBranchOfNewForkRepo}`)
                            this.routeResetHook()
                        }else {
                            throw new Error('create new branch fail.')
                        }
                    } else {
                        let url = api.API_FILE_ACTION({
                            repo: this.repo,
                            owner: this.viewer.login,
                            path: this.fileName
                        })

                        let contentBase64 = window.btoa(this.content)

                        let res = await authRequiredPut(
                            url,
                            {
                                message: this.commitMessage,
                                content: contentBase64,
                                branch: this.newBranchOfNewForkRepo
                            }
                        )
                        
                        this.$router.replace(`/${this.owner}/${this.repo}/compare/${this.currentRef}...${this.viewer.login}:${this.newBranchOfNewForkRepo}`)
                        this.routeResetHook()
                    }

                    this.newBranchOfNewForkRepo = undefined

                } catch (e) {
                    this.handleError(e)
                    if(e.response && e.response.status == 422) {
                        this.scrollToTop()
                        this.topNoticeShow('repository','A file with the same name already exists. Please choose a different name and try again.','error',true)
                    }
                } finally {
                    this.loading = false
                }
            },
            test() {
                let pathMatch = this.$route.params.pathMatch
                if(!pathMatch && this.defaultBranch) return this.defaultBranch

                if(this.allBranchesAndTags.branches.length == 0) return

                let ref

                try {
                    this.allBranchesAndTags.branches.forEach(item => {
                        let candidateBranch =  item.ref.replace('refs/heads/','')

                        console.log(pathMatch)
                        console.log(candidateBranch)
                        if(pathMatch == candidateBranch) ref = candidateBranch
                        throw new Error('abort')
                    })
                } catch (e) {
                    
                }

                if(!ref && pathMatch[pathMatch.length - 1] == '/') {
                    pathMatch = pathMatch.slice(0,pathMatch.length - 1)
                    try {
                        this.allBranchesAndTags.branches.forEach(item => {
                            let candidateBranch =  item.ref.replace('refs/heads/','')
                            if(pathMatch == candidateBranch) ref = candidateBranch
                            throw new Error('abort')
                        })
                    } catch (e) {
                        
                    }
                }

                if(!ref && this.allBranchesAndTags.branches.length > 0) {
                   // this.emitNotFoundEvent(this.$el)
                }
                return ref
            }
        },
        components: {
            CommonLoadingWrapper,
            HyperlinkWrapper,
            AnimatedHeightWrapper,
            Container: styled.div``,
            DontHaveWriteAccessNotice: styled.div``,
            Breadcrumb: styled.div``,
            FileEditor: styled.div``,
            ActionPane: styled.div``,
            CommitChoice: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/branch-name/index.scss';
@import 'node_modules/@primer/css/alerts/index.scss';
.form-control, .textarea-wrapper{
    transition: all .4s ease;
}

.breadcrumb {
    font-size: 16px;
    color: #586069;
}

.form-control[disabled], .form-select[disabled], .textarea-wrapper[disabled] {
    color: #959da5;
    background-color: #f3f4f6;
}

.separator {
    white-space: pre-wrap;
}

.separator:after, 
.separator:before {
    content: " ";
}

.file {
    position: relative;
    margin-top: 16px;
    margin-bottom: 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
}

.file-header {
    padding: 12px 16px;
    background-color: #fafbfc;
    border-bottom: 1px solid #e1e4e8;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    font-weight: 600;
    font-size: 14px;
    line-height: 23px;
    color: #24292e;
}

.file-editor-textarea {
    width: 100%;
    padding: 5px 4px;
    font: 12px SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    resize: vertical;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    outline: none;
}


.input-block {
    margin-top: 10px;
    margin-bottom: 10px;
}

.comment-form-textarea {
    width: 100%;
    max-width: 100%;
    height: 100px;
    min-height: 100px;
    margin: 0;
}

.quick-pull-new-branch-icon {
    top: 9px;
    left: 10px;
}
</style>