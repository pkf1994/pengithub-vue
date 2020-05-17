<template>
    <ComplexBubble>
        <template v-slot:title>
            <Title  class="bubble-title" style="font-weight: 700">
                <svg class="v-align-text-bottom d-inline-block bubble-title-icon" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 12v1H0v-1l.73-.58c.77-.77.81-2.55 1.19-4.42C2.69 3.23 6 2 6 2c0-.55.45-1 1-1s1 .45 1 1c0 0 3.39 1.23 4.16 5 .38 1.88.42 3.66 1.19 4.42l.66.58H14zm-7 4c1.11 0 2-.89 2-2H5c0 1.11.89 2 2 2z"></path></svg>
                Notification
            </Title>   
        </template>

        <Content class="bubble-content p-0">
           <button class="list-item" v-for="item in notificationOptions" :key="item.title">
               <svg v-if="item.selectedFlag" class="v-align-text-bottom d-inline-block" fill="currentColor" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg> 
               <strong class="list-item-title">{{item.title}}</strong>
               <small class="description">{{item.description}}</small>
           </button>
        </Content>
        
    </ComplexBubble>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble} from '@/components'
    export default {
        inject: ['codeBasicInfo'],
        props: {
            subscription: {
                type: Object,
                required: true
            }
        },
        computed: {
           notificationOptions() {
               if(this.codeBasicInfo().id) {
                    return [
                        {
                            title: 'Not watching',
                            selectedFlag: this.codeBasicInfo().viewerSubscription == 'UNSUBSCRIBED',
                            description: 'Be notified only when participating or @mentioned.'
                        },
                        {
                            title: 'Releases only',
                            selectedFlag: this.codeBasicInfo().viewerSubscription === null,
                            description: 'Be notified only for new releases, or when participating or @mentioned.'
                        },
                        {
                            title: 'Watching',
                            selectedFlag: this.codeBasicInfo().viewerSubscription == 'SUBSCRIBED',
                            description: 'Be notified of all conversations.'
                        },
                        {
                            title: 'Ignoring',
                            selectedFlag: this.codeBasicInfo().viewerSubscription == "IGNORED",
                            description: 'Never be notified.'
                        },
                    ]
               }
              
               return [
                    {
                        title: 'Not subscribing',
                        selectedFlag: this.subscription.subscribed === undefined,
                        description: 'Be notified only when participating or @mentioned.'
                    },
                    {
                        title: 'Watching',
                        selectedFlag: this.subscription.subscribed,
                        description: 'Be notified of all conversations.'
                    },
                    {
                        title: 'Ignoring',
                        selectedFlag: this.subscription.ignored,
                        description: 'Never be notified.'
                    },
                ]
           }
        },
        methods: {
         
        },
        components: {
            ComplexBubble,
            Title: styled.div``,
            Content: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.list-item{
    border-top: 1px solid #eaecef;
    display: block;
}
.list-item:first-child{
     border-top: none;
}
.list-item-title{
    color: #24292e;
}
.description{
    display: block;
    margin: 0;
    font-size: 12px;
    color: #586069;
}
</style>