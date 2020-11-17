<template>
    <div class="AvatarStack flex-self-start">
        <div class="AvatarStack-body">
            <router-link v-if="commit.author && commit.author.avatar_url" :to="`/${commit.author.login}`">
                <img height="20" width="20" class="avatar avatar-url" :src="commit.author.avatar_url" :alt="`${commit.author.login}`">
            </router-link>
            <router-link v-if="commit.committer && commit.committer.avatar_url && commit.author && commit.author.avatar_url && (commit.author.avatar_url != commit.committer.avatar_url)" :to="`/${commit.committer.login}`">
                <img height="20" width="20" class="avatar avatar-url" :src="commit.committer.avatar_url" :alt="`${commit.committer.login}`">
            </router-link>
        </div> 
    </div> 
</template>
<script>
import styled from 'vue-styled-components'
import * as api from '@/network/api'
import { authRequiredGet } from '@/network'
export default {
    inject: ['repo','owner'],
    props: {
        url: {
            type: String,
            required: false
        },
        sha: {
            Type: String,
            required: false
        }
    },
    data() {
        return {
            commit: {},
        }
    },
    created() {
        this.network_getData()
    },
    methods: {
        async network_getData() {
            if(!(this.sha || this.url)) return
            try {
                let url = this.url || api.API_COMMIT({
                    repo: this.repo(),
                    owner: this.owner(),
                    sha: this.sha
                })

                let res = await authRequiredGet(url)
                this.commit = res.data
            } catch (e) {
                console.log(e)
            }
        }
    },
    components: {
        Container: styled.div``
    }
}
</script>
<style scoped lang="scss">
@import 'node_modules/@primer/css/avatars/index.scss';
.avatar{
    border-radius: 50%!important;
}
</style>