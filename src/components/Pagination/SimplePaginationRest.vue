<template>
    <Container class="paginate-container">
        <div class="BtnGroup">
            <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.prev || loading" @click="goPrev">Previous</button>
            <button class="btn btn-outline BtnGroup-item" :disabled="!pageInfo.next || loading"  @click="goNext">Next</button>
        </div> 
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_queryParse} from '@/util'
    export default {
        props: {
            loading: {
                type: Boolean,
                required: false
            },
            pageInfo: {
                type: Object,
                required: true
            },
            before: {
                type: Function,
                required: false
            },
            after: {
                type: Function,
                required: false
            }
        },
        methods: {
            goPrev() {
                if(this.before) this.before.call()
                this.$router.push(`${this.$route.path}?${util_queryParse.querify(
                    {
                        ...this.$route.query,
                        page: this.pageInfo.prev.page
                    }
                )}`)
                if(this.after) this.after.call()
            },
            goNext() {
                if(this.before) this.before.call()
                this.$router.push(`${this.$route.path}?${util_queryParse.querify(
                    {
                        ...this.$route.query,
                        page: this.pageInfo.next.page
                    }
                )}`)
                if(this.after) this.after.call()
            },
        },
        components: {
            Container:styled.div``,
            Right: styled.button``,
            Left: styled.button``,
            PageInfo: styled.div``
        }
    }
</script>

<style scoped>

.paginate-container {
    margin-top: 20px;
    margin-bottom: 15px;
    text-align: center;
}

</style>