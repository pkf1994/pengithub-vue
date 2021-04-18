<template>
    <Container>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </Container>   
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import { cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import * as graphql from './graphql'
    export default {
        mixins: [RouteUpdateAwareMixin],
        inject: ['repoBasicInfo'],
        computed: {
            documentTitle() {
                if(!this.repoBasicInfo().description) return `${this.owner}/${this.repo}`
                return `${this.owner}/${this.repo}: ${this.repoBasicInfo().description}`
            }
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>