<template>
    <Container>
        <router-view name="RepositoryCodeMain"></router-view>
        <keep-alive>
            <router-view name="RepositoryCodeFileBrowser"></router-view>
        </keep-alive>
        <router-view name="RepositoryCodeFileDetail"></router-view>
    </Container>   
</template>

<script>
    import styled from 'vue-styled-components'
    import { mapState,mapActions } from 'vuex'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import { cancelAndUpdateAxiosCancelTokenSource,authRequiredGitHubGraphqlApiQuery} from '@/network'
    import * as graphql from './graphql'
    //deprecated
    import {
        ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA,
        } from '../../../store/modules/repository/actionTypes'
    export default {
        mixins: [RouteUpdateAwareMixin],
        inject: ['owner','repo'],
        provide() {
            return {
                codeBasicInfo: () => this.data
            }
        },
        data() {
            return {
                data: {},
                loading: false
            }
        },
        created() {
            //deprecated
            this.network_getData()
        },
        methods: {
            //deprecated
            ...mapActions({
                action_getData: ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA
            }),
            //获取仓库文件基本信息
            async network_getData() {
                try{
                    this.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource()
                    this.cancelSources.push(sourceAndCancelToken.source)

                    let graphql_codeBasicInfo = graphql.GRAPHQL_REPOSITORY_CODE_BASIC_INFO(this.owner(),this.repo())
                    const res = await authRequiredGitHubGraphqlApiQuery(graphql_codeBasicInfo,{cancelToken:sourceAndCancelToken.cancelToken})
                    this.data = res.data.data.repository
            
                    this.loading = false
                }catch(e) {
                    console.log(e)
                    this.loading = false
                }
            }
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>