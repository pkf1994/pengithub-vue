<template>
    <Container>
        <SearchInputWrapper class="p-2 border-bottom">
            <input aria-label="Search GitHub"
                   v-model="localSearchQuery"
                   autocapitalize="off"
                   autocomplete="off"
                   autofocus=""
                   ref="input"
                   class="search-input form-control input-block"
                   placeholder="Search GitHub"
                   spellcheck="false"
                   type="text"/>
        </SearchInputWrapper>

        <ComplexTopTab class="mb-2 border-bottom" :tabs="tabs"/>
        <keep-alive>
            <router-view/>
        </keep-alive>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {SearchInput, ComplexTopTab, WithSearchInputMixin} from '../../../components'
    import {util_numberFormat} from '../../../util'
    import {mapState} from "vuex";
    export default {
        mixins: [WithSearchInputMixin],
        computed: {
            ...mapState({
                countOfRepository: state => state.search.searchResult.repositories.totalCount,
                countOfCode: state => state.search.searchResult.code.totalCount,
                countOfCommit: state => state.search.searchResult.commits.totalCount,
                countOfUser: state => state.search.searchResult.users.totalCount,
                countOfIssue: state => state.search.searchResult.issues.totalCount,
                countOfTopic: state => state.search.searchResult.topics.totalCount,
            }),
            tabs: function () {
                return [
                    {
                        to: `/search?q=${this.searchQuery}`,
                        label: 'Repositories',
                        meta: this.countOfRepository === 0 ? undefined : util_numberFormat.thousands2K2M(this.countOfRepository,0)
                    },
                    {
                        to: `/search/code?q=${this.searchQuery}`,
                        label: 'Code',
                        meta: this.countOfCode === 0 ? undefined : util_numberFormat.thousands2K2M(this.countOfCode,0)
                    },
                    {
                        to: `/search/commits?q=${this.searchQuery}`,
                        label: 'Commits',
                        meta: this.countOfCommit === 0 ? undefined : util_numberFormat.thousands2K2M(this.countOfCommit,0)
                    },
                    {
                        to: `/search/issues?q=${this.searchQuery}`,
                        label: 'Issues',
                        meta: this.countOfIssue === 0 ? undefined : util_numberFormat.thousands2K2M(this.countOfIssue,0)
                    },
                    {
                        to: `/search/users?q=${this.searchQuery}`,
                        label: 'Users',
                        meta: this.countOfUser === 0 ? undefined : util_numberFormat.thousands2K2M(this.countOfUser,0)
                    },
                    {
                        to: `/search/topics?q=${this.searchQuery}`,
                        label: 'Topics',
                        meta: this.countOfTopic === 0 ? undefined : util_numberFormat.thousands2K2M(this.countOfTopic,0)
                    }
                ]
            }
        },
        methods: {
            search() {
                if(!this.localSearchQuery || this.localSearchQuery.trim() === "") return
                console.log(`${this.$route.path}?q=${this.localSearchQuery}`)
                this.$router.push({
                    path: `${this.$route.path}?q=${this.localSearchQuery}`
                })
            },
        },
        components: {
            SearchInput,
            ComplexTopTab,
            Container: styled.div``,
            SearchInputWrapper: styled.div``
        }
    }
</script>

<style scoped>
    .search-input::placeholder{
        color:#586069;
        opacity: 0.55;
    }
</style>