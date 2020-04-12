<template>
    <Container class="d-flex flex-column">
       <Switcher class="p-2 d-flex">
           <button class="btn d-flex width-full mr-2" @click="() => triggerModal('switchModal')">
               <span class="flex-auto text-left">{{participating ? 'Participating' : 'Inbox'}}</span>
               <div class="flex-self-center dropdown-caret"></div>
           </button>
            <div class=" d-inline position-relative">
                <button class="btn"  @click="() => triggerModal('isPopover')">
                    {{all == true ? 'All' : 'Unread'}}
                    <div class="dropdown-caret"></div>
                </button>
                <Popover ref="isPopover" :popoverStyle="{right:'0px',top: '100%'}" :width="160" class="py-2 mt-1"> 
                    <router-link @click.native="closeModal" :to="allRouterLink" class="dropdown-item py-2 text-left">All</router-link> 
                    <router-link @click.native="closeModal" :to="UnreadRouterLink" class="dropdown-item py-2 text-left">Unread</router-link> 
                </Popover>
            </div>
          
       </Switcher>

       <SelectAllRow class="Box-header d-flex flex-items-center py-2 pl-3" style="height:52px">
           <label class="h6 pl-0 pl-md-4">
               <input class="mr-1" type="checkbox" autocomplete="off">
               <span>Select all</span>
           </label>
       </SelectAllRow>

       <transition-group name="fade-group" tag='div' class="bg-gray"  appear>
            <NotificationListItem v-for="item in data" :key="item.id" :notification="item"></NotificationListItem>
       </transition-group>

       <Pagination  v-if="pageInfo.next || pageInfo.prev" 
                    :loading="loading"
                    :pageInfo="pageInfo" 
                    :nextPageRouterLink="nextPageRouterLink"
                    :prevPageRouterLink="prevPageRouterLink"
                    :totalCount="parseInt(totalCount.data)"></Pagination>

        <Modal title="Switch Inbox" ref="switchModal">
            <router-link :to='inboxRouterLink' class="SelectMenu-item d-flex flex-justify-between" @click.native="closeModal">
                <span>
                    <svg class="octicon octicon-inbox mr-2" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 9l-1.13-7.14c-.08-.48-.5-.86-1-.86H2.13c-.5 0-.92.38-1 .86L0 9v5c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V9zm-3.28.55l-.44.89c-.17.34-.52.56-.91.56H4.61c-.38 0-.72-.22-.89-.55l-.44-.91c-.17-.33-.52-.55-.89-.55H1l1-7h10l1 7h-1.38c-.39 0-.73.22-.91.55l.01.01z"></path></svg>Inbox
                </span>
                <span class="count text-normal" v-if="unreadNotificationCount > 0">{{unreadNotificationCount}}</span>
            </router-link> 
            <router-link :to='participatingRouterLink' class="SelectMenu-item d-flex flex-justify-between" @click.native="closeModal">
                <span>💬 Participaing</span>
                <span class="count text-normal" v-if="participatingNotificationCount.data > 0">{{participatingNotificationCount.data}}</span>
            </router-link> 
        </Modal>

        
        <transition name="fade" appear>
            <CommonLoading v-if="loading || extraData.loading || totalCount.loading" :position="loading ? 'center' : 'corner'"></CommonLoading>
        </transition>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Modal, Popover, CommonLoading} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {util_queryParse} from '@/util'
    import {NotificationListItem,Pagination} from './components'
    import * as api from '@/network/api'
    import * as graphql from './graphql'
    import {authRequiredGet, authRequiredGitHubGraphqlApiQuery } from '@/network'
    const parse = require('parse-link-header')
    import {mapState} from 'vuex'
    export default {
        mixins: [RouteUpdateAwareMixin],
        name: 'notifications_page',
        provide() {
            return {
                extraDataProvided: () => this.extraData.data
            }
        },
        data() {
            return {
                data: [],
                totalCount: {
                    data: 0,
                    loading: false
                },
                participatingNotificationCount: {
                    data: 0,
                    loading: false
                },
                loading: false,
                perPage: 10,
                pageInfo: {},
                extraData: {
                    data: [],
                    loading: false
                }
            }
        },
        computed: {
            ...mapState({
                unreadNotificationCount: state => state.notifications.unread.count
            }),
            participating() {
                return this.$route.query.participating
            },
            all() {
                return this.$route.query.all || true
            },
            inboxRouterLink() {
                let queryString = util_queryParse.querify({
                    ...this.$route.query,
                    participating: undefined
                })
                return `/notifications?${queryString}`
            },
            participatingRouterLink() {
                let queryString = util_queryParse.querify({
                    ...this.$route.query,
                    participating: true
                })
                return `/notifications?${queryString}`
            },
            allRouterLink() {
                 let queryString = util_queryParse.querify({
                    ...this.$route.query,
                     all: undefined
                })
                return `/notifications?${queryString}`
            },
            UnreadRouterLink() {
                 let queryString = util_queryParse.querify({
                    ...this.$route.query,
                    all: false
                })
                return `/notifications?${queryString}`
            },
            nextPageRouterLink() {
                let queryString = util_queryParse.querify({
                    ...this.$route.query,
                    page: parseInt(this.page) + 1
                })
                return `/notifications?${queryString}`
            },
            prevPageRouterLink() {
                let queryString = util_queryParse.querify({
                    ...this.$route.query,
                    page: parseInt(this.page) - 1
                })
                return `/notifications?${queryString}`
            },
            page() {
                return this.$route.query.page || 1
            }
        },
        created() {
            this.network_getNotificationCount()
            this.network_getParticipatingNotificationCount()
            this.network_getData()
        },
        methods: {
             async network_getNotificationCount() {
                try{
                    this.totalCount.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_notification_count')
                    let url = api.API_USER_NOTIFICATIONS({
                        all: true,
                        ...this.$route.query,
                        per_page: 1,
                    })
                    let res = await authRequiredGet(url,{cancelToken})
                    let pageInfo = parse(res.headers.link) || {}
                    this.totalCount.data = pageInfo.last && pageInfo.last.page
                    this.totalCount.loading = false
                }catch(e) {
                    this.totalCount.loading = false
                    console.log(e)
                } 
            },
            async network_getParticipatingNotificationCount(){
                 try{
                    this.participatingNotificationCount.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_participating_notification_count')
                    let url = api.API_USER_NOTIFICATIONS({
                        all: true,
                        ...this.$route.query,
                        participating: true,
                        per_page: 1,
                    })
                    let res = await authRequiredGet(url,{cancelToken})
                    let pageInfo = parse(res.headers.link) || {}
                    this.participatingNotificationCount.data = pageInfo.last && pageInfo.last.page
                    this.participatingNotificationCount.loading = false
                }catch(e) {
                    this.participatingNotificationCount.loading = false
                    console.log(e)
                } 
            },
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_USER_NOTIFICATIONS({
                        all: true,
                        ...this.$route.query,
                        per_page: this.perPage,
                        page: this.page
                    })
                    let res = await authRequiredGet(url,{cancelToken})
                    this.data = res.data
                    this.pageInfo = parse(res.headers.link) || {}
                    this.network_getExtraData()
                    this.loading = false
                }catch(e) {
                    this.loading = false
                    console.log(e)
                } 
            },
            async network_getExtraData() {
                try{
                    this.extraData.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_extra_data')
                    let graphql_extraData = graphql.GRAPHQL_NOTIFICATION_SUBJECTS(this.data)
                    let res_extraData = await authRequiredGitHubGraphqlApiQuery(graphql_extraData,{cancelToken})
                    let extraData = []
                    for(let key in res_extraData.data.data) {
                        extraData.push(res_extraData.data.data[key])
                    }
                    this.extraData.data = extraData
                    this.extraData.loading = false
                }catch(e) {
                    this.extraData.loading = false
                    console.log(e)
                }
            },
            triggerModal(ref) {
                console.log(ref)
                console.log( this.$refs)
                this.$refs[ref].show = true
            },
            closeModal() {
                for(let key in this.$refs) {
                    if(this.$refs[key].show) this.$refs[key].show = false
                }
            },
            routeUpdateHook() {
                this.network_getData()
            }
        },
        watch: {
            participating() {
                this.network_getNotificationCount()
            },
            all() {
                this.network_getNotificationCount()
            },
        },
        components: {
            Modal,
            Popover,
            CommonLoading,
            Pagination,
                NotificationListItem,
            Container: styled.div``,
            Switcher: styled.div``,
            SelectAllRow: styled.div``,
        }
    }
</script>

<style scoped lang="scss"> 
@import 'node_modules/@primer/css/dropdown/index.scss';
@import 'node_modules/@primer/css/select-menu/index.scss';
@import 'node_modules/@primer/css/box/index.scss';

</style>