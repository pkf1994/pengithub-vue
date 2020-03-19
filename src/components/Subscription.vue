<template>
        <Container>
            <Description class="description relative">
                <svg height="32" class="octicon octicon-radio-tower" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M4.79 6.11c.25-.25.25-.67 0-.92-.32-.33-.48-.76-.48-1.19 0-.43.16-.86.48-1.19.25-.26.25-.67 0-.92a.613.613 0 00-.45-.19c-.16 0-.33.06-.45.19-.57.58-.85 1.35-.85 2.11 0 .76.29 1.53.85 2.11.25.25.66.25.9 0zM2.33.52a.651.651 0 00-.92 0C.48 1.48.01 2.74.01 3.99c0 1.26.47 2.52 1.4 3.48.25.26.66.26.91 0s.25-.68 0-.94c-.68-.7-1.02-1.62-1.02-2.54 0-.92.34-1.84 1.02-2.54a.66.66 0 00.01-.93zm5.69 5.1A1.62 1.62 0 106.4 4c-.01.89.72 1.62 1.62 1.62zM14.59.53a.628.628 0 00-.91 0c-.25.26-.25.68 0 .94.68.7 1.02 1.62 1.02 2.54 0 .92-.34 1.83-1.02 2.54-.25.26-.25.68 0 .94a.651.651 0 00.92 0c.93-.96 1.4-2.22 1.4-3.48A5.048 5.048 0 0014.59.53zM8.02 6.92c-.41 0-.83-.1-1.2-.3l-3.15 8.37h1.49l.86-1h4l.84 1h1.49L9.21 6.62c-.38.2-.78.3-1.19.3zm-.01.48L9.02 11h-2l.99-3.6zm-1.99 5.59l1-1h2l1 1h-4zm5.19-11.1c-.25.25-.25.67 0 .92.32.33.48.76.48 1.19 0 .43-.16.86-.48 1.19-.25.26-.25.67 0 .92a.63.63 0 00.9 0c.57-.58.85-1.35.85-2.11 0-.76-.28-1.53-.85-2.11a.634.634 0 00-.9 0z"></path></svg>
                Your subscription status is {{viewerSubscription}}.
            </Description>
            <div class="d-flex flex-justify-between">
                <span class="text-bold">Notifications</span>        
                <span class="text-normal">Customize</span>
            </div>
            <button type="submit" class="btn btn-block mt-2" data-disable-with="">
                <svg v-if="subscriptionContext === 'Unsubscribe'" class="octicon octicon-mute v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 2.81v10.38c0 .67-.81 1-1.28.53L3 10H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h2l3.72-3.72C7.19 1.81 8 2.14 8 2.81zm7.53 3.22l-1.06-1.06-1.97 1.97-1.97-1.97-1.06 1.06L11.44 8 9.47 9.97l1.06 1.06 1.97-1.97 1.97 1.97 1.06-1.06L13.56 8l1.97-1.97z"></path></svg> 
                <svg v-else class="octicon octicon-unmute v-align-text-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 8.02c0 1.09-.45 2.09-1.17 2.83l-.67-.67c.55-.56.89-1.31.89-2.16 0-.85-.34-1.61-.89-2.16l.67-.67A3.99 3.99 0 0112 8.02zM7.72 2.28L4 6H2c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h2l3.72 3.72c.47.47 1.28.14 1.28-.53V2.81c0-.67-.81-1-1.28-.53zm5.94.08l-.67.67a6.996 6.996 0 012.06 4.98c0 1.94-.78 3.7-2.06 4.98l.67.67A7.973 7.973 0 0016 8c0-2.22-.89-4.22-2.34-5.66v.02zm-1.41 1.41l-.69.67a5.05 5.05 0 011.48 3.58c0 1.39-.56 2.66-1.48 3.56l.69.67A5.971 5.971 0 0014 8.02c0-1.65-.67-3.16-1.75-4.25z"></path></svg>
                {{subscriptionContext}}
            </button>
        </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            viewerSubscription: {
                type: String,
                required: false
            }
        },
        computed: {
            subscriptionContext() {
                switch(this.viewerSubscription) {
                    case 'UNSUBSCRIBED':
                    case 'IGNORED':
                        return 'Subscribe'
                    default:
                        return 'Unsubscribe'
                }
            }
        },
        methods: {
         
        },
        components: {
            Container: styled.div``,
            Header: styled.div``,
            Description: styled.div``,
        }
    }
</script>

<style scoped lang='scss'>
   

.description{
    margin-bottom:13px;
    padding-left:42px;
    position: relative;
    min-height: 30px;
    margin-top: 0;
    font-size: 13px;
    color: #586069;
    svg{
        position: absolute;
        left: 0;
        float: left;
        color: #c6cbd1;
    }
}

.btn {
    display: inline-block;
    padding: 9px 15px;
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.5;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    background-repeat: repeat-x;
    background-position: -1px -1px;
    background-size: 110% 110%;
    border: 1px solid rgba(27,31,35,.2);
    border-radius: .25em;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
</style>