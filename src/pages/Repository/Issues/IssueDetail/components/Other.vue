<template>
    <Container class="flex py-3">
        <Badge class="badge" :style="badgeStyle">
            <slot name="icon">
                <svg class="octicon" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9 0H1C.27 0 0 .27 0 1v15l5-3.09L10 16V1c0-.73-.27-1-1-1zm-.78 4.25L6.36 5.61l.72 2.16c.06.22-.02.28-.2.17L5 6.6 3.12 7.94c-.19.11-.25.05-.2-.17l.72-2.16-1.86-1.36c-.17-.16-.14-.23.09-.23l2.3-.03.7-2.16h.25l.7 2.16 2.3.03c.23 0 .27.08.09.23h.01z"></path></svg>
            </slot>
        </Badge>
        <Body class="body">
            <WhoDidWhat>
                <router-link class="d-inline-block">
                    <img :src="data.user.avatar_url" :alt="`@${data.user.login}`" class="avatar" height="20" width="20">
                </router-link>
                <router-link class="text-bold link-gray-dark">
                    {{data.user.login}}
                </router-link>
                <slot name="action"></slot>
                <span class="no-wrap">{{dateStampGap > dataStampGapThreshold && 'on'}} {{createdAtFormat}}</span>
            </WhoDidWhat>
            <slot name="additional">
            </slot>
        </Body>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat} from '../../../../../util'
    export default {
        props: {
            data: {
                type: Object,
                required: true
            },
            badgeStyle: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                dataStampGapThreshold: 1000 * 60 * 60 * 24 * 30
            }
        },
        computed: {
            createdAtFormat() {
                return util_dateFormat.getDateDiffOrDateFormatDependOnGap('dd zzz yyyy', new Date(this.data.created_at), this.dataStampGapThreshold)
            },
            dateStampGap() {
                return Date.parse(new Date()) - Date.parse(this.data.created_at)
            }
        },
        components: {
            Container: styled.div``,
            Badge: styled.div``,
            Body: styled.div``,
            WhoDidWhat: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
.badge {
    position: relative;
    z-index: 1;
    display: flex;
    width: 32px;
    height: 32px;
    margin-right: 8px;
    color: #444d56;
    align-items: center;
    background-color: #e1e4e8;
    border: 2px solid #fff;
    border-radius: 50%;
    justify-content: center;
    flex-shrink: 0;
}
.body {
    min-width: 0;
    max-width: 100%;
    margin-top: 4px;
    color: #444d56;
    flex: auto;
}
</style>