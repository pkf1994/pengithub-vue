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
    import {
        ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA,
        ACTION_REPOSITORY_REQUEST_README_DATA} from '../../../store/modules/repository/actionTypes'
    export default {
        inject: ['owner','repo'],
        created() {
            this.action_getData({repo:this.repo,owner:this.owner})
        },
        methods: {
            ...mapActions({
                action_getData: ACTION_REPOSITORY_REQUEST_CODE_BASIC_DATA
            }),
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>