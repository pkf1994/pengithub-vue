<template>
    <Container class="flex-column flex-items-stretch py-4 px-3">
        <Head class="head mx-3">
            <h2>Community profile</h2>  
        </Head>
        <SubHead class="my-5 mx-3">
            <p class="f3-light">Here’s how this project compares to <a href="https://opensource.guide">recommended community standards</a>.</p>
        </SubHead>

        <Title class="mb-2 mx-3">
            <span class="f4 text-bold">Checklist</span>
        </Title>

        <ComplexBubble :loading="loading">
            <ScoreBar class="position-relative border-bottom">
                <Background class="progress-bar round-1"></Background>
                <WhiteCover class="white-cover" :style="{width: parseInt(100 -data.health_percentage) + '%'}"></WhiteCover>
            </ScoreBar>
            <CheckItem :checked="data.description && data.description.trim() !== ''">
                    Description
            </CheckItem>
            <CheckItem :checked="data.files && data.files.readme">
                    README
            </CheckItem>
            <CheckItem :checked="data.files && data.files.code_of_conduct" :withProposeBtn="true">
                   Code of conduct
            </CheckItem>
            <CheckItem :checked="data.files && data.files.contributing" 
                        :withProposeBtn="true" 
                        subNotice="Writing contributing guidelines">
                    Contributing
            </CheckItem>
            <CheckItem :checked="data.files && data.files.license" 
                        :withProposeBtn="true" 
                        subNotice="Choosing a license">
                    License
            </CheckItem>
            <CheckItem :checked="data.files && data.files.issue_template">
                    Issue templates
            </CheckItem>
            <CheckItem :checked="data.files && data.files.pull_request_template">
                    Pull request template
            </CheckItem>
        </ComplexBubble>

        <p class="mt-1 mr-3 text-small text-right">What is <a href="https://help.github.com/articles/viewing-your-community-profile">the community profile</a>?</p>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble} from '../../../components'
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
                    this.loading = false
                }catch(e) {
                    this.loading = false
                    console.log(e)
                }
            }
        },
        components: {
            ComplexBubble,
            CheckItem,
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