<template>
    <Container>
        <PaddingPageTopTab :tabs="topTabData"></PaddingPageTopTab>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {PaddingPageTopTab,WithSignInNoticeWrapper} from '@/components'
    import * as graphql from './graphql.js'
    export default {
        inject: ['owner','repo'],
        computed: {
            topTabData() {
                return [
                    {
                        to: `/${this.owner()}/${this.repo()}/branches`,
                        label: 'Overview',
                        activeFlag: this.$route.path.match(/branches$/) != null
                    },
                    {
                        to: `/${this.owner()}/${this.repo()}/branches/all`,
                        label: 'All branches',
                        activeFlag: this.$route.path.match(/all$/) != null
                    }
                ]
            }
        },
        components: {
            PaddingPageTopTab,
            WithSignInNoticeWrapper,
            Container: styled.div``,
        }
    }
</script>

<style scoped>

</style>