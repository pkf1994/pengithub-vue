<template>
    <CommonLoadingWrapper class="pt-3" :loading="loading">
        <SimpleBubble v-if="firstLoadedFlag" :title="`${meta} branches`" :headerStyle="bubbleHeaderStyle">
            <transition-group name="fade-group" appear>
                    <BranchItem v-for="item in data" 
                            :key="item.name" 
                            :branch="item" 
                            :magicStyle="{lineHeight: '1.5'}"
                            :style="{padding:'16px'}"></BranchItem>
            </transition-group>
        </SimpleBubble>

        <Pagination v-if="pagination.next || pagination.previous" class="paginate-container">
            <div class="pagination">
                <router-link v-if="pagination.previous" :to="`${$route.path}?page=${page - 1}`">Previous</router-link>
                <span class="disabled" v-else>Previous</span>
                <router-link v-if="pagination.next" :to="`${$route.path}?page=${parseInt(page) + 1}`">Next</router-link>
                <span class="disabled" v-else>Next</span>
            </div>
        </Pagination>
    </CommonLoadingWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {SimpleBubble,CommonLoadingWrapper} from '@/components'
    import BranchItem from './BrancheItem'
    import * as api from '@/network/api'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {commonGet} from '@/network'
    export default {
        inject: ['owner','repo'],
        mixins: [RouteUpdateAwareMixin],
        name: 'repository_branches_page',
        props: {
            propsMeta: String
        },
        data() {
            return {
                loading: false,
                data: [],
                bubbleHeaderStyle: {
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    paddingRight: '16px',
                    paddingLeft: '16px',
                },
                pagination:{
                    next: false,
                    previous: false
                },
                firstLoadedFlag: false
            }
        },
        computed: {
            meta() {
                return this.propsMeta || 'all'
            },
            page() {
                return this.$route.query.page || 1
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + this.meta)
                    let url = api.API_PROXY_ALL_BRANCHES({
                        meta: this.meta,
                        owner: this.owner(),
                        repo: this.repo(),
                        params: this.$route.query
                    })
                    let res = await commonGet(url,{cancelToken})

                    this.parse(res.data)

                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            parse(HTML) {
                let execPattern = /<li class="Box-row position-relative">(?:\r|\n)\s*<branch-filter-item-controller branch="(.*)" class="d-flex flex-items-center Details">(?:.|\r|\n)*?<time-ago datetime="(.*)" class="no-wrap">(?:.*)<\/time-ago> by (?:<a[^>]*>(.*)<\/a>|(.*))(?:.|\r|\n)*?<\/li>/g
                let execResult
                let branches = []
                while((execResult = execPattern.exec(HTML)) != null) {
                    let stateSvgHolder = execResult[0].match(/<span class=".*" aria-label="(?:.*)">(?:\n|\r)\s*<svg[^>]*>.*<\/svg>(?:\n|\r)\s*<\/span>/g)
                    branches.push({
                        name: execResult[1],
                        updatedAt: execResult[2],
                        updatedBy: execResult[3] || execResult[4],
                        updatedByIsUser: execResult[0].indexOf('data-hovercard-type="user"') != -1,
                        stateSvg: stateSvgHolder && stateSvgHolder[0]
                    })
                }
                window.scrollTo(0,0)
                this.data = branches
                if(branches.length > 0) this.firstLoadedFlag = true

                let paginationPreviousHolder = HTML.match(/<a.*href="(.*)">Previous<\/a>/g)
                let paginationNextHolder = HTML.match(/<a.*href="(.*)">Next<\/a>/g)

                this.pagination.previous = paginationPreviousHolder != null
                this.pagination.next = paginationNextHolder != null
            }
        },
        components: {
            SimpleBubble,
            CommonLoadingWrapper,
            BranchItem,
            Container: styled.div``,
            Pagination: styled.div``,
        }
    }
</script>

<style lang="scss">
@import 'node_modules/@primer/css/pagination/index.scss';
</style>