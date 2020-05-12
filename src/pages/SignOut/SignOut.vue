<template>
    <Container style="background-color: #f9f9f9;">
        <Logo class="width-full pt-5 pb-4 text-center">
            <router-link to="/">
                <svg height="48" class="v-align-text-bottom d-inline-block" fill="#333" viewBox="0 0 16 16" version="1.1" width="48" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
            </router-link>
        </Logo>

        <Dialog class="Box p-4 mt-3 mx-auto dialog">
            <DialogTitle class="text-center f2-light">
                Are you sure you want to sign out?
            </DialogTitle>
            <button class="btn-block btn py-3 mt-5 width-full f4" @click="signOut">Sign out</button>
        </Dialog>

        <Footer class="mt-6 py-6 px-3">
            <ul class="flex-row-center f6">
                <li class="mr-3" :key="item.href" v-for="item in footerStatementList">
                    <HyperlinkWrapper>
                        <a :href="item.href">{{item.title}}</a>
                    </HyperlinkWrapper>
                </li>
                <li>
                    <router-link class="link-gray" to="/contact_me">
                        Contact Me
                    </router-link>
                </li>
            </ul>
        </Footer>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {HyperlinkWrapper} from '@/components'
    export default {
        data() {
            return {
                footerStatementList: [
                    {
                        href:"https://help.github.com/en/github/site-policy/github-terms-of-service",
                        title: "Terms"
                    },
                    {
                        href:"https://help.github.com/en/github/site-policy/github-privacy-statement",
                        title: "Privacy"
                    },
                    {
                        href:"https://help.github.com/articles/github-security/",
                        title: "Security"
                    }
                ]
            }
        },
        components: {
            HyperlinkWrapper,
            Container: styled.div``,
            Logo: styled.div``,
            Dialog: styled.div``,
            DialogTitle: styled.h1``,
            Footer: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
.dialog{
    width: 340px;
    margin: 0 auto;
}
</style>