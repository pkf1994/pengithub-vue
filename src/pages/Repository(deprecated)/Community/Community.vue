<template>
    <Container class="flex-column flex-items-stretch py-4 px-3">
        <Head class="head">
            <h2>Community profile</h2>  
        </Head>
        <SubHead class="my-5">
            <p class="f3-light">
                Here’s how this project compares to 
                <HyperlinkWrapper>
                    <a href="https://opensource.guide">recommended community standards</a>
                </HyperlinkWrapper>
                .
            </p>
        </SubHead>

        <Title class="mb-2">
            <span class="f4 text-bold">Checklist</span>
        </Title>

        <ComplexBubble :loading="loading" :disabledAnimatedWrapper="false">
            <ScoreBar class="position-relative border-bottom">
                <Background class="progress-bar round-1"></Background>
                <WhiteCover class="white-cover" :style="{width: parseInt(100 -data.health_percentage) + '%'}"></WhiteCover>
            </ScoreBar>
            <CheckItem :checked="data.description && data.description.trim() !== ''">
                    Description
            </CheckItem>
            <CheckItem :checked="data.files && data.files.readme">
                <router-link v-if="data.files && data.files.readme && data.files.readme.html_url" :to="data.files.readme.html_url.replace('https://github.com','')">
                    README
                </router-link>
                <span v-else>
                    README
                </span>
            </CheckItem>
            <CheckItem :checked="data.files && data.files.code_of_conduct">
                <router-link v-if="data.files && data.files.code_of_conduct && data.files.code_of_conduct.html_url" :to="data.files.code_of_conduct.html_url.replace('https://github.com','')">
                    Code of conduct
                </router-link>
                <span v-else>
                    Code of conduct
                </span>
            </CheckItem>
            <CheckItem :checked="data.files && data.files.contributing" 
                        subNotice="Writing contributing guidelines">
                <router-link v-if="data.files && data.files.contributing && data.files.contributing.html_url" :to="data.files.contributing.html_url.replace('https://github.com','')">
                    Contributing
                </router-link>
                <span v-else>
                    Contributing
                </span>
            </CheckItem>
            <CheckItem :checked="data.files && data.files.license" 
                        subNotice="Choosing a license">
                <router-link v-if="data.files && data.files.license && data.files.license.html_url" :to="data.files.license.html_url.replace('https://github.com','')">
                    License
                </router-link>
                <span v-else>
                    License
                </span>
            </CheckItem>
            <CheckItem :checked="data.files && data.files.issue_template">
                <router-link v-if="data.files && data.files.issue_template && data.files.issue_template.html_url" :to="data.files.issue_template.html_url.replace('https://github.com','')">
                    Issue templates
                </router-link>
                <span v-else>
                    Issue templates
                </span>
            </CheckItem>
            <CheckItem :checked="data.files && data.files.pull_request_template">
                <router-link v-if="data.files && data.files.pull_request_template && data.files.pull_request_template.html_url" :to="data.files.pull_request_template.html_url.replace('https://github.com','')">
                    Pull request template
                </router-link>
                <span v-else>
                    Pull request template
                </span>
            </CheckItem>
        </ComplexBubble>

        <p class="mt-1 mr-3 text-small text-right">What is <a href="https://help.github.com/articles/viewing-your-community-profile">the community profile</a>?</p>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble,HyperlinkWrapper} from '@/components'
    import CheckItem from './CheckItem'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as api from '@/network/api'
    import { cancelAndUpdateAxiosCancelTokenSource,authRequiredGet } from '@/network'
    export default {
        mixins: [RouteUpdateAwareMixin],
        name: 'repository_commuity_page',
        inject: ['owner','repo'],
        data() {
            return {
               data: {},
               loading: false
            }
        },
        computed: {
             documentTitle() {
                return `Community · ${this.owner()}/${this.repo()}`
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true

                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.name)
                    this.cancelSources.push(sourceAndCancelToken.source)

                    const url = api.API_REPOSITORY_COMMUNITY(this.owner(),this.repo())
                    const res = await authRequiredGet(url,
                        {
                            cancelToken:sourceAndCancelToken.cancelToken,
                            headers:{
                                "Accept":"application/vnd.github.black-panther-preview+json"
                            }
                        }
                    )
                    this.data = res.data
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            }
        },
        components: {
            ComplexBubble,
            CheckItem,
            HyperlinkWrapper,
            Container: styled.div``,
            Head: styled.div``,
            SubHead: styled.div``,
            Title: styled.p``,
            ScoreBar: styled.div``,
            Background: styled.div``,
            WhiteCover: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.head {
    display: flex;
    padding-bottom: 8px;
    border-bottom: 1px solid #e1e4e8;
    flex-flow: row wrap;
    h2{
        font-size: 24px;
        font-weight: 400;
        flex: 1 1 auto;
    }
}
.progress-bar {
    background: linear-gradient(90deg,#ffd33d,#c5e300,#28a745);
    background-color: initial;
    height: 10px;
}
.white-cover{
    background: #f6f8fa;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
}
</style>