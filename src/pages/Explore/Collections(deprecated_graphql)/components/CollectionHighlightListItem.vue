<template>
    <router-link :to="`/explore/collections/${collection.name}`" class="exploregrid-item d-flex flex-items-center flex-column flex-justify-center p-5">
        <ImgWrapper>
            <img :src="collection.avatar" :alt="`@${collection.displayName}`" width="64" height="64" class="mx-auto rounded-1 mb-3">
        </ImgWrapper>
        <p class="f3 lh-condensed text-center link-gray-dark mb-0 mt-1">
            {{collection.displayName}}
        </p>
        <p class="f5 text-gray text-center mb-0 mt-1">
            {{collection.description}}
        </p>
    </router-link>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ImgWrapper} from '@/components'
    export default {
        props: {
            collection: {
                type: Object,
                required: true
            }
        },
        components: {
            ImgWrapper,
            Container: styled.div``,
         }
    }
</script>

<style scoped>
.exploregrid-item{
    flex: 1;
    position: relative;
    height: 100%;
    font-size: 14px;
    color: #555;
    border: 1px solid rgba(0,0,0,.075);
    border-bottom-color: rgba(0,0,0,.125);
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 5px 10px rgba(0,0,0,.05);
    transition: border-color .1s ease-in-out,box-shadow .1s ease-in-out;
}
</style>