<template>
    <Container>
        <transition-group name="fade-group" appear>
            <Diff v-for="item in files.slice(0,cursor)" :file="item" :key="item.sha"></Diff>
        </transition-group>
        <SimpleLoadingMore v-if="cursor < files.length" :loading="false" :dataGetter="showMore"></SimpleLoadingMore>
    </Container>
</template>
<script>

import styled from 'vue-styled-components'
import {SimpleLoadingMore} from '@/components'
import {Diff} from '../../components'
import {util_throttle} from '@/util'
export default {
    props: {
        files: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            cursor: 3,
            perPage: 3,
            loading: false
        }
    },
    methods: {
        showMore() {
            util_throttle.throttleByGap(() => {
                if(this.cursor >= this.files.length) return 
                this.cursor += this.perPage
            },1000,'repository_compare_show_more_files_changed')
        }
    },
    components: {
        Diff,
        SimpleLoadingMore,
        Container: styled.div``
    }
}
</script>

<style scoped>
</style>