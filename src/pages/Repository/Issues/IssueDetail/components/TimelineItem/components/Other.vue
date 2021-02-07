<template>
    <Container class="py-3 position-relative timeline-item">
        <Inner class="d-flex">
            <Badge class="badge" :style="badgeStyle">
                <slot name="icon">
                    <svg class="octicon" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9 0H1C.27 0 0 .27 0 1v15l5-3.09L10 16V1c0-.73-.27-1-1-1zm-.78 4.25L6.36 5.61l.72 2.16c.06.22-.02.28-.2.17L5 6.6 3.12 7.94c-.19.11-.25.05-.2-.17l.72-2.16-1.86-1.36c-.17-.16-.14-.23.09-.23l2.3-.03.7-2.16h.25l.7 2.16 2.3.03c.23 0 .27.08.09.23h.01z"></path></svg>
                </slot>
            </Badge>
            <Body class="body">
                <WhoDidWhat>
                    <router-link v-if="showActor && showActorAvatar" to="/" class="d-inline-block">
                        <ImgWrapper class="avatar avatar-user">
                            <img v-if="actorAvatarUrl" :src="actorAvatarUrl" class="avatar" height="20" width="20">
                        </ImgWrapper>
                    </router-link>
                    <router-link v-if="showActor && data.actor" to="/" class="text-bold link-gray-dark">
                        {{data.actor.login}}
                    </router-link>
                    <router-link v-else-if="showActor && data.author" to="/" class="text-bold link-gray-dark flex-shrink-0">
                        {{data.author.login || data.author.name}}
                    </router-link>
                    <router-link v-else-if="showActor && data.user" to="/" class="text-bold link-gray-dark flex-shrink-0">
                        {{data.user.login || data.user.name}}
                    </router-link>
                    <slot name="action"></slot>
                </WhoDidWhat>
                 <slot name="additional">
                </slot>
            </Body>
        </Inner>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ImgWrapper} from '@/components'
    import {util_dateFormat} from '@/util'
    export default {
        props: {
            data: {
                type: Object,
                required: true
            },
            badgeStyle: {
                type: Object,
                default: () => ({})
            },
            showActor: {
                type: Boolean,
                default: true
            },
            showActorAvatar: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                dataStampGapThreshold: 1000 * 60 * 60 * 24 * 30
            }
        },
        computed: {
            dateStampGap() {
                return Date.parse(new Date()) - Date.parse(this.data.created_at)
            },
            actorAvatarUrl() {
                if(this.data.actor) return this.data.actor.avatar_url || this.data.actor.avatarUrl
                if(this.data.author) return this.data.author.avatar_url
            }
        },
        components: {
            ImgWrapper,
            Container: styled.div``,
            Inner: styled.div``,
            Badge: styled.div``,
            Body: styled.div``,
            WhoDidWhat: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/avatars/index.scss';
img{
    border-radius: 2em!important;
}
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

.timeline-item:before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 16px;
    display: block;
    width: 2px;
    content: "";
    background-color: #e1e4e8;
}
</style>