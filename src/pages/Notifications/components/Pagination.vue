<template>
    <Container class="d-flex flex-column flex-items-center width-full pb-6 pt-4 mb-6 f6 flex-auto flex-justify-end flex-shrink-0">
        <PageInfo class="mr-0 mb-2">
            <strong>{{startIndex}}-{{endIndex}}</strong> of {{totalCount}}           
        </PageInfo>
        <HrefBtnGroup class="paginate-container BtnGroup m-0 d-flex flex-items-center">
            <button type="button" class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.prev" @click="goPrev">Prev</button>
            <button type="button" class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.next" @click="goNext">Next</button>
        </HrefBtnGroup>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            loading: {
                type: Boolean,
                default: false
            },
            totalCount: {
                type: Number,
                default: 0
            },
            pageInfo: {
                type: Object,
                required: true
            },
            nextPageRouterLink: {
                type: String,
                required: false
            },
            prevPageRouterLink: {
                type: String,
                required: false
            },
        },
        computed:{
            startIndex() {
                let currentPage
                let per_page
                if(this.pageInfo.next) {
                    currentPage = this.pageInfo.next.page - 1
                    per_page = this.pageInfo.next.per_page
                }else if(this.pageInfo.prev) {
                     currentPage = parseInt(this.pageInfo.prev.page) + 1
                    per_page = this.pageInfo.prev.per_page
                }
                if(!currentPage) return 0
                return (currentPage - 1) * per_page + 1
            },
            endIndex() {
                let currentPage
                let per_page
                if(this.pageInfo.next) {
                    currentPage = this.pageInfo.next.page - 1
                    per_page = this.pageInfo.next.per_page
                }else if(this.pageInfo.prev) {
                     currentPage = parseInt(this.pageInfo.prev.page) + 1
                    per_page = this.pageInfo.prev.per_page
                }
                if(!currentPage) return 0
                return currentPage * per_page
            },
        },
        methods: {
            goNext() {
                if(this.loading) return 
                this.$router.push(this.nextPageRouterLink)
            },
            goPrev() {
                 if(this.loading) return 
                this.$router.push(this.prevPageRouterLink)
            },
        },
        components: {
            Container: styled.div``,
            PageInfo: styled.div``,
            HrefBtnGroup: styled.nav``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/pagination/index.scss';
</style>