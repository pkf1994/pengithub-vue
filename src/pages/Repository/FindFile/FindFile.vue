<template>
    <Container>
        <SearchInput class="search-input">
            <input v-model="searchQuery" type="text" name="q" autofocus="" autocomplete="off" spellcheck="false" autocapitalize="off" autocorrect="off" id="tree-finder-field" class="form-control input-block js-tree-finder-field" placeholder="Search by name to jump to a file" >
        </SearchInput>

        <Main>
            <transition-group name="fade-group" appear>
                <FileListItem v-for="item in filteredFiles.slice(0,50)" :key="`${item.sha}-${item.path}`" :file="item" :highlightStr="searchQuery">
                </FileListItem>
            </transition-group>
        </Main>

        <transition name="fade" appear>
            <CommonLoading v-if="loading"></CommonLoading>
        </transition>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoading} from '@/components'
    import FileListItem from './FileListItem.vue'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import * as api from '@/network/api'
    import {authRequiredGet} from '@/network'
    export default {
        name: 'find_file_page',
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                searchQuery: '',
                data: [],
                loading: false
            }
        },
        computed: {
            filteredFiles() {
                return this.data.filter(i => {
                    return i.type == 'blob' && (i.path.toLowerCase().indexOf(this.searchQuery.toLowerCase()) != -1)
                })
            },
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
            sha() {
                return this.$route.params.sha
            },
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_TREE_LIST(this.$route.params)
                    let res = await authRequiredGet(url,{cancelToken})
                    this.data = res.data.tree
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
        },
        components: {
            CommonLoading,
            FileListItem,
            Container: styled.div``,
            SearchInput: styled.div``,
            Main: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
.search-input {
    position: relative;
    padding: 7px 15px;
    clear: both;
    font-size: 12px;
    font-weight: 600;
    color: #586069;
    background-color: #f6f8fa;
    border-top: 1px solid #eaecef;
}
</style>