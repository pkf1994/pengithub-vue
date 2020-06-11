<template>
    <Container> 
        <NotificationPane v-if="data" class="p-3 flash flash-full">
            <div class="d-flex flex-justify-between">
                <router-link class="btn-outline btn-sm" to="/notifications">
                     ←&nbsp;Notifications
                </router-link>
            </div>

            <div>

            </div>
        </NotificationPane>
        <slot></slot>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {authRequiredGet,cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    export default {
        name: 'with_notification_pane_wrapper',
        data() {
            return {
                data: undefined,
                loading: false
            }
        },
        computed: {
            notificationThreadId() {
                return this.$route.query.notification_thread_id
            }
        },
        created() {
            if(this.notificationThreadId) this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name).cancelToken
                    let url = api.API_NOTIFICATION_THREAD(this.notificationThreadId)

                    let res = await authRequiredGet(url,{cancelToken})

                    this.data = res.data
                    console.log(res)
                }catch(e) {
                    console.log(e)
                }finally{
                    this.loading = false
                }
            }
        },
        components: {
            Container: styled.div``,
            NotificationPane: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/alerts/index.scss';

</style>