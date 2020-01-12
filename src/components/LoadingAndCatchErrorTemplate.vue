<template>
    <Container>
        <slot v-if="!errorData.errorOccurred && !emptyData.emptyResult"></slot>  

         <transition name="fade" appear>
            <CommonLoading  v-if="showSpinner && loadingInfo.basicLoading || loadingInfo.additionalLoading"
                            :preventClickEvent="false"
                            :position="loadingInfo.basicLoading ? 'center' : 'corner'"/>
        </transition>  

        <transition name="fade" appear>
            <EmptyResultNotice v-if="emptyData.emptyResult && !errorData.errorOccurred" class="p-6 flex-column-center">
                <svg height="32" class="blankslate-icon v-align-text-bottom" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0013 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 000-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"></path></svg>
                <Message class="text-center">
                    {{emptyData.emptyMessage}}
                </Message> 
            </EmptyResultNotice>            
        </transition>
        

        <transition name="fade" appear>
            <ErrorOccurredNotice v-if="errorData.errorOccurred"  class="error-notice-container position-fixed p-6 flex-column-center">
                <svg 
                    style="color: #cb2431;opacity:0.7"
                    fill="currentColor"
                    viewBox="0 0 14 16"
                    version="1.1"
                    width="50"
                    height="50"
                    aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
                <Message style="opacity:0.7">
                    Network Error
                </Message>
               <!--  <button @click="errorData.reTryCallback" class="btn block width-full mt-3">
                    try again
                </button>  -->
            </ErrorOccurredNotice>
        </transition>
       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoading} from './Loading'
    export default {
        props: {
            errorData: {
                type: Object,
                required: true
            },
            emptyData: {
                type: Object,
                default: () => ({
                    emptyResult: false,
                    emptyMessage: "Empty result"
                })
            },
            loadingInfo: {
                type: Object,
                required: true
            },
            showSpinner: {
                type: Boolean,
                default: true
            }
        },
        components: {
            CommonLoading,
            Container: styled.div``,
            EmptyResultNotice: styled.div``,
            ErrorOccurredNotice: styled.div``,
            Message: styled.h3``
        }
    }
</script>

<style scoped>
.blankslate-icon {
    margin-right: 4px;
    margin-bottom: 8px;
    margin-left: 4px;
    color: #a3aab1;
}
.error-notice-container{
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
}
</style>