<template>
    <Container class="py-4 px-3">
        <RowOne class="d-flex flex-justify-between width-full width-md-auto">
            <button class="btn btn-sm select-menu-button">
                <i>Branch:</i>
                <span class="end-with-triangle branch" data-menu-button="">patreon-update…</span>
            </button>

            <button class="btn btn-sm" id="file-detail-copy-btn" :data-clipboard-text="location.href"> 
                Copy path
            </button>
        </RowOne>

        <FilePath class="file-path text-normal my-2 flex-auto text-bold">
            <router-link :to="`/${owner}/${repo}`">{{repo}}</router-link>&nbsp;/<Breadcrumb :customFragment="[{index:2,fragment:'tree'}]" :spaceArround="true" :startIndex="4"/>
        </FilePath>
        
        <ContributionMessage></ContributionMessage> 

        <Content></Content>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Breadcrumb} from '../../../../../components'
    import ClipboardJS from 'clipboard'
    import {ContributionMessage,Content} from './components'
    import {ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB} from '../../../../../store/modules/repository/actionTypes'
    import {mapActions,mapState} from 'vuex'
    export default {
        inject: ['owner','repo'],
        created() {
            this.action_getBlob({
                owner: this.owner,
                repo: this.repo,
                path: this.$route.params.pathMatch,
                branch: this.$route.params.branch
            })
        },
        mounted() {
            this.initClipboard()
        },
        computed: {
            ...mapState({
                contents: state => state.repository.code.codeFileBrows
            }),
            location() {
                return location
            }
        },
        methods: {
            ...mapActions({
                action_getBlob: ACTION_REPOSITORY_REQUEST_CONTENTS_BLOB,
            }),
            initClipboard() {
                let clip = new ClipboardJS('#file-detail-copy-btn');
                clip.on('success',e => {
                    this.$toast("Clip OK!")
                })
            }
        },
        components: {
            Breadcrumb,
            ContributionMessage,Content,
            Container: styled.div``,
            RowOne: styled.div``,
            CopyPath: styled.div``,
            FilePath: styled.h2``
        }
    }
</script>

<style scoped>
.file-path{
    font-size: 16px;
    color: #586069;
}
.branch{
    display: inline-block;
    max-width: 125px;
    vertical-align: top;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>