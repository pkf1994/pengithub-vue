<template>
    <Container v-if="accessToken">
        <Tab class="mx-0 mt-0 no-wrap d-flex flex-auto">
            <TabItem class="btn-link tabnav-tab px-3 flex-1" :disabled="locked && !viewerIsCollaborator" @click="() => switchTab('Write')" :class="{'tab-selected':selectedTab === 'Write'}">Write</TabItem>
            <TabItem class="btn-link tabnav-tab px-3 flex-1" :disabled="locked && !viewerIsCollaborator" @click="() => switchTab('Preview')" :class="{'tab-selected':selectedTab === 'Preview'}">Preview</TabItem>
        </Tab>

        <div v-if="!locked" :style="{overflow:textareaIsFocused ? 'visible' : 'hidden' }">
            <EditPane v-if="selectedTab === 'Write'">
                <markdown-toolbar :for="uniqueId" class="bg-white d-flex no-wrap flex-items-start flex-wrap px-2 pt-2" :class="{disabled:disabled}">
                    <MDGroup class="d-block flex-auto">
                        <button class="btn-link toolbar-item no-underline py-2 mr-1" @click="triggerStretch">
                            <svg class="octicon octicon-text-size" viewBox="0 0 18 16" version="1.1" width="18" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.62 9.08L12.1 3.66h-.06l-1.5 5.42h3.08zM5.7 10.13S4.68 6.52 4.53 6.02h-.08l-1.13 4.11H5.7zM17.31 14h-2.25l-.95-3.25h-4.07L9.09 14H6.84l-.69-2.33H2.87L2.17 14H0l3.3-9.59h2.5l2.17 6.34L10.86 2h2.52l3.94 12h-.01z"></path></svg>
                            <svg v-if="!stretch" class="octicon octicon-chevron-down Details-content--hidden" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"></path></svg>
                            <svg v-else class="octicon octicon-chevron-up Details-content--shown" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 10l-1.5 1.5L5 7.75 1.5 11.5 0 10l5-5 5 5z"></path></svg>
                        </button>
                    </MDGroup>

                    <MDGroup class="d-flex mr-0">
                        <md-quote class="toolbar-item tooltipped p-2 mx-1">
                            <svg class="octicon octicon-quote" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6.16 3.5C3.73 5.06 2.55 6.67 2.55 9.36c.16-.05.3-.05.44-.05 1.27 0 2.5.86 2.5 2.41 0 1.61-1.03 2.61-2.5 2.61-1.9 0-2.99-1.52-2.99-4.25 0-3.8 1.75-6.53 5.02-8.42L6.16 3.5zm7 0c-2.43 1.56-3.61 3.17-3.61 5.86.16-.05.3-.05.44-.05 1.27 0 2.5.86 2.5 2.41 0 1.61-1.03 2.61-2.5 2.61-1.89 0-2.98-1.52-2.98-4.25 0-3.8 1.75-6.53 5.02-8.42l1.14 1.84h-.01z"></path></svg>
                        </md-quote>
                        <md-code class="toolbar-item tooltipped p-2 mx-1">
                            <svg class="octicon octicon-code" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9.5 3L8 4.5 11.5 8 8 11.5 9.5 13 14 8 9.5 3zm-5 0L0 8l4.5 5L6 11.5 2.5 8 6 4.5 4.5 3z"></path></svg>
                        </md-code>
                        <md-link class="toolbar-item tooltipped p-2 mx-1">
                            <svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>
                        </md-link>
                    
                    </MDGroup> 

                    <MDGroup class="d-flex">
                        <md-mention class="toolbar-item tooltipped p-2 mx-1 flex-auto text-center">
                            <svg class="octicon octicon-mention" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6.58 15c1.25 0 2.52-.31 3.56-.94l-.42-.94c-.84.52-1.89.83-3.03.83-3.23 0-5.64-2.08-5.64-5.72 0-4.37 3.23-7.18 6.58-7.18 3.45 0 5.22 2.19 5.22 5.2 0 2.39-1.34 3.86-2.5 3.86-1.05 0-1.36-.73-1.05-2.19l.73-3.75H8.98l-.11.72c-.41-.63-.94-.83-1.56-.83-2.19 0-3.66 2.39-3.66 4.38 0 1.67.94 2.61 2.3 2.61.84 0 1.67-.53 2.3-1.25.11.94.94 1.45 1.98 1.45 1.67 0 3.77-1.67 3.77-5C14 2.61 11.59 0 7.83 0 3.66 0 0 3.33 0 8.33 0 12.71 2.92 15 6.58 15zm-.31-5c-.73 0-1.36-.52-1.36-1.67 0-1.45.94-3.22 2.41-3.22.52 0 .84.2 1.25.83l-.52 3.02c-.63.73-1.25 1.05-1.78 1.05V10z"></path></svg>
                        </md-mention>
                        <md-image class="toolbar-item tooltipped p-2 mx-1">
                            <svg class="octicon octicon-file-media" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 5h2v2H6V5zm6-.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v11l3-5 2 4 2-2 3 3V5z"></path></svg>
                        </md-image>
                        <md-ref class="toolbar-item tooltipped p-2 mx-1">
                            <svg class="octicon octicon-bookmark" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9 0H1C.27 0 0 .27 0 1v15l5-3.09L10 16V1c0-.73-.27-1-1-1zm-.78 4.25L6.36 5.61l.72 2.16c.06.22-.02.28-.2.17L5 6.6 3.12 7.94c-.19.11-.25.05-.2-.17l.72-2.16-1.86-1.36c-.17-.16-.14-.23.09-.23l2.3-.03.7-2.16h.25l.7 2.16 2.3.03c.23 0 .27.08.09.23h.01z"></path></svg>
                        </md-ref>
                        <Reply class="toolbar-item tooltipped py-2 px-1 ml-1">
                            <svg class="octicon octicon-reply" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 3.5c3.92.44 8 3.125 8 10-2.312-5.062-4.75-6-8-6V11L.5 5.5 6 0v3.5z"></path></svg>
                        </Reply>
                    </MDGroup> 

                    <MDGroup v-if="stretch" class="d-block width-full clearfix">
                        <md-header class="toolbar-item tooltipped p-2 mr-1">
                            <svg class="octicon octicon-text-size" viewBox="0 0 18 16" version="1.1" width="18" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.62 9.08L12.1 3.66h-.06l-1.5 5.42h3.08zM5.7 10.13S4.68 6.52 4.53 6.02h-.08l-1.13 4.11H5.7zM17.31 14h-2.25l-.95-3.25h-4.07L9.09 14H6.84l-.69-2.33H2.87L2.17 14H0l3.3-9.59h2.5l2.17 6.34L10.86 2h2.52l3.94 12h-.01z"></path></svg>
                        </md-header>

                        <md-bold class="toolbar-item tooltipped p-2 mr-1">
                            <svg class="octicon octicon-bold" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1 2h3.83c2.48 0 4.3.75 4.3 2.95 0 1.14-.63 2.23-1.67 2.61v.06c1.33.3 2.3 1.23 2.3 2.86 0 2.39-1.97 3.52-4.61 3.52H1V2zm3.66 4.95c1.67 0 2.38-.66 2.38-1.69 0-1.17-.78-1.61-2.34-1.61H3.13v3.3h1.53zm.27 5.39c1.77 0 2.75-.64 2.75-1.98 0-1.27-.95-1.81-2.75-1.81h-1.8v3.8h1.8v-.01z"></path></svg>
                        </md-bold>

                        <md-italic class="toolbar-item tooltipped p-2 mr-1">
                            <svg class="octicon octicon-italic" viewBox="0 0 6 16" version="1.1" width="6" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.81 5h1.98L3 14H1l1.81-9zm.36-2.7c0-.7.58-1.3 1.33-1.3.56 0 1.13.38 1.13 1.03 0 .75-.59 1.3-1.33 1.3-.58 0-1.13-.38-1.13-1.03z"></path></svg>
                        </md-italic>
                        
                        <md-unordered-list class="toolbar-item tooltipped p-2 mr-1">
                            <svg class="octicon octicon-list-unordered" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2 13c0 .59 0 1-.59 1H.59C0 14 0 13.59 0 13c0-.59 0-1 .59-1h.81c.59 0 .59.41.59 1H2zm2.59-9h6.81c.59 0 .59-.41.59-1 0-.59 0-1-.59-1H4.59C4 2 4 2.41 4 3c0 .59 0 1 .59 1zM1.41 7H.59C0 7 0 7.41 0 8c0 .59 0 1 .59 1h.81c.59 0 .59-.41.59-1 0-.59 0-1-.59-1h.01zm0-5H.59C0 2 0 2.41 0 3c0 .59 0 1 .59 1h.81c.59 0 .59-.41.59-1 0-.59 0-1-.59-1h.01zm10 5H4.59C4 7 4 7.41 4 8c0 .59 0 1 .59 1h6.81c.59 0 .59-.41.59-1 0-.59 0-1-.59-1h.01zm0 5H4.59C4 12 4 12.41 4 13c0 .59 0 1 .59 1h6.81c.59 0 .59-.41.59-1 0-.59 0-1-.59-1h.01z"></path></svg>
                        </md-unordered-list>

                        <md-ordered-list class="toolbar-item tooltipped p-2 mr-1">
                            <svg class="octicon octicon-list-ordered" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12.01 13c0 .59 0 1-.59 1H4.6c-.59 0-.59-.41-.59-1 0-.59 0-1 .59-1h6.81c.59 0 .59.41.59 1h.01zM4.6 4h6.81C12 4 12 3.59 12 3c0-.59 0-1-.59-1H4.6c-.59 0-.59.41-.59 1 0 .59 0 1 .59 1zm6.81 3H4.6c-.59 0-.59.41-.59 1 0 .59 0 1 .59 1h6.81C12 9 12 8.59 12 8c0-.59 0-1-.59-1zm-9.4-6h-.72c-.3.19-.58.25-1.03.34V2h.75v2.14H.17V5h2.84v-.86h-1V1zm.392 8.12c-.129 0-.592.04-.802.07.53-.56 1.14-1.25 1.14-1.89C2.72 6.52 2.18 6 1.38 6c-.59 0-.97.2-1.38.64l.58.58c.19-.19.38-.38.64-.38.28 0 .48.16.48.52 0 .53-.77 1.2-1.7 2.06V10h3v-.88h-.598zm-.222 3.79v-.03c.44-.19.64-.47.64-.86 0-.7-.56-1.11-1.44-1.11-.48 0-.89.19-1.28.52l.55.64c.25-.2.44-.31.69-.31.27 0 .42.13.42.36 0 .27-.2.44-.86.44v.75c.83 0 .98.17.98.47 0 .25-.23.38-.58.38-.28 0-.56-.14-.81-.38l-.48.66c.3.36.77.56 1.41.56.83 0 1.53-.41 1.53-1.16 0-.5-.31-.81-.77-.94v.01z"></path></svg>
                        </md-ordered-list>

                        <md-task-list class="toolbar-item tooltipped p-2 mr-1">
                            <svg class="octicon octicon-tasklist" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M15.41 9H7.59C7 9 7 8.59 7 8c0-.59 0-1 .59-1h7.81c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zM9.59 4C9 4 9 3.59 9 3c0-.59 0-1 .59-1h5.81c.59 0 .59.41.59 1 0 .59 0 1-.59 1H9.59zM0 3.91l1.41-1.3L3 4.2 7.09 0 8.5 1.41 3 6.91l-3-3zM7.59 12h7.81c.59 0 .59.41.59 1 0 .59 0 1-.59 1H7.59C7 14 7 13.59 7 13c0-.59 0-1 .59-1z"></path></svg>
                        </md-task-list>
                    </MDGroup>
                </markdown-toolbar>

                <textarea   rows="6" 
                            :disabled="disabled"
                            placeholder="Leave a comment"
                            class="mt-3 d-block width-full form-control input-contrast" 
                            :style="textareaStyle"
                            :value="markdownRaw"
                            :id="uniqueId"
                            ref="textarea"
                            v-on:input="$emit('change',$event.target.value)"
                            v-on:change="$emit('change',$event.target.value)"
                            @focus="() => triggerTextareaIsFocused(true)" 
                            @blur="() => triggerTextareaIsFocused(false)"></textarea>
            </EditPane>

            <Preview  v-else class="preview-body markdown-body" v-html="commentPreviewHTML">

            </Preview>

        </div>

        <LockedNotice v-else-if="!viewerIsCollaborator" class="locked-notice">
            <svg height="32" class="octicon octicon-lock" viewBox="0 0 12 16" version="1.1" width="24" aria-hidden="true"><path fill-rule="evenodd" d="M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z"></path></svg>
            <p v-if="lockedReason">This conversation has been locked <span>as</span> <strong>{{lockedReason}}</strong> and limited to collaborators.</p>
            <p v-else>You can't perform this action at this time.</p>
        </LockedNotice>
       
        <Action v-if="!locked || viewerIsCollaborator">
            <slot>
                <div class="py-2">
                     <button class="btn" :disabled="markdownRaw === ''">
                        <svg class="octicon octicon-issue-closed text-red v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 10h2v2H7v-2zm2-6H7v5h2V4zm1.5 1.5l-1 1L12 9l4-4.5-1-1L12 7l-1.5-1.5zM8 13.7A5.71 5.71 0 012.3 8c0-3.14 2.56-5.7 5.7-5.7 1.83 0 3.45.88 4.5 2.2l.92-.92A6.947 6.947 0 008 1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7l-1.52 1.52c-.66 2.41-2.86 4.19-5.48 4.19v-.01z"></path></svg>
                        <span class="">Close and comment</span>
                    </button>
                    <button class="btn btn-primary ml-1" :disabled="markdownRaw === ''">
                        <span class="">Comment</span>
                    </button>
                </div>
            </slot>
        </Action>

        <Gidelines class="text-small text-gray my-2" v-if="(!locked || viewerIsCollaborator) && withGidelines">
            <svg class="octicon octicon-info mr-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6.3 5.69a.942.942 0 01-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 01-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"></path></svg>
            Remember, contributions to this repository should follow our
            <HyperlinkWrapper>
                <a href="https://help.github.com/articles/github-community-guidelines">GitHub Community Guidelines</a>
            </HyperlinkWrapper>
        </Gidelines>
    </Container>

    <SignInNotice v-else  class="flash flash-warn">
        <button class="btn btn-primary" @click="signIn">Sign in</button>
        <strong>to join this conversation on GitHub.</strong>
    </SignInNotice>
</template>

<script>
    import styled from 'vue-styled-components'
    import '@github/markdown-toolbar-element'
    import {AnimatedHeightWrapper} from '@/components'
    import HyperlinkWrapper from './HyperlinkWrapper'
    import marked from 'marked'
    const createDOMPurify = require('dompurify');
    export default {
        model: {
            prop: 'markdownRaw',
            event: 'change'
        },
        props: {
            markdownRaw: String,
            disabled: Boolean,
            locked: {
                type: Boolean,
                default: false
            },
            lockedReason: {
                type: String,
                default: ''
            },
            withGidelines: {
                type: Boolean,
                default: true
            },
            textareaStyle: {
                type: Object,
                required: false
            },
            viewerIsCollaborator: {
                type: Boolean,
                default: false
            },
            uniqueId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                stretch: false,
                selectedTab: 'Write',
                textareaIsFocused: false
            }
        },
        computed: {
            commentPreviewHTML() {
                const DOMPurify = createDOMPurify(window);
                return DOMPurify.sanitize((marked(this.markdownRaw,{breaks:true})))
            }
        },
        methods: {
            triggerStretch() {
                this.stretch = !this.stretch
            },
            switchTab(tab) {
                if(this.locked) return 
                this.selectedTab = tab
            },
            triggerTextareaIsFocused(flag) {
                this.textareaIsFocused = flag
            },
            focus() {
                this.$refs.textarea && this.$refs.textarea.focus()
            }
        },
        components: {
            AnimatedHeightWrapper,
            HyperlinkWrapper,
            Container: styled.div``,
            EditPane: styled.div``,
            Tab: styled.div``,
            TabItem: styled.button``,
            MDGroup: styled.div``,
            Reply: styled.div``,
            Action: styled.div``,
            Gidelines: styled.div``,
            Preview: styled.div``,
            LockedNotice: styled.div``,
            SignInNotice: styled.div``,
        }
    }
</script>

<style scoped lang='scss'>
@import 'node_modules/@primer/css/navigation/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/alerts/index.scss';
 .tabnav-tab{
    display: inline-block;
    padding: 8px 12px;
    font-size: 14px;
    line-height: 20px;
    text-decoration: none;
    background-color: #fafbfc;
    border: 1px solid #e1e4e8;
    border-left: 0;
    border-radius: 0;
}
.tabnav-tab:first-child{
    border-left: 1px solid #e1e4e8;
} 
.tab-selected{
    border-bottom: 0;
    background-color: #fff;
}
.toolbar-item {
    display: block;
    float: left;
    padding: 4px;
    color: #586069;
    cursor: pointer;
    background: none;
    border: 0;
}
.clearfix::after {
    content: '';
    display: table;
    clear: both;
}
.tooltipped {
    position: relative;
}

textarea{
    max-height: 451.2px;
    border-bottom: 1px solid #e1e4e8;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    display: block;
    width: 100%;
    min-height: 100px;
    padding: 8px;
    resize: vertical;
    max-width: 100%;
    margin: 0;
    line-height: 1.6;
    overflow: auto;
    height: 100px;
}

.preview-body {
    background-color: initial;
    width: 100%;
    overflow: visible;
    font-size: 14px;
    min-height: 150px;
    padding: 4px 4px 16px;
    border-bottom: 1px solid #e1e4e8;
}

.locked-notice{
    padding: 20px 0 10px;
    margin: 15px;
    text-align: center;
    position: relative;
    svg{
        margin-right: 4px;
        margin-bottom: 8px;
        margin-left: 4px;
        color: #a3aab1;
    }
}

.disabled{
    pointer-events: none;
}
</style>