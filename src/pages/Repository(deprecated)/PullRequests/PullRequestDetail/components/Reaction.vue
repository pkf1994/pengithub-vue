<template> 
    <Container  class="border-gray-dark d-flex flex-justify-start flex-wrap mt-2">
        <button class="reaction-item btn-link" :disabled="disabled" v-if="data.THUMBS_UP.totalCount > 0 || data.THUMBS_UP > 0">
            <span class="emoj mr-1">👍</span>        
            {{data.THUMBS_UP.totalCount ? data.THUMBS_UP.totalCount : data.THUMBS_UP}}
        </button><button class="reaction-item btn-link" :disabled="disabled" v-if="data.THUMBS_DOWN.totalCount > 0 || data.THUMBS_DOWN > 0">
            <span class="emoj mr-1">👎</span>        
            {{data.THUMBS_DOWN.totalCount ? data.THUMBS_DOWN.totalCount : data.THUMBS_DOWN}}
        </button><button class="reaction-item btn-link" :disabled="disabled" v-if="data.LAUGH.totalCount > 0 || data.LAUGH > 0">
            <span class="emoj mr-1">😄</span>        
            {{data.LAUGH.totalCount ? data.LAUGH.totalCount : data.LAUGH}}
        </button><button class="reaction-item btn-link" :disabled="disabled" v-if="data.HOORAY.totalCount > 0 || data.HOORAY > 0">
            <span class="emoj mr-1">🎉</span>        
            {{data.LAUGH.totalCount ? data.LAUGH.totalCount : data.LAUGH}}
        </button><button class="reaction-item btn-link" :disabled="disabled" v-if="data.CONFUSED.totalCount > 0 || data.CONFUSED > 0">
            <span class="emoj mr-1">😕</span>        
            {{data.CONFUSED.totalCount ? data.CONFUSED.totalCount : data.CONFUSED}}
        </button><button class="reaction-item btn-link" :disabled="disabled" v-if="data.HEART.totalCount > 0 || data.HEART > 0">
            <span class="emoj mr-1">❤️</span>        
            {{data.HEART.totalCount ? data.HEART.totalCount : data.HEART}}
        </button><button class="reaction-item btn-link" :disabled="disabled" v-if="data.ROCKET.totalCount > 0 || data.ROCKET > 0">
            <span class="emoj mr-1">🚀</span>        
            {{data.ROCKET.totalCount ? data.ROCKET.totalCount : data.ROCKET}}
        </button><button class="reaction-item btn-link" :disabled="disabled" v-if="data.EYES.totalCount > 0 || data.EYES > 0">
            <span class="emoj mr-1">👀</span>        
            {{data.EYES.totalCount ? data.EYES.totalCount : data.EYES}}
        </button><button class="reaction-item btn-link muted-link" v-if="!disabled">
            <svg class="octicon octicon-plus-small add-reaction-plus-icon" viewBox="0 0 7 16" version="1.1" width="7" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 4H3v3H0v1h3v3h1V8h3V7H4V4z"></path></svg>        
            <svg class="octicon octicon-smiley" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm4.81 12.81a6.72 6.72 0 01-2.17 1.45c-.83.36-1.72.53-2.64.53-.92 0-1.81-.17-2.64-.53-.81-.34-1.55-.83-2.17-1.45a6.773 6.773 0 01-1.45-2.17A6.59 6.59 0 011.21 8c0-.92.17-1.81.53-2.64.34-.81.83-1.55 1.45-2.17.62-.62 1.36-1.11 2.17-1.45A6.59 6.59 0 018 1.21c.92 0 1.81.17 2.64.53.81.34 1.55.83 2.17 1.45.62.62 1.11 1.36 1.45 2.17.36.83.53 1.72.53 2.64 0 .92-.17 1.81-.53 2.64-.34.81-.83 1.55-1.45 2.17zM4 6.8v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2H5.2C4.53 8 4 7.47 4 6.8zm5 0v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2h-.59C9.53 8 9 7.47 9 6.8zm4 3.2c-.72 1.88-2.91 3-5 3s-4.28-1.13-5-3c-.14-.39.23-1 .66-1h8.59c.41 0 .89.61.75 1z"></path></svg>
        </button>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            data: {
                type: Object,
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            },
        },
        components: {
            Container: styled.div``,
        }
    }
</script>

<style scoped lang="scss">

.reaction-item{
    font-size: 12px!important;
    padding-top: 4px!important;
    padding-bottom: 4px!important;
    padding-right: 8px!important;
    padding-left: 8px!important;
    display: block;
    margin-top: 4px!important;
    margin-bottom: 4px!important;
    margin-right: 8px!important;
    border-radius: 3px!important;
    border: 1px solid #e1e4e8!important;
}

</style>