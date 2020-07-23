<template>
    <CommonLoadingWrapper :loading="loading || existPullRequest.loading || mergeabilityHTML.loading" :position="loading ? 'center' : 'corner'" class="px-3">
        <Title class="title">
            Compare changes
        </Title>
        <TitleMeta class="title-meta">
            Choose two branches to see what’s changed or to start a new pull request.
            If you need to, you can also <button type="button" @click="triggerIsComparingAcrossForks" class="btn-link js-toggle-range-editor-cross-repo">compare across forks</button>.
        </TitleMeta>
        <RangeEditor  class="range-editor text-gray js-range-editor is-cross-repo p-1 d-flex flex-wrap mt-3 flex-items-center">
            <BranchPair v-if="isComparingAcrossForks" class="p-1 width-fit">
                <button class="btn branch d-flex width-full flex-items-center select-menu-button" @click="() => showModal('chooseBaseRepoModal')">
                    <i>base repository:</i>
                    <span class="truncate d-block flex-shrink-1">{{baseRefOwner}}/{{repo}}&nbsp;</span>
                </button>
            </BranchPair>
            <BranchPair class="p-1 width-fit">
                <button class="btn branch d-flex width-full flex-items-center select-menu-button" @click="() => showModal('chooseBaseRefModal')">
                    <i>base:&nbsp;</i>
                    <span class="truncate d-block flex-shrink-1"> {{baseRef}}&nbsp;</span>
                </button>
            </BranchPair>
        </RangeEditor>
        <div class="my-2">
            compare with:
        </div>
        <RangeEditor class="range-editor text-gray js-range-editor is-cross-repo p-1 d-flex flex-wrap mb-3 flex-items-center">
            <BranchPair v-if="isComparingAcrossForks" class="p-1 width-fit">
                <button class="btn branch d-flex width-full flex-items-center select-menu-button" @click="() => showModal('chooseHeadRepoModal')">
                    <i>compare repository:</i>
                    <span class="truncate d-block flex-shrink-1">{{headRefOwner}}/{{repo}}&nbsp;</span>
                </button>
            </BranchPair>
             <BranchPair class="p-1 width-fit">
                <button class="btn branch d-flex width-full flex-items-center select-menu-button" @click="() => showModal('chooseHeadRefModal')">
                    <i>compare:&nbsp;</i>
                    <span class="truncate d-block flex-shrink-1"> {{headRef}}&nbsp;</span>
                </button>
            </BranchPair>
        </RangeEditor>

        <MergeableNotice v-if="mergeabilityHTML.data && !entirelyDifferentCommitHistories && data.total_commits > 0" class="range-editor text-gray js-range-editor is-cross-repo py-1 px-3 mb-3" v-html="mergeabilityHTML.data">
        </MergeableNotice>

        <AnimatedHeightWrapper>
            <div class="pb-3"  v-if="accessToken && !showCreatePullRequestPane && !entirelyDifferentCommitHistories && !couldNotFigureOutHowToCompare && data.total_commits > 0 && !existPullRequest.loading && !withOpenPullRequestExist">
                <TriggerPullRequestPaneBtn class="create-pull-pane">
                    <button class="btn btn-primary d-block width-full" @click="triggerShowCreatePullRequestPane">
                        <svg class="octicon octicon-git-pull-request" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.17674 3.07322L9.57318 0.676753C9.73068 0.51926 9.99996 0.630802 9.99996 0.853529V5.64642C9.99996 5.86915 9.73068 5.98069 9.57319 5.8232L7.17674 3.42677C7.07911 3.32914 7.07911 3.17085 7.17674 3.07322ZM3.75 2.5C3.33579 2.5 3 2.83579 3 3.25C3 3.66421 3.33579 4 3.75 4C4.16421 4 4.5 3.66421 4.5 3.25C4.5 2.83579 4.16421 2.5 3.75 2.5ZM1.5 3.25C1.5 2.00736 2.50736 1 3.75 1C4.99264 1 6 2.00736 6 3.25C6 4.22966 5.37389 5.06309 4.5 5.37197V10.628C5.37389 10.9369 6 11.7703 6 12.75C6 13.9926 4.99264 15 3.75 15C2.50736 15 1.5 13.9926 1.5 12.75C1.5 11.7703 2.12611 10.9369 3 10.628V5.37197C2.12611 5.06309 1.5 4.22966 1.5 3.25ZM11 2.5H10V4H11C11.5523 4 12 4.44772 12 5V10.628C11.1261 10.9369 10.5 11.7703 10.5 12.75C10.5 13.9926 11.5074 15 12.75 15C13.9926 15 15 13.9926 15 12.75C15 11.7703 14.3739 10.9369 13.5 10.628V5C13.5 3.61929 12.3807 2.5 11 2.5ZM12 12.75C12 12.3358 12.3358 12 12.75 12C13.1642 12 13.5 12.3358 13.5 12.75C13.5 13.1642 13.1642 13.5 12.75 13.5C12.3358 13.5 12 13.1642 12 12.75ZM3.75 12C3.33579 12 3 12.3358 3 12.75C3 13.1642 3.33579 13.5 3.75 13.5C4.16421 13.5 4.5 13.1642 4.5 12.75C4.5 12.3358 4.16421 12 3.75 12Z"></path></svg>
                        Create pull request
                    </button>
                    <p class="d-flex flex-items-center mt-2">
                        Discuss and review the changes in this comparison with others.
                        <HyperlinkWrapper class="ml-2"> 
                            <a class="help-link" href="https://help.github.com/articles/using-pull-requests" target="_blank" aria-label="Guide: Using pull requests">
                                <svg class="octicon octicon-question" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5ZM0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM9 11C9 11.5523 8.55229 12 8 12C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10C8.55229 10 9 10.4477 9 11ZM6.92082 6.08541C7.00133 5.92438 7.11032 5.78617 7.25977 5.68654C7.40453 5.59004 7.63124 5.5 8 5.5C8.27975 5.5 8.55291 5.58656 8.7375 5.725C8.90206 5.84842 9 6.01009 9 6.25C9 6.42662 8.95919 6.51381 8.92283 6.56835C8.87748 6.63639 8.79924 6.71162 8.64646 6.81349C8.57007 6.86441 8.48788 6.9139 8.38754 6.97411L8.38141 6.97779L8.38139 6.9778C8.28769 7.03402 8.17704 7.10041 8.06831 7.1729C7.84608 7.32107 7.58057 7.52712 7.37593 7.83412C7.14619 8.17878 7.23935 8.64442 7.58401 8.87417C7.92867 9.10391 8.39432 9.01075 8.62406 8.66609C8.66942 8.59803 8.74766 8.52279 8.90043 8.42093C8.97681 8.37001 9.059 8.32052 9.15933 8.26032L9.16554 8.25659L9.1656 8.25656C9.25926 8.20036 9.36986 8.134 9.47854 8.06154C9.70075 7.91339 9.96627 7.70737 10.1709 7.4004C10.3846 7.07994 10.5 6.69838 10.5 6.25C10.5 5.48991 10.1396 4.90158 9.6375 4.525C9.15542 4.16344 8.55358 4 8 4C7.36876 4 6.84547 4.15996 6.42772 4.43846C6.01467 4.71383 5.74866 5.07562 5.57918 5.41459C5.39393 5.78507 5.5441 6.23558 5.91459 6.42082C6.28507 6.60606 6.73558 6.45589 6.92082 6.08541Z"></path></svg>
                            </a>
                        </HyperlinkWrapper>
                    </p>
                </TriggerPullRequestPaneBtn>
            </div> 

            <div class="pb-3" v-if="existPullRequest.data.length > 0">
                <ExistPullRequest v-for="item in existPullRequest.data" :key="item.node_id" class="exist-pull px-3 py-2 mt-2">
                    <span class="float-left d-flex flex-items-start mr-2">
                        <IssueIcon issueType="pullRequest" :issue="item"></IssueIcon>
                    </span>    
                    <h4 class="title">
                        <router-link :to="`/${owner}/${repo}/pull/${item.number}`"><strong>{{item.title}}</strong></router-link>
                        <span class="number">#{{item.number}}</span>
                    </h4>
                    <p class="message mb-0 mt-1">
                        <router-link :to="`/${owner}/${repo}/pull/${item.number}`" style="color: #586069;" v-html="markdownToHTML(item.body)">

                        </router-link>
                    </p>
                   <!--  <router-link class="btn btn-primary existing-pull-button d-block text-center mt-2" :to="`/${owner}/${repo}/pull/${item.number}`">
                        <svg class="octicon octicon-git-pull-request" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.17674 3.07322L9.57318 0.676753C9.73068 0.51926 9.99996 0.630802 9.99996 0.853529V5.64642C9.99996 5.86915 9.73068 5.98069 9.57319 5.8232L7.17674 3.42677C7.07911 3.32914 7.07911 3.17085 7.17674 3.07322ZM3.75 2.5C3.33579 2.5 3 2.83579 3 3.25C3 3.66421 3.33579 4 3.75 4C4.16421 4 4.5 3.66421 4.5 3.25C4.5 2.83579 4.16421 2.5 3.75 2.5ZM1.5 3.25C1.5 2.00736 2.50736 1 3.75 1C4.99264 1 6 2.00736 6 3.25C6 4.22966 5.37389 5.06309 4.5 5.37197V10.628C5.37389 10.9369 6 11.7703 6 12.75C6 13.9926 4.99264 15 3.75 15C2.50736 15 1.5 13.9926 1.5 12.75C1.5 11.7703 2.12611 10.9369 3 10.628V5.37197C2.12611 5.06309 1.5 4.22966 1.5 3.25ZM11 2.5H10V4H11C11.5523 4 12 4.44772 12 5V10.628C11.1261 10.9369 10.5 11.7703 10.5 12.75C10.5 13.9926 11.5074 15 12.75 15C13.9926 15 15 13.9926 15 12.75C15 11.7703 14.3739 10.9369 13.5 10.628V5C13.5 3.61929 12.3807 2.5 11 2.5ZM12 12.75C12 12.3358 12.3358 12 12.75 12C13.1642 12 13.5 12.3358 13.5 12.75C13.5 13.1642 13.1642 13.5 12.75 13.5C12.3358 13.5 12 13.1642 12 12.75ZM3.75 12C3.33579 12 3 12.3358 3 12.75C3 13.1642 3.33579 13.5 3.75 13.5C4.16421 13.5 4.5 13.1642 4.5 12.75C4.5 12.3358 4.16421 12 3.75 12Z"></path></svg>
                        View pull request
                    </router-link> -->
                </ExistPullRequest>
            </div> 
        </AnimatedHeightWrapper>
        
        <CreatePullRequestPane v-if="showCreatePullRequestPane" 
                                :defaultTitle="pullRequestDefaultTitle"
                                :headRefOwner="headRefOwner" 
                                :headRef="headRef" 
                                :baseRef="baseRef"></CreatePullRequestPane>

        <Commits v-if="data.commits && data.commits.length > 0" :commits="data.commits" class="mt-5"></Commits>

        <Header class="header p-3 mt-5 d-flex flex-justify-between" v-if="data.files && data.files.length > 0">
            <div>
                <svg class="octicon octicon-dif mr-2" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 7h2v1H6v2H5V8H3V7h2V5h1v2zm-3 6h5v-1H3v1zM7.5 2L11 5.5V15c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h6.5zM10 6L7 3H1v12h9V6zM8.5 0H3v1h5l4 4v8h1V4.5L8.5 0z"></path></svg>
                <span class="text-emphasized">{{data.files.length}}</span>
                {{data.files.length > 1 ? 'files' : 'file'}}
                changed
            </div>
            <span @click="triggerShowFilesFlag">{{showFilesFlag ? 'Hide them' : 'Show them'}}</span>    
        </Header>

        <Files v-if="data.files && data.files.length > 0 && showFilesFlag" :files="data.files"></Files>

        <HelloHood v-if="!refInfoHolder || refInfoHolder.trim() == ''" class="blankslate">
            <svg height="40" class="octicon octicon-git-branch blankslate-icon" viewBox="0 0 10 16" version="1.1" width="25" aria-hidden="true"><path fill-rule="evenodd" d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 00-1-3.72C.88 1 0 1.89 0 3a2 2 0 001 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
            <svg height="40" class="octicon octicon-git-commit blankslate-icon" viewBox="0 0 14 16" version="1.1" width="35" aria-hidden="true"><path fill-rule="evenodd" d="M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z"></path></svg>
            <svg height="40" class="octicon octicon-tag blankslate-icon" viewBox="0 0 15 16" version="1.1" width="37" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path><svg height="40" class="octicon octicon-git-commit blankslate-icon" viewBox="0 0 14 16" version="1.1" width="35" aria-hidden="true"><path fill-rule="evenodd" d="M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z"></path></svg></svg>
            <h3>Compare and review just about anything</h3>
            <p>
                Branches, tags, commit ranges, and time ranges. In the same repository and across forks.
            </p>
        </HelloHood>

        <EmptyNotice v-else-if="baseRef == headRef && baseRefOwner == headRefOwner" class="blankslate">
            <h3>There isn’t anything to compare.</h3>
            <p v-if="!entirelyDifferentCommitHistories && baseRef == headRef && baseRefOwner == headRefOwner">
                You’ll need to use two different branch names to get a valid comparison.
            </p>
        </EmptyNotice>

        <EmptyNotice v-else-if="couldNotFigureOutHowToCompare" class="blankslate">
            <h3>There isn’t anything to compare.</h3>
            <p>
               We couldn’t figure out how to compare these references, do they point to valid commits?
            </p>
        </EmptyNotice>

        <EmptyNotice v-else-if="entirelyDifferentCommitHistories" class="blankslate" >
            <h3>There isn’t anything to compare.</h3>
            <p >
                <strong>{{baseRef}}</strong> 
                and
                <strong>{{headRef}}</strong>
                are
                entirely
                different
                commit
                histories.
            </p>
        </EmptyNotice>

        <EmptyNotice v-else-if="data.status == 'behind'" class="blankslate">
            <h3>There isn’t anything to compare.</h3>
            <p >
                <strong>{{baseRef}}</strong> 
                is up to date with
                all commits from 
                <strong>{{headRef}}</strong>.
                Try 
                <HyperlinkWrapper>
                    <a href="/vuejs/vue/compare/master...dev">switching the base</a>
                </HyperlinkWrapper>
                for your comparison.
            </p>
        </EmptyNotice>

        <EmptyNotice v-else-if="data.status == 'identical'" class="blankslate">
            <h3>There isn’t anything to compare.</h3>
            <p>
                <strong>{{baseRefOwner}}:{{baseRef}}</strong> 
                and 
                <strong>{{headRefOwner}}:{{headRef}}</strong>.
               are identical.
            </p>
        </EmptyNotice>

         <Modal ref="chooseBaseRefModal" title="Choose a base ref" :modalStyle="{height:'80vh'}" @show="() => network_getAvailableRefs('base')">
            <div class="select-menu-text-filter">
                <div class="p-3">
                    <input type="text" v-model="modalRefsData.base.searchQuery" class="form-control" placeholder="Find a branch" autofocus="" autocomplete="off"/>
                </div>
                <ModalTab class="SelectMenu-tabs" style="background-color: #f6f8fa;">
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('base','branches')" :class="{'active-modal-tab':modalRefsData.base.currentTab == 'branches'}">Branches</button>
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('base','tags')" :class="{'active-modal-tab':modalRefsData.base.currentTab == 'tags'}">Tags</button>
                </ModalTab>
            </div>
            <div v-if="modalRefsData.base[modalRefsData.base.currentTab].loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div v-else style="overflow:auto">
                <transition-group v-if="modalRefsData.base.currentTab == 'branches'" name="fade-group" appear>
                    <SelectMenuItem :key="defaultBranch" v-if="defaultBranch" @click.native="() => routerWithRef(defaultBranch,'base')" :selected="baseRef == defaultBranch">
                        <span class="flex-1">{{defaultBranch}}</span>    
                        <span class="Label Label--gray flex-self-start">default</span>
                    </SelectMenuItem>
                    <SelectMenuItem @click.native="() => routerWithRef(item,'base')" v-for="item in modalFilteredAvailableBaseBranches" :key="item" :selected="baseRef == item">
                        <span>{{item}}</span>    
                    </SelectMenuItem>
                </transition-group>
                <transition-group v-if="modalRefsData.base.currentTab == 'tags'" name="fade-group" appear>
                    <SelectMenuItem @click.native="() => routerWithRef(item,'base')" v-for="item in modalFilteredAvailableBaseTags" :key="item" :selected="baseRef == item">
                        <span>{{item}}</span>    
                    </SelectMenuItem>
                </transition-group>
            </div>
        </Modal>

         <Modal ref="chooseHeadRefModal" title="Choose a head ref" :modalStyle="{height:'80vh'}" @show="() => network_getAvailableRefs('head')">
            <div class="select-menu-text-filter">
                <div class="p-3">
                    <input type="text" v-model="modalRefsData.head.searchQuery" class="form-control" placeholder="Find a branch" autofocus="" autocomplete="off"/>
                </div>
                <ModalTab class="SelectMenu-tabs" style="background-color: #f6f8fa;">
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('head','branches')" :class="{'active-modal-tab':modalRefsData.head.currentTab == 'branches'}">Branches</button>
                    <button class="SelectMenu-tab py-2" style="font-size:14px" @click="() => switchModalTab('head','tags')" :class="{'active-modal-tab':modalRefsData.head.currentTab == 'tags'}">Tags</button>
                </ModalTab>
            </div>
            <div v-if="modalRefsData.head[modalRefsData.head.currentTab].loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div v-else style="overflow:auto">
                <transition-group v-if="modalRefsData.head.currentTab == 'branches'" name="fade-group" appear>
                    <SelectMenuItem :key="defaultBranch" v-if="defaultBranch" @click.native="() => routerWithRef(defaultBranch,'head')" :selected="headRef == defaultBranch">
                        <span class="flex-1">{{defaultBranch}}</span>    
                        <span class="Label Label--gray flex-self-start">default</span>
                    </SelectMenuItem>
                    <SelectMenuItem @click.native="() => routerWithRef(item,'head')" v-for="item in modalFilteredAvailableHeadBranches" :key="item" :selected="headRef == item">
                        <span>{{item}}</span>    
                    </SelectMenuItem>
                </transition-group>
                <transition-group v-if="modalRefsData.head.currentTab == 'tags'" name="fade-group" appear>
                    <SelectMenuItem @click.native="() => routerWithRef(item,'head')" v-for="item in modalFilteredAvailableHeadTags" :key="item" :selected="headRef == item">
                        <span>{{item}}</span>    
                    </SelectMenuItem>
                </transition-group>
            </div>
        </Modal>

         <Modal ref="chooseBaseRepoModal" title="Choose a base repostiory" :modalStyle="{height:'80vh'}" @show="network_getAvailableRepos">
            <div class="select-menu-text-filter p-3">
                <input type="text" v-model="modalReposData.searchQuery" class="form-control" placeholder="Filter repos" autofocus="" autocomplete="off"/>
            </div>
            <div v-if="modalReposData.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div v-else style="overflow:auto">
                <transition-group name="fade-group" appear>
                    <SelectMenuItem @click.native="() => routerWithRefOwner(item,'base')" v-for="item in modalFiltermodalReposData" :key="item" :selected="`${owner}/${repo}` == item">
                        <span>{{item}}</span>    
                    </SelectMenuItem>
                </transition-group>
            </div>
        </Modal>

         <Modal ref="chooseHeadRepoModal" title="Choose a head repostiory" :modalStyle="{height:'80vh'}" @show="network_getAvailableRepos">
            <div class="select-menu-text-filter p-3">
                <input type="text" v-model="modalReposData.searchQuery" class="form-control" placeholder="Filter repos" autofocus="" autocomplete="off"/>
            </div>
            <div v-if="modalReposData.loading" class="flex-row-center height-full">
                <LoadingIconEx></LoadingIconEx>
            </div>
            <div v-else style="overflow:auto">
                <transition-group name="fade-group" appear>
                    <SelectMenuItem @click.native="() => routerWithRefOwner(item,'head')" v-for="item in modalFiltermodalReposData" :key="item" :selected="`${headRefOwner}/${repo}` == item">
                        <span>{{item}}</span>    
                    </SelectMenuItem>
                </transition-group>
            </div>
        </Modal>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper,HyperlinkWrapper,Modal,SelectMenuItem,LoadingIconEx,IssueIcon,AnimatedHeightWrapper} from '@/components'
    import {authRequiredGet,commonGet} from '@/network'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as api from '@/network/api'
    import {Commits,Files,CreatePullRequestPane} from './components'
    import { util_markdownParse } from '@/util'
    let parse = require("parse-link-header")
    export default {
        name: "repository_compare_page",
        inject: ['repoBasicInfo'],
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                data: {},
                loading: false,
                isComparingAcrossForks: false,
                mergeabilityHTML: {
                    data: "",
                    loading: false
                },
                entirelyDifferentCommitHistories: false,
                couldNotFigureOutHowToCompare: false,
                modalRefsData: {
                    base: {
                        branches: {
                            data: [],
                            loading: false
                        },
                        tags: {
                            data: [],
                            loading: false
                        },
                        currentTab: 'branches',
                        searchQuery: "",
                    },
                    head: {
                        branches: {
                            data: [],
                            loading: false
                        },
                        tags: {
                            data: [],
                            loading: false
                        },
                        loading: false,
                        currentTab: 'branches',
                        searchQuery: "",
                    }
                },
                modalReposData: {
                    data: [],
                    searchQuery: '',
                    loading: false
                },
                existPullRequest: {
                    data: [],
                    loading: false
                },
                showFilesFlag: false,
                firstLoadedFlag: false,
                showCreatePullRequestPane: false,
                resetBeforeUpdate: true
            }
        },
        computed: {
            defaultBranch() {
                return this.repoBasicInfo().default_branch
            },
            refInfoHolder() {
                return this.$route.params.pathMatch
            },
            baseRef() {
                if(!this.refInfoHolder) return this.defaultBranch
                let baseRefHolder = this.refInfoHolder.split('...')[0]
                if(!baseRefHolder) return this.defaultBranch
                let magicArr = baseRefHolder.split(':')
                return magicArr[magicArr.length - 1] ||  this.defaultBranch
            },
            baseRefOwner() {
                if(!this.refInfoHolder) return this.owner
                let baseRefHolder = this.refInfoHolder.split('...')[0]
                if(!baseRefHolder) return this.owner
                let magicArr = baseRefHolder.split(':')
                if(magicArr.length == 1) return this.owner
                return magicArr[0] || this.owner
            },
            headRef() {
                if(!this.refInfoHolder) return this.defaultBranch
                let headRefHolder = this.refInfoHolder.split('...')[1]
                if(!headRefHolder) return this.defaultBranch
                let magicArr = headRefHolder.split(':')
                return magicArr[magicArr.length - 1] || this.defaultBranch
            },
            headRefOwner() {
                if(!this.refInfoHolder) return this.owner
                let headRefHolder = this.refInfoHolder.split('...')[1]
                if(!headRefHolder) return this.owner
                let magicArr = headRefHolder.split(':')
                if(magicArr.length == 1) return this.owner
                let headRefOwner = magicArr[0] || this.owner
                if(headRefOwner != this.owner) {
                    this.isComparingAcrossForks = true
                }
                return headRefOwner 
            },
            modalFilteredAvailableBaseBranches() {
                return this.modalRefsData.base.branches.data.filter(i => {
                    return (i.toLowerCase().indexOf(this.modalRefsData.base.searchQuery.toLowerCase()) != -1) && (i != this.defaultBranch)
                })
            },
            modalFilteredAvailableBaseTags() {
               return this.modalRefsData.base.tags.data.filter(i => {
                    return i.toLowerCase().indexOf(this.modalRefsData.base.searchQuery.toLowerCase()) != -1
                })
            },
            modalFilteredAvailableHeadBranches() {
                return this.modalRefsData.head.branches.data.filter(i => {
                    return (i.toLowerCase().indexOf(this.modalRefsData.head.searchQuery.toLowerCase()) != -1) && (i != this.defaultBranch)
                })
            },
            modalFilteredAvailableHeadTags() {
               return this.modalRefsData.head.tags.data.filter(i => {
                    return i.toLowerCase().indexOf(this.modalRefsData.head.searchQuery.toLowerCase()) != -1
                })
            },
            modalFiltermodalReposData() {
                return this.modalReposData.data.filter(i => {
                    return i.toLowerCase().indexOf(this.modalReposData.searchQuery.toLowerCase()) != -1
                })
            },
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
            pullRequestDefaultTitle() {
                if(this.data.files && this.data.files.length == 1) return `Update ${this.data.files[0].filename}.`
                return `${this.headRefOwner ? this.headRefOwner + ':' : ''}${this.headRef}`
            },
            documentTitle() {
                return `Compare ${this.$route.params.pathMatch} · ${this.owner}/${this.repo}`
            },
            withOpenPullRequestExist() {
                return this.existPullRequest.data.filter( i => i.state == 'open').length > 0
            }
        },
        async created() {
            this.network_getData()
        /*     let u = "http://127.0.0.1:8888/pkf1994/Test/pull/new/review-requests/master...vvv"
            let r = await commonGet(
                u,
                {
                    headers: {
                        "Accept": "application/json"
                    }
                }
            )
            console.log(r) */
        },
        methods: {
            network_getData() {
                if(this.baseRefOwner && (this.baseRefOwner != this.owner)) {
                    this.$router.replace(`/${this.baseRefOwner}/${this.repo}/compare/${this.baseRef}...${this.headRefOwner ? this.headRefOwner + ':' : ''}${this.headRef}`)
                    return 
                }
                this.network_getCommits()
                this.network_getMergeability()
                this.network_getExistPullRequest()
            },
            async network_getCommits() {
                if(!this.$route.params.pathMatch)return
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_COMMITS_COMPARE({
                        owner: this.owner,
                        repo: this.repo,
                        baseHead: this.$route.params.pathMatch
                    })
                    let res = await authRequiredGet(url,{cancelToken})
                    window.scrollTo(0,0)
                    this.data = res.data
                    this.entirelyDifferentCommitHistories = false
                    this.firstLoadedFlag = true
                }catch(e) {
                    if(e.response) {
                        if(e.response.data.message.indexOf('No common ancestor between') != -1) {
                            this.entirelyDifferentCommitHistories = true
                        }
                        if(e.response.data.message == "Not Found") {
                            this.couldNotFigureOutHowToCompare = true
                        }
                        console.log(e)
                        return
                    }
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            triggerIsComparingAcrossForks() {
                this.isComparingAcrossForks = !this.isComparingAcrossForks
            },
            async network_getMergeability() {
                if(!this.$route.params.pathMatch || this.$route.params.pathMatch.trim() == '')return
                try{
                    this.mergeabilityHTML.data = ''
                    this.mergeabilityHTML.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_mergeable_data')
                    let url = api.API_MERGEABLE({
                        owner: this.owner,
                        repo: this.repo,
                        baseHead: this.$route.params.pathMatch
                    })
                    let res = await commonGet(url,{cancelToken})
                    this.mergeabilityHTML.data = res.data
                }catch(e) {
                    console.log(e)
                }finally{
                    this.mergeabilityHTML.loading = false
                }
            },
            network_getAvailableRefs(meta) {
                if(this.modalRefsData[meta].currentTab == 'branches') this.network_getAvailableBranches(meta)
                if(this.modalRefsData[meta].currentTab == 'tags') this.network_getAvailableTags(meta)
            },
            async network_getAvailableBranches(meta) {
                if(this.modalRefsData[meta].branches.loading) return
                if(this.modalRefsData[meta].branches.data.length > 0) return
                try{
                    this.modalRefsData[meta].branches.loading = true
                    let url = api.API_REPOSITORY_COMPARE_AVAILABLE_BRANCHES({
                        owner: this.owner,
                        repo: this.repo,
                        params: {
                            type: meta,
                            range: this.refInfoHolder,
                        }
                    })
                    let res = await commonGet(url)
                    this.modalRefsData[meta].branches.data = this.parseBranchesFromHTML(res.data)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.modalRefsData[meta].branches.loading = false
                }
            },
            async network_getAvailableTags(meta) {
                if(this.modalRefsData[meta].tags.loading) return
                if(this.modalRefsData[meta].tags.data.length > 0) return
                try{
                    this.modalRefsData[meta].tags.loading = true
                    let url = api.API_REPOSITORY_COMPARE_AVAILABLE_TAGS({
                        owner: this.owner,
                        repo: this.repo,
                        params: {
                            type: meta,
                            range: this.refInfoHolder,
                            tag_name: this.baseRef,
                        }
                    })      
                    let res = await commonGet(
                        url,
                        {
                            headers: {
                                "Accept": "text/fragment+html"
                            }
                        }
                    )
                    this.modalRefsData[meta].tags.data = this.parseTagsFromHTML(res.data)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.modalRefsData[meta].tags.loading = false
                }
            },
            async network_getAvailableRepos() {
                if(this.modalReposData.loading || this.modalReposData.data.length > 0) return
                try{
                    this.modalReposData.loading = true
                    let url = api.API_REPOSITORY_COMPARE_AVALIABLE_REPOSITORY(
                        {
                            owner: this.owner,
                            repo: this.repo
                        }
                    )
                    let res = await commonGet(url)

                    this.modalReposData.data = this.parseRepositoriesFromHTML(res.data)
                    
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.modalReposData.loading = false
                }
            },
            async network_getExistPullRequest() {
                if(!this.headRef || !this.baseRef) return
                try{
                    this.existPullRequest.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_exist_pull_request')
                    let url = api.API_SEARCH(
                        {
                            type: 'issues',
                            params: {
                                q: `is:pr head:${this.headRef} base:${this.baseRef} author:${this.viewer.login}`,
                            }
                        }
                    )

                    let res = await authRequiredGet(url,{cancelToken})

                    if(!res.data.total_count || res.data.total_count == 0) {
                        this.existPullRequest.loading = false
                        return 
                    }
                    let candidatePulls = res.data.items.filter(i => {
                        return i.repository_url.replace('https://api.github.com/repos/','') == `${this.owner}/${this.repo}`
                    })

                    let ajaxRequestRecordIdx = 0

                    candidatePulls.forEach(i => {
                        if(i.pull_request && i.pull_request.url){
                            authRequiredGet(i.pull_request.url,{cancelToken}).then(res => {
                                if(res.data.head.label == `${this.headRefOwner}:${this.headRef}`) {
                                    this.existPullRequest.data.push(res.data)
                                }
                                ajaxRequestRecordIdx++ 
                                if(ajaxRequestRecordIdx >= candidatePulls.length) this.existPullRequest.loading = false
                            }).catch(e => {
                                ajaxRequestRecordIdx++ 
                                if(ajaxRequestRecordIdx >= candidatePulls.length) this.existPullRequest.loading = false
                                console.log(e)
                            }) 
                        }
                    })


                }catch(e) {
                    console.log(e)
                    this.handleError(e)
                }
            },
            parseBranchesFromHTML(HTML) {
                let pattern = /<span class="select-menu-item-text(?: flex-auto)? break-word" data-menu-button-text data-filter-item-text>(.*)<\/span>/g
                let execResult
                let result = []
                while((execResult = pattern.exec(HTML)) != null) {
                    if(execResult[1])result.push(execResult[1])
                }
                return result
            },
            parseTagsFromHTML(HTML) {
                let pattern = /<span class="css-truncate css-truncate-overflow" title="(?:.*)" >\n\s*(.*)\n\s*<\/span>/g
                let execResult
                let result = []
                while((execResult = pattern.exec(HTML)) != null) {
                    if(execResult[1])result.push(execResult[1])
                }
                return result
            },
            parseRepositoriesFromHTML(HTML) {
                let pattern = /<div class="select-menu-item-text" data-menu-button-text>\n\s*(.*)\n\s*<\/div>/g
                let execResult
                let result = []
                while((execResult = pattern.exec(HTML)) != null) {
                    let repo = execResult[1]
                    if(repo && result.indexOf(repo) == -1) {
                        result.push(repo)
                    }
                }
                return result
            },
            parseExistPullRequestFromHTML(HTML) {
                let pattern = /<div class="existing-pull-contents">(?:\n|\r)\s*<h4 class="list-group-item-name">(?:\n|\r)\s*(.*)(?:\n|\r)\s*<a class="list-group-item-link" href="(.*)">(.*)<\/a>(?:\n|\r)\s*<span class="existing-pull-number">#(.*)<\/span>(?:\n|\r)\s*<\/h4>(?:\n|\r)\s*<div class="list-group-item-summary css-truncate css-truncate-target"><a href="(?:.*)"><p>([\S\s]*)<\/p><\/a><\/div>/g
                let execResult = pattern.exec(HTML)
                if(execResult) {
                    return {
                        iconSvg: execResult[1],
                        routerLink: execResult[2],
                        title: execResult[3],
                        number: execResult[4],
                        message: execResult[5],
                    }
                }
            },
            switchModalTab(meta,value) {
                this.modalRefsData[meta].currentTab = value
                this.network_getAvailableRefs(meta)
            },
            routerWithRef(ref,meta) {
                this.closeModal()
                if(meta == 'base') this.$router.push(`/${this.owner}/${this.repo}/compare/${ref}...${this.headRefOwner ? this.headRefOwner + ':' : ''}${this.headRef}`)
                if(meta == 'head') this.$router.push(`/${this.owner}/${this.repo}/compare/${this.baseRef}...${this.headRefOwner ? this.headRefOwner + ':' : ''}${ref}`)
            },
            routerWithRefOwner(repo,meta) {
                this.closeModal()
                let repoOwner = repo.split('/')[0]
                if(meta == 'base') this.$router.push(`/${this.owner}/${this.repo}/compare/${repoOwner}:${this.baseRef}...${this.headRefOwner ? this.headRefOwner + ':' : ''}${this.headRef}`)
                if(meta == 'head') this.$router.push(`/${this.owner}/${this.repo}/compare/${this.baseRef}...${repoOwner}:${this.headRef}`)
            },
            showModal(modalRef) {
                if(this.$refs[modalRef]) this.$refs[modalRef].show = true
            },
            closeModal() {
                for(let modalRef in this.$refs) {
                    this.$refs[modalRef].show = false
                }
            },
            triggerShowFilesFlag() {
                this.showFilesFlag = !this.showFilesFlag
            },
            triggerShowCreatePullRequestPane() {
                if(this.data.files && this.data.files.length > 5) this.showFilesFlag = false
                this.showCreatePullRequestPane = true
            },
            markdownToHTML(markdown) {
                return util_markdownParse.markdownToHTML(markdown)
            }
        },
        watch: {
            baseRefOwner() {
                this.modalRefsData.base.tags.data = []
                this.modalRefsData.base.branches.data = []
            },
            headRefOwner() {
                this.modalRefsData.head.tags.data = []
                this.modalRefsData.head.branches.data = []
            },
        },
        components: {
            CommonLoadingWrapper,
            HyperlinkWrapper,
            Commits,
            SelectMenuItem,
            Modal,
            LoadingIconEx,
            Files,
            IssueIcon,
            AnimatedHeightWrapper,
            CreatePullRequestPane,
            Title: styled.h1``,
            TitleMeta: styled.div``,
            RangeEditor: styled.div``,
            BranchPair: styled.div``,
            MergeableNotice: styled.div``,
            HelloHood: styled.div``,
            EmptyNotice: styled.div``,
            Header: styled.div``,
            ModalTab: styled.div``,
            TriggerPullRequestPaneBtn: styled.div``,
            ExistPullRequest: styled.div``,
        }
    }
</script>
<style>
.open.octicon {
    color: #28a745;
}
.close.octicon {
    color: red;
}
.merged.octicon {
    color: #6f42c1;
}
</style>
<style scoped lang="scss">
@import 'node_modules/@primer/css/truncate/index.scss';
@import 'node_modules/@primer/css/blankslate/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/select-menu/index.scss';
.title {
    margin-bottom: 0;
    font-weight: 400;
    line-height: 1.125;
    word-wrap: break-word;
}
.title-meta{
    margin-top: 5px;
    font-size: 14px;
    color: #586069;
}
.range-editor {
    position: relative;
    background-color: #fafbfc;
    border: 1px solid #e1e4e8;
    border-radius: 3px;
}
.select-menu-button:after {
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: -2px;
    margin-top: 4px;
    content: "";
    border: 4px solid transparent;
    border-top-color: currentcolor;
}
.header{
    position: relative;
    margin-bottom: 10px;
    border: 1px solid #dfe2e5;
    border-radius: 3px;
    color: #586069;
}
.select-menu-text-filter{
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
.truncate{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.create-pull-pane{
    padding: 15px;
    padding-bottom: 6px;
    font-size: 14px;
    color: #4c4a42;
    background-color: #fff9ea;
    border: 1px solid #dfd8c2;
    border-radius: 3px; 
    .help-link{
        padding: 3px;
        margin-top: 5px;
        margin-right: -3px;
        color: #9c997d;
        text-decoration: none;
    }
}

.exist-pull{
    border-radius: 3px;
    border: 1px solid #e1e4e8;
    .title{
        a{
            color: #24292e;
        }
        .number{
            font-weight: 400;
            color: #aaa;
        }
    }
}

.exist-pull:first-child{
    margin-top: 0px!important;
}
</style>