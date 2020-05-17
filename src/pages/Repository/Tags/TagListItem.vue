<template>
    <Container class="Box-row">
        <TagName>
            <h4 class="flex-auto min-width-0 pr-2 pb-1 commit-title">
                <router-link :to="`/vuejs/vue/releases/tag/${tag.name}`">
                    {{tag.name}}
                </router-link>
                <transition appear name="fade">   
                    <span v-if="message" class="hidden-text-expander d-inline-block"><button  @click="triggerShowMessage"  type="button" aria-expanded="false" class="ellipsis-expander js-details-target" aria-label="Toggle commit message">…</button></span>
                </transition>
            </h4>
        </TagName>
        <AnimatedHeightWrapper :stretch="showMessage">
            <p class="text-small text-gray">
                {{message}}
            </p>
        </AnimatedHeightWrapper>   
        <AnimatedHeightWrapper>
             <Info class="f6">
                <transition appear name="fade">   
                    <span class="d-inline-block  mt-1 mr-2 text-gray" v-if="tagDate" >
                        <svg class="octicon octicon-clock" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 8h3v2H7c-.55 0-1-.45-1-1V4h2v4zM7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7z"></path></svg>
                        <span class="no-wrap">on {{tagDate | dateFormat('dd zzz yyyy')}}</span>
                    </span>    
                </transition>
            

                <span class="d-inline-block mt-1 mr-2 text-mono">
                    <router-link class="muted-link" :to="commitRouterLink">
                        <svg class="octicon octicon-git-commit" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z"></path></svg>
                        {{commitAbbreviatedSha}}
                    </router-link>
                </span>

                <span v-if="tag.zipball_url" class="d-inline-block mt-1 mr-2">
                    <a class="muted-link" :href="tag.zipball_url" rel="nofollow">
                        <svg class="octicon octicon-file-zip" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.5 1H1a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V4.5L8.5 1zM11 14H1V2h3v1h1V2h3l3 3v9zM5 4V3h1v1H5zM4 4h1v1H4V4zm1 2V5h1v1H5zM4 6h1v1H4V6zm1 2V7h1v1H5zM4 9.28A2 2 0 003 11v1h4v-1a2 2 0 00-2-2V8H4v1.28zM6 10v1H4v-1h2z"></path></svg>
                        zip
                    </a>
                </span>

                <span v-if="tag.tarball_url" class="d-inline-block mt-1 mr-2">
                    <a class="muted-link" :href="tag.tarball_url" rel="nofollow">
                        <svg class="octicon octicon-file-zip" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.5 1H1a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V4.5L8.5 1zM11 14H1V2h3v1h1V2h3l3 3v9zM5 4V3h1v1H5zM4 4h1v1H4V4zm1 2V5h1v1H5zM4 6h1v1H4V6zm1 2V7h1v1H5zM4 9.28A2 2 0 003 11v1h4v-1a2 2 0 00-2-2V8H4v1.28zM6 10v1H4v-1h2z"></path></svg>
                        tar.gz
                    </a>
                </span>
            </Info>   
        </AnimatedHeightWrapper>
        
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper} from '@/components'
    export default {
        inject: ['extraDataProvided'],
        props: {
            tag: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                showMessage: false
            }
        },
        computed: {
            tagDate() {
                if(!this.extraDataHolder) return
                if(!this.extraDataHolder.target) return
                if(!this.extraDataHolder.target.target) return
                return this.extraDataHolder.target.target.committedDate
            },
            commitRouterLink() {
                return this.tag.commit.url.replace('https://api.github.com/repos','')
            },
            commitAbbreviatedSha() {
                return this.tag.commit.sha.substring(0,7)
            },
            extraDataHolder() {
                return this.extraDataProvided().filter(i => i.id == this.tag.node_id)[0]
            },
            message() {
                if(!this.extraDataHolder) return
                if(!this.extraDataHolder.target) return
                return this.extraDataHolder.target.message
            },
           
        },
        methods: {
             triggerShowMessage() {
                console.log('trigger')
                this.showMessage = !this.showMessage
            }
        },
        components: {
            AnimatedHeightWrapper,
            Container: styled.div``,
            TagName: styled.div``,
            Info: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
.commit-title a {
    color: #444d56;
}

p {
    max-width: 700px;
    padding-top: 10px;
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    font-size: 11px;
    line-height: 1.45;
    color: #444d56;
}
</style>