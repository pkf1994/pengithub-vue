<template>
    <Container class="flex-grow-1">
        <LogoHeader></LogoHeader>
        <Jumbotron class="bg-gray-dark text-white py-5 text-center">
            <The404Headline class="headline pt-5 text-bold mx-2 mt-0">
                4<span class="not-found-octocat-wrapper d-inline-block mx-2 bg-gray-dark position-relative">
                    <svg class="not-found-lightbulb-ani position-relative" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 132.1 129.8" enable-background="new 0 0 132.1 129.8" width="72" xml:space="preserve">
                        <path fill="#fff" d="M110.8,19c12.2,12.2,18.5,27.5,18.9,45.9c-0.3,14.5-4.4,27.3-12.5,38.3c-8.1,11-18.7,18.8-31.8,23.3
                            c-1.6,0.3-2.7,0-3.4-0.7c-0.7-0.7-1-1.5-1-2.5l0.1-17.7c-0.1-3-0.6-5.6-1.4-7.5c-0.8-2-1.9-3.5-3-4.5c7.5-0.5,14.3-2.9,20.2-7.3
                            c6-4.3,9.1-12.6,9.4-24.8c-0.1-3.5-0.7-6.8-1.8-9.6c-1.1-2.9-2.8-5.4-4.9-7.7c0.5-0.8,0.9-2.8,1.3-5.8c0.3-3-0.3-6.8-1.9-11.4
                            c0-0.3-1.4-0.2-4.3,0.2c-2.9,0.4-7.4,2.6-13.6,6.5c-5.2-1.4-10.6-2.2-16.2-2.2s-11,0.7-16.2,2.2c-6.2-4-10.7-6.1-13.6-6.5
                            c-2.9-0.4-4.3-0.4-4.3-0.2c-1.6,4.6-2.2,8.4-1.9,11.4c0.3,3,0.8,5,1.3,5.8c-2.1,2.3-3.7,4.9-4.9,7.7c-1.1,2.9-1.8,6.1-1.8,9.6
                            c0.3,12.2,3.5,20.4,9.4,24.8c5.9,4.4,12.7,6.8,20.3,7.3c-1,0.8-1.9,2-2.6,3.4c-0.7,1.4-1.2,3.2-1.6,5.3c-2,1.1-4.9,1.6-8.6,1.6
                            c-3.7,0-7.1-2.4-10.3-7c0-0.3-0.8-1.3-2.5-3.2c-1.7-1.9-4.1-3-7.3-3.5c-0.4-0.1-1.2,0.1-2.5,0.5c-1.2,0.4-0.6,1.6,2,3.5
                            c0.1-0.1,0.9,0.6,2.5,1.9c1.6,1.4,3.1,3.8,4.8,7.5c-0.3,0.6,1.1,2.4,4.1,5.3c3,3,8.9,3.8,17.7,2.4l0.1,12c0,0.9-0.3,1.8-1,2.5
                            c-0.7,0.7-1.8,1-3.4,0.7c-13.1-4.6-23.7-12.3-31.8-23.3C4.4,92.2,0.3,79.5,0,64.9C0.4,46.5,6.7,31.2,18.9,19
                            C31.1,6.8,46.5,0.5,64.9,0.1C83.3,0.5,98.6,6.8,110.8,19z">
                        </path>
                    </svg>
                </span>4
            </The404Headline>
            <Notice class="pb-5">
                <h4 class="mb-0">Didn’t find anything here!</h4>
                <p class="mt-2" v-if="!accessToken">
                    Need to
                    <a :href="oauthLink">sign in</a>?
                </p>
            </Notice>
        </Jumbotron>

        <SearchPane class="mt-5 px-3">
            <label for="not-found-search" class="d-block text-normal text-gray mb-1 f4">Find code, projects, and people on GitHub:</label>
            <div class="d-flex flex-items-center">
                <input type="text" ref="input" v-model="localSearchQuery" class="flex-auto input-lg form-control mr-2">
                <button class="btn" @click="search">Search</button>
            </div>
        </SearchPane>

        <TheLinks class="mt-5 text-gray-light text-center">
            <HyperlinkWrapper>
                <a href="https://github.com/contact" class="link-gray">Contact Support</a>
            </HyperlinkWrapper>
            -
            <HyperlinkWrapper>
                <a href="https://githubstatus.com" class="link-gray">GitHub Status</a>
            </HyperlinkWrapper>
            -
            <HyperlinkWrapper>
                <a href="https://twitter.com/githubstatus" class="link-gray">@githubstatus</a>
            </HyperlinkWrapper>
        </TheLinks>
        <SimpleFooter></SimpleFooter>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {HyperlinkWrapper,LogoHeader,SimpleFooter} from '@/components'
    import {WithSearchInputMixin} from '@/mixins'
    export default {
        name: 'not_found_page',
        mixins: [WithSearchInputMixin],
        components: {
            HyperlinkWrapper,
            LogoHeader,
            SimpleFooter,
            Container: styled.div``,
            Jumbotron: styled.div``,
            The404Headline: styled.div``,
            Notice: styled.div``,
            SearchPane: styled.div``,
            TheLinks: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
.headline{
    font-size: 100px;
    margin-bottom: 20px;
    line-height: 0;
    .not-found-octocat-wrapper {
        width: 71px;
        height: 71px;
        border-radius: 45px;
    }
}

.not-found-lightbulb-ani {
    z-index: 999;
    opacity: .25;
    animation-name: lightbulb;
    animation-duration: 2.5s;
    animation-fill-mode: forwards;
    animation-delay: 1.3s;
}
@keyframes lightbulb {
    0%, 8%, 14% {
        opacity: .1;
    }
    0%, 10%, 25% {
        opacity: .25;
    }
    5%, 30%, 50%, 70% {
        opacity: .5;
    }
    16%, 60%, 80% {
        opacity: .75;
    }
    90% {
        opacity: .8;
    }
    94% {
        opacity: .5;
    }
    100% {
        opacity: 1;
    }
}
</style>