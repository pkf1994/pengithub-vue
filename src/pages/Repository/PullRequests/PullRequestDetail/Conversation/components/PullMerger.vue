<template>
    <Container>
        <AddMoreCommitNotice v-if="pullRequestProvided().head" class="my-3 text-gray">
            Add more commits by pushing to the 
            <router-link class="text-emphasized" :to="`/${pullRequestProvided().head.repo.full_name}/tree/${pullRequestProvided().head.ref}`">
                <code>{{pullRequestProvided().head.ref}}</code>
            </router-link>
            branch on
            <router-link class="text-emphasized" :to="`/${pullRequestProvided().head.repo.full_name}`">
                <code>{{pullRequestProvided().head.repo.full_name}}</code>.
            </router-link>
        </AddMoreCommitNotice>

        <MergeMessage class="branch-actions my-3" :class="{'border-color-yellow': !pullRequestProvided().mergeable}">
            <div v-if="pullRequestProvided().mergeable" class="branch-actions-item">
                <div class="branch-action-item-icon">
                    <svg class="octicon octicon-check" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                </div>
                <h3 class="h4 status-heading">This branch has no conflicts with the base branch</h3>
                <span class="status-meta">
                    Merging can be performed automatically.
                </span>
            </div>
            <div v-if="pullRequestProvided().mergeable === false" class="branch-actions-item">
                <div class="completeness-indicator-problem branch-action-item-icon">
                    <svg class="octicon octicon-alert" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"></path></svg>
                </div>
                <h3 class="h4 status-heading">This branch has conflicts that must be resolved</h3>
                <span v-if="!graphqlWritePermission()" class="status-meta">
                    Only those with 
                    <HyperlinkWrapper>
                        <a href="https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/access-permissions-on-github">
                            write access
                        </a>
                    </HyperlinkWrapper>
                    to this repository can merge pull requests.
                </span>
            </div>

             <MergeActions v-if="pullRequestProvided().mergeable" class="merge-message">
                <div class="select-menu d-inline-block">
                    <button class="BtnGroup-item btn-primary btn">Merge pull request</button>
                    <button class="BtnGroup-item btn-primary btn">
                        <span class="select-menu-button "></span>
                    </button>
                </div>
            </MergeActions>
        </MergeMessage>

    </Container>
</template>
<script>
import styled from 'vue-styled-components'
import {HyperlinkWrapper} from '@/components'
export default {
    inject: ['pullRequestProvided','graphqlWritePermission'],
    props: {
    },
    data() {
        return {
            requestChangeReviews: [],
            loading: false
        }
    },
    computed: {
        repoFullName() {
            if(!this.pullRequestProvided().head) return 
            return this.pullRequestProvided().head.repo.full_name
        }
    },
    methods: {
        async network_getData() {

        }
    },
    components: {
        HyperlinkWrapper,
        Container: styled.div``,
        AddMoreCommitNotice: styled.p``,
        MergeActions: styled.div``,
        MergeMessage: styled.div``,
        ChangesRequested: styled.div``,
    }
}
</script>
<style scoped lang="scss">
.branch-actions{
    border: 1px solid rgb(52, 208, 88);
    border-radius: 6px;
    .branch-actions-item{
        padding: 15px 15px 15px 55px;
        font-size: 13px;
        line-height: 1.4;
     
    }
    .branch-actions-item+{
        border-top: 1px solid rgb(225, 228, 232);
    }
    
    .branch-action-item-icon{
        width: 30px;
        height: 30px;
        text-align: center;
        float: left;
        margin-left: -40px;
        border-radius: 50%;
        background-color: rgb(46, 164, 79);
        color: white;
        svg{
            display: block;
            margin-top: 7px;
            margin-right: auto;
            margin-left: auto;
        }
    }
    .completeness-indicator-problem{
        background-color:rgb(106, 115, 125);
    }
    .merge-message{
        padding: 15px;
        background-color: rgb(250, 251, 252);
        border-top: 1px solid rgb(225, 228, 232);
        border-bottom-right-radius: 6px;
        border-bottom-left-radius: 6px;
    }
}

.select-menu-button:after {
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: -2px;
    content: "";
    border: 4px solid transparent;
    border-top-color: currentcolor;
}

.border-color-yellow{
    border-color: rgb(255, 211, 61);
}
</style>