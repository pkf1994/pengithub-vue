<template>
    <WithTopNoticeWrapper theKey="user">
        <CommonLoadingWrapper :loading="loading || changeUserStatusModalData.loading" :position="loading ? 'center' : 'corner'" class="clearfix p-3">
        <transition name="fade" appear>
            <Main >
                <AnimatedHeightWrapper class="ml-n3 mr-n3 px-3" :appear="false" :style="{overflow: `${showBlockOrReportUserPopover ? 'visible' : 'hidden'}!important`}">
                    <Skeleton v-if="loading && !data.node_id">
                        <div class="d-flex flex-items-center mb-4">
                            <div class="col-2 mr-3">
                                <SkeletonCircle class="width-full" style="padding-bottom:100%"></SkeletonCircle>
                            </div>
                            <div class="col-9 pt-1 pb-1">
                                <SkeletonRectangle :height="24" style="width:60%"></SkeletonRectangle>
                                <SkeletonRectangle :height="20" style="width:40%" class="mt-2"></SkeletonRectangle>
                            </div>
                        </div>

                        <div>
                            <div class="d-flex flex-items-center">
                                <SkeletonCircle :diameter="16" class="mr-2"></SkeletonCircle>
                                <SkeletonRectangle :height="14" style="width: 40%"></SkeletonRectangle>
                            </div>
                            <div class="d-flex flex-items-center mt-3">
                                <SkeletonCircle :diameter="16" class="mr-2"></SkeletonCircle>
                                <SkeletonRectangle :height="14" style="width: 45%"></SkeletonRectangle>
                            </div>
                            <div class="d-flex flex-items-center mt-3">
                                <SkeletonCircle :diameter="16" class="mr-2"></SkeletonCircle>
                                <SkeletonRectangle :height="14" style="width: 60%"></SkeletonRectangle>
                            </div>
                        </div> 
                    </Skeleton>
                    <div v-else :class="{loading:loading}">
                        <UserBasicInfo>
                            <AvatarAndName class="d-flex flex-items-center mb-4">
                                <Avatar class="col-2 mr-3 flex-self-stretch">
                                    <router-link :to="`/${data.login}`" class="d-block position-relative height-full">
                                        <ImgWrapper v-if="showAvatar" class="avatar-user avatar border width-full">
                                            <img :src="data.avatar_url" class="avatar-user avatar width-full" style="height: auto"/>
                                        </ImgWrapper>
                                    </router-link>
                                </Avatar>

                                <Names class="col-9 pt-1 pb-1">
                                    <h1 class="pl-2" style="line-height:1">
                                        <span class="name d-block">{{data.name}}</span>
                                        <span class="login d-block">{{data.login}}</span>
                                    </h1>  
                                </Names>
                            </AvatarAndName>

                            <UserStatus v-if="graphqlData.status  && viewer.login != login" class="mb-3 user-status-container">
                                <div class="d-flex py-2 width-full flex-items-center" :class="{busy:graphqlData.status.indicatesLimitedAvailability}">
                                    <UserStatusEmoji class="mr-1 ml-1 user-status-emoji" v-html="graphqlData.status.emojiHTML || '💭'">
                                    </UserStatusEmoji>
                                    <UserStatusMessage class="f6 mt-1 text-gray-dark ws-normal lh-condensed">
                                        <div>{{graphqlData.status.message}}</div>
                                    </UserStatusMessage>
                                </div>
                            </UserStatus>

                            <UserStatus v-else-if="accessToken && viewer.login == login" @click="() => showModal('setStatusModal')"  class="mb-3 user-status-container">
                                <div v-if="graphqlData.status" class="d-flex py-2 width-full flex-items-center border rounded-1 pl-2" :class="{busy:graphqlData.status.indicatesLimitedAvailability}">
                                    <UserStatusEmoji class="mr-1 ml-1 user-status-emoji" v-html="graphqlData.status.emojiHTML || '💭'">
                                    </UserStatusEmoji>
                                    <UserStatusMessage class="f6 mt-1 text-gray-dark ws-normal lh-condensed">
                                        <div>{{graphqlData.status.message}}</div>
                                    </UserStatusMessage>
                                </div>
                                <div v-else class="d-flex py-2 width-full flex-items-center border rounded-1 pl-2">
                                    <UserStatusEmoji class="mr-1 ml-1 user-status-emoji">
                                        <svg class="octicon octicon-smiley" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 8C1.5 6.27609 2.18482 4.62279 3.40381 3.40381C4.62279 2.18482 6.27609 1.5 8 1.5C9.72391 1.5 11.3772 2.18482 12.5962 3.40381C13.8152 4.62279 14.5 6.27609 14.5 8C14.5 9.72391 13.8152 11.3772 12.5962 12.5962C11.3772 13.8152 9.72391 14.5 8 14.5C6.27609 14.5 4.62279 13.8152 3.40381 12.5962C2.18482 11.3772 1.5 9.72391 1.5 8ZM8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0V0ZM5 8C5.26522 8 5.51957 7.89464 5.70711 7.70711C5.89464 7.51957 6 7.26522 6 7C6 6.73478 5.89464 6.48043 5.70711 6.29289C5.51957 6.10536 5.26522 6 5 6C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8ZM12 7C12 7.26522 11.8946 7.51957 11.7071 7.70711C11.5196 7.89464 11.2652 8 11 8C10.7348 8 10.4804 7.89464 10.2929 7.70711C10.1054 7.51957 10 7.26522 10 7C10 6.73478 10.1054 6.48043 10.2929 6.29289C10.4804 6.10536 10.7348 6 11 6C11.2652 6 11.5196 6.10536 11.7071 6.29289C11.8946 6.48043 12 6.73478 12 7ZM5.32 9.636C5.48134 9.52303 5.68064 9.47806 5.87486 9.51081C6.06908 9.54355 6.24262 9.65138 6.358 9.811L6.365 9.82C6.46785 9.93795 6.58549 10.0421 6.715 10.13C6.979 10.308 7.398 10.5 8 10.5C8.602 10.5 9.02 10.308 9.285 10.129C9.41451 10.0411 9.53215 9.93695 9.635 9.819L9.642 9.811C9.75737 9.64895 9.93239 9.53937 10.1285 9.50637C10.3247 9.47336 10.526 9.51963 10.688 9.635C10.85 9.75037 10.9596 9.92539 10.9926 10.1215C11.0256 10.3177 10.9794 10.519 10.864 10.681L10.25 10.25C10.864 10.68 10.864 10.681 10.863 10.681V10.682L10.862 10.684L10.86 10.687L10.855 10.694L10.841 10.713C10.7848 10.7883 10.7233 10.8594 10.657 10.926C10.4963 11.0924 10.3187 11.2415 10.127 11.371C9.49722 11.7894 8.75607 12.0086 8 12C7.054 12 6.348 11.692 5.874 11.37C5.62319 11.2003 5.39676 10.9971 5.201 10.766C5.1867 10.7486 5.1727 10.7309 5.159 10.713L5.145 10.693L5.14 10.687L5.138 10.684V10.682H5.137L5.75 10.25L5.136 10.68C5.02196 10.5172 4.97718 10.3159 5.01149 10.1201C5.04581 9.92439 5.1564 9.75027 5.319 9.636H5.32Z"></path></svg>
                                    </UserStatusEmoji>
                                    <UserStatusMessage class="f6 mt-1 text-gray-dark ws-normal lh-condensed">
                                        <div>Set status</div>
                                    </UserStatusMessage>
                                </div>
                            </UserStatus>
                        </UserBasicInfo>

                        <UserProfile>
                            <button v-if="login == viewer.login && !showUserProfileEditor" class="btn btn-block mb-3" @click="() => triggerShowUserProfileEditor(true)">
                                Edit profile
                            </button> 

                            <UserProfileEditor v-if="login == viewer.login && data.login" 
                            v-show="showUserProfileEditor" 
                            :twitterUserNameHolder="graphqlData" 
                            @cancel="() => triggerShowUserProfileEditor(false)"
                            @user-update-success="userUpdatedHandler"
                            ></UserProfileEditor>

                            <Bio v-if="data.bio" class="pb-2 user-profile-bio">
                                {{data.bio}}
                            </Bio>
                            <div class="mb-3">
                                <UserProfileItem v-if="graphqlData.isDeveloperProgramMember" class="vcard-detail pt-1 css-truncate css-truncate-target">
                                    <HyperlinkWrapper>
                                        <a class="link-gray-dark" href="https://developer.github.com/">
                                            <svg class="octicon octicon-cpu mr-2 text-gray-light" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.5 0.75C6.5 0.335786 6.16421 0 5.75 0C5.33579 0 5 0.335786 5 0.75V2H3.75C2.7835 2 2 2.7835 2 3.75V5H0.75C0.335786 5 0 5.33579 0 5.75C0 6.16421 0.335786 6.5 0.75 6.5H2V9.5H0.75C0.335786 9.5 0 9.83579 0 10.25C0 10.6642 0.335786 11 0.75 11H2V12.25C2 13.2165 2.7835 14 3.75 14H5V15.25C5 15.6642 5.33579 16 5.75 16C6.16421 16 6.5 15.6642 6.5 15.25V14H9.5V15.25C9.5 15.6642 9.83579 16 10.25 16C10.6642 16 11 15.6642 11 15.25V14H12.25C13.2165 14 14 13.2165 14 12.25V11H15.25C15.6642 11 16 10.6642 16 10.25C16 9.83579 15.6642 9.5 15.25 9.5H14V6.5H15.25C15.6642 6.5 16 6.16421 16 5.75C16 5.33579 15.6642 5 15.25 5H14V3.75C14 2.7835 13.2165 2 12.25 2H11V0.75C11 0.335786 10.6642 0 10.25 0C9.83579 0 9.5 0.335786 9.5 0.75V2H6.5V0.75ZM12.25 12.5H10.25H5.75H3.75C3.61193 12.5 3.5 12.3881 3.5 12.25V10.25V5.75V3.75C3.5 3.61193 3.61193 3.5 3.75 3.5H5.75H10.25H12.25C12.3881 3.5 12.5 3.61193 12.5 3.75V5.75V10.25V12.25C12.5 12.3881 12.3881 12.5 12.25 12.5ZM5.75 5C5.33579 5 5 5.33579 5 5.75V10.25C5 10.6642 5.33579 11 5.75 11H10.25C10.6642 11 11 10.6642 11 10.25V5.75C11 5.33579 10.6642 5 10.25 5H5.75ZM6.5 9.5V6.5H9.5V9.5H6.5Z"></path></svg>
                                            Developer Program Member
                                        </a>
                                    </HyperlinkWrapper>
                                </UserProfileItem> 

                                <UserProfileItem v-if="graphqlData.isCampusExpert" class="vcard-detail pt-1 css-truncate css-truncate-target">
                                    <HyperlinkWrapper>
                                        <a  class="link-gray-dark" href="https://education.github.com/experts">
                                            <svg class="octicon octicon-mortar-board mr-2 text-gray-light" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.69321 1.06562C7.88838 0.978127 8.11162 0.978127 8.30679 1.06562L15.5568 4.31562C15.8265 4.4365 16 4.70448 16 5C16 5.29552 15.8265 5.5635 15.5568 5.68438L13 6.83053V9.625C13 10.6489 12.1894 11.374 11.3406 11.7984C10.4469 12.2453 9.26479 12.5 8 12.5C7.72205 12.5 7.44922 12.4877 7.1835 12.4641C6.77091 12.4273 6.46623 12.0631 6.50295 11.6505C6.53969 11.2379 6.90392 10.9332 7.31651 10.97C7.53769 10.9897 7.76613 11 8 11C9.08242 11 10.0253 10.779 10.6698 10.4568C11.3592 10.1121 11.5 9.77468 11.5 9.625V7.50294L8.30679 8.93438C8.11162 9.02187 7.88838 9.02187 7.69321 8.93438L4 7.27881V8.94167C4.29604 9.04701 4.57477 9.21725 4.81159 9.45407C5.24974 9.89223 5.5 10.5128 5.5 11.25V14.25C5.5 14.449 5.42098 14.6397 5.28032 14.7804C5.13966 14.921 4.94889 15.0001 4.74997 15L1.74997 14.9999C1.33577 14.9999 1 14.6641 1 14.2499V11.2499C1 10.5128 1.25027 9.89215 1.68843 9.45401C1.92524 9.2172 2.20396 9.04698 2.5 8.94165V6.60639L0.443208 5.68438C0.173541 5.5635 0 5.29552 0 5C0 4.70448 0.173541 4.4365 0.443208 4.31562L7.69321 1.06562ZM2.58349 5L8 7.42809L13.4165 5L8 2.57191L2.58349 5ZM2.5 11.2499C2.5 10.8621 2.62473 10.639 2.74907 10.5147C2.88047 10.3833 3.06051 10.3125 3.24999 10.3125C3.43947 10.3125 3.61951 10.3833 3.75091 10.5147C3.87526 10.6391 4 10.8622 4 11.25V13.5L2.5 13.5V11.2499Z"></path></svg>
                                            GitHub Campus Expert
                                        </a>
                                    </HyperlinkWrapper>
                                </UserProfileItem> 

                                <!-- <UserProfileItem v-if="data.company" class="vcard-detail pt-1 css-truncate css-truncate-target">
                                    <svg class="octicon octicon-organization" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M16 12.999c0 .439-.45 1-1 1H7.995c-.539 0-.994-.447-.995-.999H1c-.54 0-1-.561-1-1 0-2.634 3-4 3-4s.229-.409 0-1c-.841-.621-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.442.58 2.5 3c.058 2.41-.159 2.379-1 3-.229.59 0 1 0 1s1.549.711 2.42 2.088C9.196 9.369 10 8.999 10 8.999s.229-.409 0-1c-.841-.62-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.437.581 2.495 3c.059 2.41-.158 2.38-1 3-.229.59 0 1 0 1s3.005 1.366 3.005 4z"></path></svg>
                                    <span>
                                        {{data.company}}
                                    </span>
                                </UserProfileItem>    -->

                                <UserProfileItem v-if="data.location" class="vcard-detail pt-1 css-truncate css-truncate-target">
                                    <svg class="octicon octicon-location" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 0C2.69 0 0 2.5 0 5.5 0 10.02 6 16 6 16s6-5.98 6-10.5C12 2.5 9.31 0 6 0zm0 14.55C4.14 12.52 1 8.44 1 5.5 1 3.02 3.25 1 6 1c1.34 0 2.61.48 3.56 1.36.92.86 1.44 1.97 1.44 3.14 0 2.94-3.14 7.02-5 9.05zM8 5.5c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>
                                    <span>
                                        {{data.location}}
                                    </span>
                                </UserProfileItem>   

                                <UserProfileItem v-if="data.email" class="vcard-detail pt-1 css-truncate css-truncate-target">
                                    <svg class="octicon octicon-mail" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 4v8c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H1c-.55 0-1 .45-1 1zm13 0L7 9 1 4h12zM1 5.5l4 3-4 3v-6zM2 12l3.5-3L7 10.5 8.5 9l3.5 3H2zm11-.5l-4-3 4-3v6z"></path></svg>
                                    <a class="link-gray-dark" :href="data.email">
                                        {{data.email}}
                                    </a>
                                </UserProfileItem>    

                                <UserProfileItem v-if="data.blog" class="vcard-detail pt-1 css-truncate css-truncate-target">
                                    <svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg>
                                    <a  class="link-gray-dark" :href="`mailto:${data.blog}`">
                                        {{data.blog}}
                                    </a>
                                </UserProfileItem>   

                                <UserProfileItem v-if="data.followers || data.followings" class="vcard-detail pt-1 css-truncate css-truncate-target">
                                    <router-link class="link-gray" :to="`/${login}/followers`" v-if="data.followers !== undefined">
                                        <svg height="16" class="octicon octicon-people text-gray-light" text="gray-light" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"></path></svg>
                                        <strong>{{data.followers | thousands2K2M}}</strong>
                                        {{data.followers > 1 ? 'followers' : 'follower'}}
                                    </router-link>
                                    <span v-if="data.followers && data.following">·</span>
                                    <router-link class="link-gray" :to="`/${login}/following`" v-if="data.following !== undefined">
                                        <strong>{{data.following | thousands2K2M}}</strong>
                                        following
                                    </router-link>
                                    <span v-if="starredReposCount.data > 0">·</span>
                                    <router-link class="link-gray" :to="`/${login}/stars`" v-if="starredReposCount.data > 0">
                                        <svg height="16" style="float:none" class="octicon octicon-star text-gray-light ml-0" text="gray-light" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
                                        <strong>{{starredReposCount.data | thousands}}</strong>
                                    </router-link>
                                </UserProfileItem>  
                            </div>
                        </UserProfile>

                        <Actions v-if="blockThisUserOrNot.data !== undefined && graphqlData.viewerIsFollowing !== undefined && !loading" class="d-flex position-relative">
                            <transition-group name="fade-group" appear tag="div" class="flex-grow-1">
                                <FollowBtn key="0" 
                                        :userLogin="login"
                                        v-if="blockThisUserOrNot.data === false && graphqlData.viewerCanFollow" 
                                        class="btn btn-block">
                                </FollowBtn>
                                <div key="1" v-if="blockThisUserOrNot.data" class="border rounded-1 text-red px-3 py-2 text-center">
                                    <svg class="octicon octicon-circle-slash" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 0110.535-5.096l-9.131 9.131A6.472 6.472 0 011.5 8zm2.465 5.096a6.5 6.5 0 009.131-9.131l-9.131 9.131zM8 0a8 8 0 100 16A8 8 0 008 0z"></path></svg>
                                    You have blocked this user
                                </div>
                            </transition-group>
                        
                            <BlockOrReport class="ml-2 d-flex flex-items-center">
                                <span class="px-2 link-gray" @click.stop="() => showModal('blockOrReportUserPopover')">
                                    <svg height="16" class="octicon octicon-kebab-horizontal" aria-label="More options" viewBox="0 0 16 16" version="1.1" width="16" role="img"><path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
                                </span>
                            </BlockOrReport>

                            <Popover ref="blockOrReportUserPopover" 
                                    :popoverStyle="{right: '0',top: '100%',zIndex:'10'}"
                                    @show="() => {showBlockOrReportUserPopover = true}"  
                                    @close="() => {showBlockOrReportUserPopover = false}">
                                <div class="dropdown-item text-small p-3 border-bottom" @click="() => showModal('blockUserModal')">
                                    {{blockThisUserOrNot.data ? 'Unblock' : 'Block'}} this user
                                </div>
                                <!-- <div class="dropdown-item text-small p-3" @click="() => showModal('reportUserModal')">
                                    Report this user
                                </div> -->
                            </Popover>
                        </Actions>
                    </div>
                </AnimatedHeightWrapper>
                
                
                

                <ComplexTopTab :tabs="tabs" @currLabel="tabsLabelChange" class="ml-n3 mr-n3 border-bottom user-tab bg-white" :tabStyle="{marginRight: `0px!important`}"></ComplexTopTab>

                <keep-alive>
                    <router-view style="min-height: 100vh"></router-view>
                </keep-alive>
            </Main>
        </transition>

            <Modal ref="setStatusModal" :title="changeUserStatusModalData.loading ? 'Changing...' : 'Edit status'" :modalStyle="changeUserStatusModalData.modalStyle" @hide="modalTranslateDown">
                <div class="bg-white">
                    <StatusInput class="px-3 py-2 text-gray-dark position-relative">
                        <div class="mt-2">
                            <div class="d-flex ">
                                <button class="btn-outline btn select-emoji-btn" @click="() => showModal('emojiPicker')" :disabled="changeUserStatusModalData.loading">
                                    <span v-if="changeUserStatusModalData.emoji">{{changeUserStatusModalData.emoji}}</span>
                                    <svg v-else class="octicon octicon-smiley" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 8C1.5 6.27609 2.18482 4.62279 3.40381 3.40381C4.62279 2.18482 6.27609 1.5 8 1.5C9.72391 1.5 11.3772 2.18482 12.5962 3.40381C13.8152 4.62279 14.5 6.27609 14.5 8C14.5 9.72391 13.8152 11.3772 12.5962 12.5962C11.3772 13.8152 9.72391 14.5 8 14.5C6.27609 14.5 4.62279 13.8152 3.40381 12.5962C2.18482 11.3772 1.5 9.72391 1.5 8ZM8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0V0ZM5 8C5.26522 8 5.51957 7.89464 5.70711 7.70711C5.89464 7.51957 6 7.26522 6 7C6 6.73478 5.89464 6.48043 5.70711 6.29289C5.51957 6.10536 5.26522 6 5 6C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8ZM12 7C12 7.26522 11.8946 7.51957 11.7071 7.70711C11.5196 7.89464 11.2652 8 11 8C10.7348 8 10.4804 7.89464 10.2929 7.70711C10.1054 7.51957 10 7.26522 10 7C10 6.73478 10.1054 6.48043 10.2929 6.29289C10.4804 6.10536 10.7348 6 11 6C11.2652 6 11.5196 6.10536 11.7071 6.29289C11.8946 6.48043 12 6.73478 12 7ZM5.32 9.636C5.48134 9.52303 5.68064 9.47806 5.87486 9.51081C6.06908 9.54355 6.24262 9.65138 6.358 9.811L6.365 9.82C6.46785 9.93795 6.58549 10.0421 6.715 10.13C6.979 10.308 7.398 10.5 8 10.5C8.602 10.5 9.02 10.308 9.285 10.129C9.41451 10.0411 9.53215 9.93695 9.635 9.819L9.642 9.811C9.75737 9.64895 9.93239 9.53937 10.1285 9.50637C10.3247 9.47336 10.526 9.51963 10.688 9.635C10.85 9.75037 10.9596 9.92539 10.9926 10.1215C11.0256 10.3177 10.9794 10.519 10.864 10.681L10.25 10.25C10.864 10.68 10.864 10.681 10.863 10.681V10.682L10.862 10.684L10.86 10.687L10.855 10.694L10.841 10.713C10.7848 10.7883 10.7233 10.8594 10.657 10.926C10.4963 11.0924 10.3187 11.2415 10.127 11.371C9.49722 11.7894 8.75607 12.0086 8 12C7.054 12 6.348 11.692 5.874 11.37C5.62319 11.2003 5.39676 10.9971 5.201 10.766C5.1867 10.7486 5.1727 10.7309 5.159 10.713L5.145 10.693L5.14 10.687L5.138 10.684V10.682H5.137L5.75 10.25L5.136 10.68C5.02196 10.5172 4.97718 10.3159 5.01149 10.1201C5.04581 9.92439 5.1564 9.75027 5.319 9.636H5.32Z"></path></svg>
                                    
                                </button>
                                <input @focus="statusInputFocusHandler" v-model="changeUserStatusModalData.message" class="width-full form-control status-input" type="text" placeholder="What's happening?">
                            </div>
                        </div>
                        <Popover ref="emojiPicker" :smooth="true" :popoverStyle="{left: '16px',right: '16px'}">
                            <nav class="px-1 pt-1 UnderlineNav border-bottom bg-gray">
                                <div class="UnderlineNav-body d-flex">
                                    <button @click="() => appointCurrentEmojiCategory(item)" v-for="item in changeUserStatusModalData.availableEmoji.nav" :key="item" class="emoji UnderlineNav-item btn-link v-align-middle p-1" :class="{'emoji-category-active':changeUserStatusModalData.availableEmoji.currentCategory == item}">{{item}}</button>  
                                </div>
                            </nav>
                            <div class="pt-2 d-flex px-1 pb-1 flex-wrap flex-justify-around" style="height: 136px;overflow-y:auto" >
                                <button @click="() => setStatusData({emoji:item})" v-for="item in changeUserStatusModalData.availableEmoji[changeUserStatusModalData.availableEmoji.currentCategory]" :key="item" class="emoji d-flex flex-justify-end p-1 border-0 btn-outline rounded-1">{{item}}</button>
                            </div>
                        </Popover>
                    </StatusInput>

                    <AnimatedHeightWrapper :stretch="changeUserStatusModalData.showSuggestions && !changeUserStatusModalData.loading" >
                        <StatusSuggestions class="px-3 pt-3">
                            <h4 class="f6 text-normal mb-3">Suggestions:</h4>
                            <div class="mx-3 mt-2 clearfix">
                                <div class="float-left col-6">
                                    <button @click="() => setStatusData({emoji:'🌴',message:'On vacation'})" type="button" class="d-flex flex-items-baseline flex-items-stretch lh-condensed f6 btn-link link-gray no-underline  mb-1">
                                        <div class="emoji-status-width mr-2 v-align-middle">
                                            <span class="emoji">🌴</span>    
                                        </div>
                                        <div class="d-flex flex-items-center no-underline ws-normal text-left" style="border-left: 1px solid transparent">
                                        On vacation
                                        </div>
                                    </button>
                                    <button @click="() => setStatusData({emoji:'🤒',message:'Out sick'})" type="button" class="d-flex flex-items-baseline flex-items-stretch lh-condensed f6 btn-link link-gray no-underline  mb-1">
                                        <div class="emoji-status-width mr-2 v-align-middle">
                                            <span class="emoji">🤒</span>
                                        </div>
                                        <div class="d-flex flex-items-center no-underline ws-normal text-left" style="border-left: 1px solid transparent">
                                        Out sick
                                        </div>
                                    </button>
                                </div>
                                <div class="float-left col-6">
                                    <button @click="() => setStatusData({emoji:'🏠',message:'Working from home'})" type="button" class="d-flex flex-items-baseline flex-items-stretch lh-condensed f6 btn-link link-gray no-underline  mb-1">
                                        <div class="emoji-status-width mr-2 v-align-middle">
                                        <span class="emoji">🏠</span>
                                        </div>
                                        <div class="d-flex flex-items-center no-underline ws-normal text-left" style="border-left: 1px solid transparent">
                                        Working from home
                                        </div>
                                    </button>
                                    <button @click="() => setStatusData({emoji:'🎯',message:'Focusing'})" type="button" class="d-flex flex-items-baseline flex-items-stretch lh-condensed f6 btn-link link-gray no-underline  mb-1">
                                        <div class="emoji-status-width mr-2 v-align-middle">
                                        <span class="emoji">🎯</span>
                                        </div>
                                        <div class="d-flex flex-items-center no-underline ws-normal text-left" style="border-left: 1px solid transparent">
                                        Focusing
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </StatusSuggestions>
                    </AnimatedHeightWrapper>
                
                    <StatusBusyCheckBox class="p-3 border-bottom">
                        <input :disabled="changeUserStatusModalData.loading" class="float-left mt-1" type="checkbox" id="busy-checkbox" v-model="changeUserStatusModalData.busy">
                        <div class="pl-4">
                            <label for="busy-checkbox" class="d-block f5 text-gray-dark mb-1">Busy</label>
                            <p class="note">
                            When others mention you, assign you, or request your review,
                            GitHub will let them know that you have limited availability.
                            </p>
                        </div>
                    </StatusBusyCheckBox>

                    <StatusExpiresAt class="p-3 position-relative">
                        Clear status&nbsp;
                        <button :disabled="changeUserStatusModalData.loading" class="btn-link link-gray-dark border rounded-1 px-2 py-1" @click="() => showModal('expiresAtSelector')">
                            <span class="f5">{{changeUserStatusModalData.expiresAt || 'Never'}}</span>
                            <span class="dropdown-caret"></span>
                        </button>

                        <Popover ref="expiresAtSelector" :smooth="true" :popoverStyle="{left: '16px',right: '16px'}" @show="modalTranslateUp" @hide="modalTranslateDown"> 
                            <div style="max-height:14.5em;overflow-y:auto">
                                <button @click="() => {setStatusData({expiresAt:'Never'});closeModal('expiresAtSelector')}" class="px-3 py-2 dropdown-item ws-normal text-left border-bottom">
                                    <span class="d-inline-block text-bold mb-1 ">Never</span>
                                    <div class="f6 lh-condensed">Keep this status until you clear your status or edit your status.</div>
                                </button>
                                <li v-for="item in changeUserStatusModalData.availableStatusExpire" :key="item">
                                    <button class="btn-link dropdown-item ws-normal f6 px-3 py-2" @click="() => {setStatusData({expiresAt:item});closeModal('expiresAtSelector')}">
                                        {{item}}
                                    </button>
                                </li>
                            </div>
                        </Popover>
                    </StatusExpiresAt>

                    <div class="d-flex flex-items-center flex-justify-between p-3 border-top">
                        <button type="submit" @click="network_changeUserStatus" :disabled="(!changeUserStatusModalData.emoji && !changeUserStatusModalData.message) || changeUserStatusModalData.loading" class="width-full btn btn-primary mr-2 js-user-status-submit">
                            Set status
                        </button>
                        <button type="button" @click="clearUserStatus" :disabled="!graphqlData.status || changeUserStatusModalData.loading" class="width-full js-clear-user-status-button btn ml-2 ">
                            Clear status
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal style="z-index:10" ref="blockUserModal" :title="`${blockThisUserOrNot.data ? 'Unblock' : 'Block'} ${login}`">
                <div class="p-3 bg-white">
                    <div>
                        <p v-if="blockThisUserOrNot.data">Show content and activity from this user.</p>
                        <p v-else>Hide content and notifications from this user.</p>
                        <p class="text-small text-gray">
                            Learn more about 
                            <HyperlinkWrapper>
                                <a href="https://help.github.com/en/articles/blocking-a-user-from-your-personal-account">blocking users</a>
                            </HyperlinkWrapper>
                        </p>
                        <button :disabled="blockThisUserOrNot.loading || (blockThisUserOrNot.data === undefined)" 
                                @click="network_blockUserOrNot" 
                                class="btn btn-block" 
                                :class="{'btn-danger' : !blockThisUserOrNot.data}">
                                {{blockThisUserOrNot.data ? 'Unblock' : 'Block'}} user
                        </button>
                    </div>
                </div>
            </Modal>

           <!--  <Modal style="z-index:10" ref="reportUserModal" :title="`Report ${login}`">
                <div class="p-3 bg-white">
                    <div>
                        <p>Contact Support about this user’s behavior.</p>
                        <p class="text-small text-gray">
                            Learn more about 
                            <HyperlinkWrapper>
                                <a href="https://help.github.com/en/articles/reporting-abuse-or-spam">reporting abuse</a>
                            </HyperlinkWrapper>
                        </p>
                        <button type="submit" class="btn btn-block btn-danger" >Report abuse</button>
                    </div>
                </div>
            </Modal> -->
        </CommonLoadingWrapper>
    </WithTopNoticeWrapper>
</template>

<script>
    import styled from 'vue-styled-components'
    import {CommonLoadingWrapper,ComplexTopTab,ImgWrapper,HyperlinkWrapper,Modal,AnimatedHeightWrapper,Popover,WithTopNoticeWrapper,Img,SkeletonCircle,SkeletonRectangle,FollowBtn} from '@/components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {authRequiredGitHubGraphqlApiQuery,authRequiredGet,authRequiredAjax,commonGet} from '@/network'
    import {UserProfileEditor} from './components'
    import * as graphql from './graphql'
    import * as api from '@/network/api'
    import emojiHTML from './emojiHTML'
    let parse = require("parse-link-header")
    export default {
        name: 'user_page',
        mixins: [RouteUpdateAwareMixin],
        provide() {
            return {    
                userBasicInfoProvided: () => ({data: this.data,loading: this.loading})
            }
        },
        data() {
            return {
                data: {},
                loading: false,
                viewerIsFollowing: {
                    data: undefined,
                    loading: false
                },
                starredReposCount: {
                    data: 0,
                    loading: false
                },
                blockThisUserOrNot: {
                    data: undefined,
                    loading: false
                },
                changeUserStatusModalData: {
                    busy: false,
                    message: '',
                    emoji: undefined,
                    showSuggestions: false,
                    expiresAt: undefined,
                    loading: false,

                    availableEmoji: {
                        currentCategory: '😀',
                        nav: ['😀','👋','🐢','🍊','🚙','⚾','📺','💜','🚩'],
                        '😀': ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","☺️","😚","😙","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","☹️","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖","😺","😸","😹","😻","😼","😽","🙀","😿","😾","🙈","🙉","🙊","💋","💌","💘","💝","💖","💗","💓","💞","💕","💟","❣️","💔","❤️","🧡","💛","💚","💙","💜","🤎","🖤","🤍","💯","💢","💥","💫","💦","💨","🕳️","💣","💬","👁️‍🗨️","🗨️","🗯️","💭","💤"],
                        '👋': ["👋","🤚","🖐️","✋","🖖","👌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🧠","🦷","🦴","👀","👁️","👅","👄","👶","🧒","👦","👧","🧑","👱","👨","🧔","👨‍🦰","👨‍🦱","👨‍🦳","👨‍🦲","👩","👩‍🦰","🧑‍🦰","👩‍🦱","🧑‍🦱","👩‍🦳","🧑‍🦳","👩‍🦲","🧑‍🦲","👱‍♀️","👱‍♂️","🧓","👴","👵","🙍","🙍‍♂️","🙍‍♀️","🙎","🙎‍♂️","🙎‍♀️","🙅","🙅‍♂️","🙅‍♀️","🙆","🙆‍♂️","🙆‍♀️","💁","💁‍♂️","💁‍♀️","🙋","🙋‍♂️","🙋‍♀️","🧏","🧏‍♂️","🧏‍♀️","🙇","🙇‍♂️","🙇‍♀️","🤦","🤦‍♂️","🤦‍♀️","🤷","🤷‍♂️","🤷‍♀️","🧑‍⚕️","👨‍⚕️","👩‍⚕️","🧑‍🎓","👨‍🎓","👩‍🎓","🧑‍🏫","👨‍🏫","👩‍🏫","🧑‍⚖️","👨‍⚖️","👩‍⚖️","🧑‍🌾","👨‍🌾","👩‍🌾","🧑‍🍳","👨‍🍳","👩‍🍳","🧑‍🔧","👨‍🔧","👩‍🔧","🧑‍🏭","👨‍🏭","👩‍🏭","🧑‍💼","👨‍💼","👩‍💼","🧑‍🔬","👨‍🔬","👩‍🔬","🧑‍💻","👨‍💻","👩‍💻","🧑‍🎤","👨‍🎤","👩‍🎤","🧑‍🎨","👨‍🎨","👩‍🎨","🧑‍✈️","👨‍✈️","👩‍✈️","🧑‍🚀","👨‍🚀","👩‍🚀","🧑‍🚒","👨‍🚒","👩‍🚒","👮","👮‍♂️","👮‍♀️","🕵️","🕵️‍♂️","🕵️‍♀️","💂","💂‍♂️","💂‍♀️","👷","👷‍♂️","👷‍♀️","🤴","👸","👳","👳‍♂️","👳‍♀️","👲","🧕","🤵","👰","🤰","🤱","👼","🎅","🤶","🦸","🦸‍♂️","🦸‍♀️","🦹","🦹‍♂️","🦹‍♀️","🧙","🧙‍♂️","🧙‍♀️","🧚","🧚‍♂️","🧚‍♀️","🧛","🧛‍♂️","🧛‍♀️","🧜","🧜‍♂️","🧜‍♀️","🧝","🧝‍♂️","🧝‍♀️","🧞","🧞‍♂️","🧞‍♀️","🧟","🧟‍♂️","🧟‍♀️","💆","💆‍♂️","💆‍♀️","💇","💇‍♂️","💇‍♀️","🚶","🚶‍♂️","🚶‍♀️","🧍","🧍‍♂️","🧍‍♀️","🧎","🧎‍♂️","🧎‍♀️","🧑‍🦯","👨‍🦯","👩‍🦯","🧑‍🦼","👨‍🦼","👩‍🦼","🧑‍🦽","👨‍🦽","👩‍🦽","🏃","🏃‍♂️","🏃‍♀️","💃","🕺","🕴️","👯","👯‍♂️","👯‍♀️","🧖","🧖‍♂️","🧖‍♀️","🧗","🧗‍♂️","🧗‍♀️","🤺","🏇","⛷️","🏂","🏌️","🏌️‍♂️","🏌️‍♀️","🏄","🏄‍♂️","🏄‍♀️","🚣","🚣‍♂️","🚣‍♀️","🏊","🏊‍♂️","🏊‍♀️","⛹️","⛹️‍♂️","⛹️‍♀️","🏋️","🏋️‍♂️","🏋️‍♀️","🚴","🚴‍♂️","🚴‍♀️","🚵","🚵‍♂️","🚵‍♀️","🤸","🤸‍♂️","🤸‍♀️","🤼","🤼‍♂️","🤼‍♀️","🤽","🤽‍♂️","🤽‍♀️","🤾","🤾‍♂️","🤾‍♀️","🤹","🤹‍♂️","🤹‍♀️","🧘","🧘‍♂️","🧘‍♀️","🛀","🛌","🧑‍🤝‍🧑","👭","👫","👬","💏","👩‍❤️‍💋‍👨","👨‍❤️‍💋‍👨","👩‍❤️‍💋‍👩","💑","👩‍❤️‍👨","👨‍❤️‍👨","👩‍❤️‍👩","👪","👨‍👩‍👦","👨‍👩‍👧","👨‍👩‍👧‍👦","👨‍👩‍👦‍👦","👨‍👩‍👧‍👧","👨‍👨‍👦","👨‍👨‍👧","👨‍👨‍👧‍👦","👨‍👨‍👦‍👦","👨‍👨‍👧‍👧","👩‍👩‍👦","👩‍👩‍👧","👩‍👩‍👧‍👦","👩‍👩‍👦‍👦","👩‍👩‍👧‍👧","👨‍👦","👨‍👦‍👦","👨‍👧","👨‍👧‍👦","👨‍👧‍👧","👩‍👦","👩‍👦‍👦","👩‍👧","👩‍👧‍👦","👩‍👧‍👧","🗣️","👤","👥","👣"],
                        '🐢': ["🐵","🐒","🦍","🦧","🐶","🐕","🦮","🐕‍🦺","🐩","🐺","🦊","🦝","🐱","🐈","🦁","🐯","🐅","🐆","🐴","🐎","🦄","🦓","🦌","🐮","🐂","🐃","🐄","🐷","🐖","🐗","🐽","🐏","🐑","🐐","🐪","🐫","🦙","🦒","🐘","🦏","🦛","🐭","🐁","🐀","🐹","🐰","🐇","🐿️","🦔","🦇","🐻","🐨","🐼","🦥","🦦","🦨","🦘","🦡","🐾","🦃","🐔","🐓","🐣","🐤","🐥","🐦","🐧","🕊️","🦅","🦆","🦢","🦉","🦩","🦚","🦜","🐊","🐢","🦎","🐍","🐲","🐉","🦕","🦖","🐳","🐋","🐬","🐟","🐠","🐡","🦈","🐙","🐚","🐌","🦋","🐛","🐜","🐝","🐞","🦗","🕷️","🕸️","🦂","🦟","🦠","💐","🌸","💮","🏵️","🌹","🥀","🌺","🌻","🌼","🌷","🌱","🌲","🌳","🌴","🌵","🌾","🌿","☘️","🍀","🍁","🍂","🍃"],
                        '🍊': ["🍇","🍈","🍉","🍊","🍋","🍌","🍍","🥭","🍎","🍏","🍐","🍑","🍒","🍓","🥝","🍅","🥥","🥑","🥔","🥕","🌽","🌶️","🥒","🥬","🥦","🧄","🧅","🍄","🥜","🌰","🍞","🥐","🥖","🥨","🥯","🥞","🧇","🧀","🍖","🍗","🥩","🥓","🍔","🍟","🍕","🌭","🥪","🌮","🌯","🥙","🧆","🥚","🍳","🥘","🍲","🥣","🥗","🍿","🧈","🧂","🥫","🍱","🍘","🍙","🍚","🍛","🍜","🍝","🍠","🍢","🍣","🍤","🍥","🥮","🍡","🥟","🥠","🥡","🦀","🦞","🦐","🦑","🦪","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🍼","🥛","☕","🍵","🍶","🍾","🍷","🍸","🍹","🍺","🍻","🥂","🥃","🥤","🧃","🧉","🧊","🥢","🍽️","🍴","🥄","🔪","🏺"],
                        '🚙': ["🌍","🌎","🌏","🌐","🗺️","🗾","🧭","🏔️","⛰️","🌋","🗻","🏕️","🏖️","🏜️","🏝️","🏞️","🏟️","🏛️","🏗️","🧱","🏘️","🏚️","🏠","🏡","🏢","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","⛪","🕌","🛕","🕍","⛩️","🕋","⛲","⛺","🌁","🌃","🏙️","🌄","🌅","🌆","🌇","🌉","♨️","🎠","🎡","🎢","💈","🎪","🚂","🚃","🚄","🚅","🚆","🚇","🚈","🚉","🚊","🚝","🚞","🚋","🚌","🚍","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚙","🚚","🚛","🚜","🏎️","🏍️","🛵","🦽","🦼","🛺","🚲","🛴","🛹","🚏","🛣️","🛤️","🛢️","⛽","🚨","🚥","🚦","🛑","🚧","⚓","⛵","🛶","🚤","🛳️","⛴️","🛥️","🚢","✈️","🛩️","🛫","🛬","🪂","💺","🚁","🚟","🚠","🚡","🛰️","🚀","🛸","🛎️","🧳","⌛","⏳","⌚","⏰","⏱️","⏲️","🕰️","🕛","🕧","🕐","🕜","🕑","🕝","🕒","🕞","🕓","🕟","🕔","🕠","🕕","🕡","🕖","🕢","🕗","🕣","🕘","🕤","🕙","🕥","🕚","🕦","🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌙","🌚","🌛","🌜","🌡️","☀️","🌝","🌞","🪐","⭐","🌟","🌠","🌌","☁️","⛅","⛈️","🌤️","🌥️","🌦️","🌧️","🌨️","🌩️","🌪️","🌫️","🌬️","🌀","🌈","🌂","☂️","☔","⛱️","⚡","❄️","☃️","⛄","☄️","🔥","💧","🌊"],
                        '⚾': ["🎃","🎄","🎆","🎇","🧨","✨","🎈","🎉","🎊","🎋","🎍","🎎","🎏","🎐","🎑","🧧","🎀","🎁","🎗️","🎟️","🎫","🎖️","🏆","🏅","🥇","🥈","🥉","⚽","⚾","🥎","🏀","🏐","🏈","🏉","🎾","🥏","🎳","🏏","🏑","🏒","🥍","🏓","🏸","🥊","🥋","🥅","⛳","⛸️","🎣","🤿","🎽","🎿","🛷","🥌","🎯","🪀","🪁","🎱","🔮","🧿","🎮","🕹️","🎰","🎲","🧩","🧸","♠️","♥️","♦️","♣️","♟️","🃏","🀄","🎴","🎭","🖼️","🎨","🧵","🧶"],
                        '📺': ["👓","🕶️","🥽","🥼","🦺","👔","👕","👖","🧣","🧤","🧥","🧦","👗","👘","🥻","🩱","🩲","🩳","👙","👚","👛","👜","👝","🛍️","🎒","👞","👟","🥾","🥿","👠","👡","🩰","👢","👑","👒","🎩","🎓","🧢","⛑️","📿","💄","💍","💎","🔇","🔈","🔉","🔊","📢","📣","📯","🔔","🔕","🎼","🎵","🎶","🎙️","🎚️","🎛️","🎤","🎧","📻","🎷","🎸","🎹","🎺","🎻","🪕","🥁","📱","📲","☎️","📞","📟","📠","🔋","🔌","💻","🖥️","🖨️","⌨️","🖱️","🖲️","💽","💾","💿","📀","🧮","🎥","🎞️","📽️","🎬","📺","📷","📸","📹","📼","🔍","🔎","🕯️","💡","🔦","🏮","🪔","📔","📕","📖","📗","📘","📙","📚","📓","📒","📃","📜","📄","📰","🗞️","📑","🔖","🏷️","💰","💴","💵","💶","💷","💸","💳","🧾","💹","💱","💲","✉️","📧","📨","📩","📤","📥","📦","📫","📪","📬","📭","📮","🗳️","✏️","✒️","🖋️","🖊️","🖌️","🖍️","📝","💼","📁","📂","🗂️","📅","📆","🗒️","🗓️","📇","📈","📉","📊","📋","📌","📍","📎","🖇️","📏","📐","✂️","🗃️","🗄️","🗑️","🔒","🔓","🔏","🔐","🔑","🗝️","🔨","🪓","⛏️","⚒️","🛠️","🗡️","⚔️","🔫","🏹","🛡️","🔧","🔩","⚙️","🗜️","⚖️","🦯","🔗","⛓️","🧰","🧲","⚗️","🧪","🧫","🧬","🔬","🔭","📡","💉","🩸","💊","🩹","🩺","🚪","🛏️","🛋️","🪑","🚽","🚿","🛁","🪒","🧴","🧷","🧹","🧺","🧻","🧼","🧽","🧯","🛒","🚬","⚰️","⚱️","🗿"],
                        '💜': ["🏧","🚮","🚰","♿","🚹","🚺","🚻","🚼","🚾","🛂","🛃","🛄","🛅","⚠️","🚸","⛔","🚫","🚳","🚭","🚯","🚱","🚷","📵","🔞","☢️","☣️","⬆️","↗️","➡️","↘️","⬇️","↙️","⬅️","↖️","↕️","↔️","↩️","↪️","⤴️","⤵️","🔃","🔄","🔙","🔚","🔛","🔜","🔝","🛐","⚛️","🕉️","✡️","☸️","☯️","✝️","☦️","☪️","☮️","🕎","🔯","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","⛎","🔀","🔁","🔂","▶️","⏩","⏭️","⏯️","◀️","⏪","⏮️","🔼","⏫","🔽","⏬","⏸️","⏹️","⏺️","⏏️","🎦","🔅","🔆","📶","📳","📴","♀️","♂️","⚕️","♾️","♻️","⚜️","🔱","📛","🔰","⭕","✅","☑️","✔️","✖️","❌","❎","➕","➖","➗","➰","➿","〽️","✳️","✴️","❇️","‼️","⁉️","❓","❔","❕","❗","〰️","©️","®️","™️","#️⃣","*️⃣","0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟","🔠","🔡","🔢","🔣","🔤","🅰️","🆎","🅱️","🆑","🆒","🆓","ℹ️","🆔","Ⓜ️","🆕","🆖","🅾️","🆗","🅿️","🆘","🆙","🆚","🈁","🈂️","🈷️","🈶","🈯","🉐","🈹","🈚","🈲","🉑","🈸","🈴","🈳","㊗️","㊙️","🈺","🈵","🔴","🟠","🟡","🟢","🔵","🟣","🟤","⚫","⚪","🟥","🟧","🟨","🟩","🟦","🟪","🟫","⬛","⬜","◼️","◻️","◾","◽","▪️","▫️","🔶","🔷","🔸","🔹","🔺","🔻","💠","🔘","🔳","🔲"],
                        '🚩': ["🏁","🚩","🎌","🏴","🏳️","🏳️‍🌈","🏴‍☠️","🇦🇨","🇦🇩","🇦🇪","🇦🇫","🇦🇬","🇦🇮","🇦🇱","🇦🇲","🇦🇴","🇦🇶","🇦🇷","🇦🇸","🇦🇹","🇦🇺","🇦🇼","🇦🇽","🇦🇿","🇧🇦","🇧🇧","🇧🇩","🇧🇪","🇧🇫","🇧🇬","🇧🇭","🇧🇮","🇧🇯","🇧🇱","🇧🇲","🇧🇳","🇧🇴","🇧🇶","🇧🇷","🇧🇸","🇧🇹","🇧🇻","🇧🇼","🇧🇾","🇧🇿","🇨🇦","🇨🇨","🇨🇩","🇨🇫","🇨🇬","🇨🇭","🇨🇮","🇨🇰","🇨🇱","🇨🇲","🇨🇳","🇨🇴","🇨🇵","🇨🇷","🇨🇺","🇨🇻","🇨🇼","🇨🇽","🇨🇾","🇨🇿","🇩🇪","🇩🇬","🇩🇯","🇩🇰","🇩🇲","🇩🇴","🇩🇿","🇪🇦","🇪🇨","🇪🇪","🇪🇬","🇪🇭","🇪🇷","🇪🇸","🇪🇹","🇪🇺","🇫🇮","🇫🇯","🇫🇰","🇫🇲","🇫🇴","🇫🇷","🇬🇦","🇬🇧","🇬🇩","🇬🇪","🇬🇫","🇬🇬","🇬🇭","🇬🇮","🇬🇱","🇬🇲","🇬🇳","🇬🇵","🇬🇶","🇬🇷","🇬🇸","🇬🇹","🇬🇺","🇬🇼","🇬🇾","🇭🇰","🇭🇲","🇭🇳","🇭🇷","🇭🇹","🇭🇺","🇮🇨","🇮🇩","🇮🇪","🇮🇱","🇮🇲","🇮🇳","🇮🇴","🇮🇶","🇮🇷","🇮🇸","🇮🇹","🇯🇪","🇯🇲","🇯🇴","🇯🇵","🇰🇪","🇰🇬","🇰🇭","🇰🇮","🇰🇲","🇰🇳","🇰🇵","🇰🇷","🇰🇼","🇰🇾","🇰🇿","🇱🇦","🇱🇧","🇱🇨","🇱🇮","🇱🇰","🇱🇷","🇱🇸","🇱🇹","🇱🇺","🇱🇻","🇱🇾","🇲🇦","🇲🇨","🇲🇩","🇲🇪","🇲🇫","🇲🇬","🇲🇭","🇲🇰","🇲🇱","🇲🇲","🇲🇳","🇲🇴","🇲🇵","🇲🇶","🇲🇷","🇲🇸","🇲🇹","🇲🇺","🇲🇻","🇲🇼","🇲🇽","🇲🇾","🇲🇿","🇳🇦","🇳🇨","🇳🇪","🇳🇫","🇳🇬","🇳🇮","🇳🇱","🇳🇴","🇳🇵","🇳🇷","🇳🇺","🇳🇿","🇴🇲","🇵🇦","🇵🇪","🇵🇫","🇵🇬","🇵🇭","🇵🇰","🇵🇱","🇵🇲","🇵🇳","🇵🇷","🇵🇸","🇵🇹","🇵🇼","🇵🇾","🇶🇦","🇷🇪","🇷🇴","🇷🇸","🇷🇺","🇷🇼","🇸🇦","🇸🇧","🇸🇨","🇸🇩","🇸🇪","🇸🇬","🇸🇭","🇸🇮","🇸🇯","🇸🇰","🇸🇱","🇸🇲","🇸🇳","🇸🇴","🇸🇷","🇸🇸","🇸🇹","🇸🇻","🇸🇽","🇸🇾","🇸🇿","🇹🇦","🇹🇨","🇹🇩","🇹🇫","🇹🇬","🇹🇭","🇹🇯","🇹🇰","🇹🇱","🇹🇲","🇹🇳","🇹🇴","🇹🇷","🇹🇹","🇹🇻","🇹🇼","🇹🇿","🇺🇦","🇺🇬","🇺🇲","🇺🇳","🇺🇸","🇺🇾","🇺🇿","🇻🇦","🇻🇨","🇻🇪","🇻🇬","🇻🇮","🇻🇳","🇻🇺","🇼🇫","🇼🇸","🇽🇰","🇾🇪","🇾🇹","🇿🇦","🇿🇲","🇿🇼","🏴󠁧󠁢󠁥󠁮󠁧󠁿","🏴󠁧󠁢󠁳󠁣󠁴󠁿","🏴󠁧󠁢󠁷󠁬󠁳󠁿"],
                    },

                    availableStatusExpire: [
                        'in 30 minutes',
                        'in 1 hour',
                        'in 4 hours',
                        'today',
                        'this week',
                    ],

                    modalStyle: {
                        transform: 'none'
                    }
                },
                showAvatar: true,
                showBlockOrReportUserPopover: false,
                tabCount: {
                    loading: false,
                    repositories: undefined,
                    followers: undefined,
                    following: undefined,
                    stars: undefined
                },
                scrollToTopAfterUpdated: true,
                showUserProfileEditor: false,
                activedTabs: [0],
            }   
        },
        computed: {
            login() {
                return this.$route.params.login
            },
            nodeId() {
                return this.data.node_id
            },
            tabs() {
                return [
                    {
                        to: `/${this.login}`,
                        label: 'Overview',
                        exact: true
                    },
                    {
                        to: `/${this.login}/repositories`,
                        label: 'Repositories'
                    },
                    {
                        to: `/${this.login}/stars`,
                        label: 'Stars'
                    },
                    {
                        to: `/${this.login}/followers`,
                        label: 'Followers'
                    },
                    {
                        to: `/${this.login}/following`,
                        label: 'Following'
                    },
                ]
            },
        },
        async created() {
            window && window.scrollTo && window.scrollTo(0,0)
            await this.network_getData()
        },
        
        methods: {
            async network_getData() {
                try{
                    await this.network_getBasicData()
                    this.network_getStarredReposCount()
                    this.network_getTabCount()
                    if(this.accessToken) this.network_getUserIsBlockedByViewer()
                }catch(e) {
                    if(e == 'Organization') this.$router.replace(`/orgs/${this.login}`)
                    if(e != 'Organization') throw e
                }
            },
            async network_getBasicData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)

                    let url = api.API_USER(this.login)

                    let res = await authRequiredGet(url,{cancelToken})
                    if(res.data.type == 'Organization') {
                        throw 'Organization'
                    }
                    this.data = res.data 
                    if(res.data.node_id) this.action_getGraphqlData({
                        graphql: graphql.NODES_USER,
                        id: res.data.node_id
                    })
                }catch(e) {
                    if(e == 'Organization') throw e
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },  
            async network_getStarredReposCount() {
                try{
                    this.starredReposCount.loading = true
                    let url = api.API_USER_STARRED_REPOS({
                        login: this.login,
                        params: {
                            ...this.$route.query,
                            per_page: 1
                        }
                    })

                    let res = await authRequiredGet(
                        url,
                        {
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_starred_repositories_count')
                        }
                    )

                    let countHolder = parse(res.headers.link) || {}
                    this.starredReposCount.data = countHolder.last ? countHolder.last.page : res.data.length
                }catch(e) {
                    console.log(e)
                }finally{
                    this.starredReposCount.loading = false
                }
            },
            async network_getTabCount() {
                
            },
            async network_getUserIsBlockedByViewer() {
                if(this.viewer.login == this.login) return 
                try{
                    this.blockThisUserOrNot.loading = true
                    let url = api.API_BLOCK_USER_OR_NOT(this.login)
                    await authRequiredGet(
                        url,
                        {
                            headers: {
                                "Accept": "application/vnd.github.giant-sentry-fist-preview+json"
                            },
                            cancelToken: this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name + ' get_user_is_blocked_by_viewer')
                        }
                    )

                    this.blockThisUserOrNot.data = true
                }catch(e) {
                    console.log(e)
                    if(e.response && e.response.status == 404) {
                        this.blockThisUserOrNot.data = false
                    }
                }finally{
                    this.blockThisUserOrNot.loading = false
                }
            },
            async network_changeUserStatus() {
                try{
                    this.changeUserStatusModalData.loading = true
                    let graphql_changeUserStatus = graphql.GRAPHQL_MUTATION_CHANGE_USER_STATUS

                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql_changeUserStatus,
                        {
                            variables: {
                                message: this.changeUserStatusModalData.message,
                                emoji: this.changeUserStatusModalData.emoji,
                                expiresAt: this.generateExpiresAtISO(),
                                limitedAvailability: this.changeUserStatusModalData.busy
                            }
                        }
                    )

                    try{
                        let status = res.data.data.changeUserStatus.status
                        this.mutation_resolveGraphqlData({
                            data: [Object.assign({},this.graphqlData,{status})]
                        })
                    }catch(e) {
                        this.handleGraphqlError(res)
                    }

                    this.closeModal()
                    
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.changeUserStatusModalData.loading = false
                }
            },
            async network_blockUserOrNot() {
                if(this.blockThisUserOrNot.data === undefined) return
                try{
                    this.blockThisUserOrNot.loading = true
                    await this.github_blockUserOrNot(this.login,this.blockThisUserOrNot.data)
                    this.blockThisUserOrNot.data = !this.blockThisUserOrNot.data
                    this.closeModal()
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.blockThisUserOrNot.loading = false
                }
            },
            async network_changeUserFollowShip() {
                if(this.viewerIsFollowing.data === undefined) return
                try {
                    this.viewerIsFollowing.loading = true
                    await this.github_changeUserFollowShip(this.login,this.viewerIsFollowing.data)
                    this.viewerIsFollowing.data = !this.viewerIsFollowing.data
                } catch (e) {
                    console.log(e)
                }finally{
                    this.viewerIsFollowing.loading = false
                }
            },
            clearUserStatus() {
                this.setStatusData({
                    emoji: undefined,
                    message: undefined,
                    expiresAt: "Never"
                })
                this.network_changeUserStatus()
            },
            generateRouterMeta() {
                return this.$route.params.login
            },
            setStatusData(data) {
                if(this.$refs.emojiPicker && this.$refs.emojiPicker.show) {
                    this.$refs.emojiPicker.show = false
                }
                Object.assign(this.changeUserStatusModalData, data)
            },
            statusInputFocusHandler() {
                if(!this.changeUserStatusModalData.message) {
                    this.changeUserStatusModalData.showSuggestions = true
                }
            },
            appointCurrentEmojiCategory(payload) {
                this.changeUserStatusModalData.availableEmoji.currentCategory = payload
            },
            modalTranslateUp() {
                this.changeUserStatusModalData.modalStyle = {
                    transform: "translateY(-60px)"
                }
            },
            modalTranslateDown() {
                this.changeUserStatusModalData.modalStyle = {
                    transform: "none"
                }
            },
            generateExpiresAtISO() {
                let now = new Date()
                switch(this.changeUserStatusModalData.expiresAt) {
                    case 'Never':
                        return undefined
                    case 'in 30 minutes':
                        return (new Date(now.getTime() + 30 * 60 * 1000)).toISOString()
                    case 'in 1 hour':
                        return (new Date(now.getTime() + 60 * 60 * 1000)).toISOString()
                    case 'in 4 hours':
                        return (new Date(now.getTime() + 4 * 60 * 60 * 1000)).toISOString()
                    case 'today':
                        now.setHours(23)
                        now.setMinutes(59)
                        now.setSeconds(59)
                        return now.toISOString()
                    case 'this week':
                        while(now.getDay() > 0) {
                            now.setDate(now.getDate() + 1)
                        } 
                        now.setHours(23)
                        now.setMinutes(59)
                         now.setSeconds(59)
                        return now.toISOString()
                    default:
                        return 
                }
            },
            triggerShowUserProfileEditor(payload) {
                if(payload === undefined) {
                    this.showUserProfileEditor = !this.showUserProfileEditor
                }else{
                    this.showUserProfileEditor = payload
                }
            },
            userUpdatedHandler(payload) {
                this.showUserProfileEditor = false
                this.data = payload
            },
            tabsLabelChange(tabIndex){
                if(!this.activedTabs.includes(tabIndex)){
                    this.activedTabs.push(tabIndex)
                }
            }
        },
        watch: {
            'changeUserStatusModalData.busy':function(newOne,oldOne) {
                if(oldOne && !newOne) {
                    this.changeUserStatusModalData.showSuggestions = true
                    if(!this.changeUserStatusModalData.emoji && this.changeUserStatusModalData.message == "I may be slow to respond.") {
                        this.setStatusData({
                            message: ''
                        })
                    }
                }
                if(!oldOne && newOne && !this.changeUserStatusModalData.message && !this.emoji) {
                    this.changeUserStatusModalData.message = "I may be slow to respond."
                }
            },
            'changeUserStatusModalData.message':function(newOne,oldOne) {
                if(oldOne && !newOne) {
                    this.changeUserStatusModalData.showSuggestions = true
                }
            },
            /* extraData: {
                deep: true,
                handler: function() {
                    if(this.login != this.viewer.login) return
                    if(!this.extraData.data.status) return
                    if(this.extraData.data.status.emojiHTML) {
                        let emoji = this.extraData.data.status.emojiHTML.replace(/<[^>]*>/g,'')
                        this.changeUserStatusModalData.emoji = emoji
                    } 
                    if(this.extraData.data.status.message) {
                        this.changeUserStatusModalData.message = this.extraData.data.status.message
                    } 
                }
            }, */
            'data.avatar_url': function(newOne,oldOne) {
                if(newOne && oldOne) {
                    this.showAvatar = false
                    this.$nextTick(() => {
                        this.showAvatar = true
                    })
                }
            }
        },
        components: {
            CommonLoadingWrapper,
            ImgWrapper,
            ComplexTopTab,
            HyperlinkWrapper,
            Modal,
            AnimatedHeightWrapper,
            Popover,
            WithTopNoticeWrapper,
            SkeletonCircle,
            Img,
            SkeletonRectangle,
            UserProfileEditor,
            FollowBtn,
            Container: styled.div``,
            Main: styled.div``,
            UserBasicInfo: styled.div``,
            AvatarAndName: styled.div``,
            Avatar: styled.div``,
            Names: styled.div``,
            UserStatus: styled.div``,
            UserStatusEmoji: styled.div``,
            UserStatusMessage: styled.div``,
            SponsorInfo: styled.div``,
            Sponsors: styled.div``,
            Sponsoring: styled.div``,
            UserProfile: styled.div``,
            UserProfileItem: styled.div``,
            Bio: styled.div``,
            Actions: styled.div``,
            BlockOrReport: styled.div``,
            StatusInput: styled.div``,
            StatusSuggestions: styled.div``,
            StatusBusyCheckBox: styled.div``,
            StatusExpiresAt: styled.div``,
            Skeleton: styled.div``,
        }   
    }
</script>

<style lang="scss">
.user-status-emoji{
    g-emoji{
        display: block;
    }
    div{
        display: flex;
        flex-direction: column,

    }
}
</style>

<style scoped lang="scss">
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/navigation/index.scss';
@import 'node_modules/@primer/css/dropdown/index.scss';
.loading{
    transition: all .4s ease;
    opacity: .3;
}

.name{
    font-size: 26px;
    line-height: 30px;
}
.login{
    font-size: 20px;
    font-style: normal;
    font-weight: 300;
    line-height: 24px;
    color: #666;
}
.user-status-container{
    word-break: break-word;
    word-wrap: break-word;
    white-space: normal;
}
.busy{
    background-color: #fffbdd;
    border: 1px solid #ffdf5d;
}
.vcard-detail{
    display: block!important;
    width: 100%;
    padding-left: 22px;
    max-width: 100%!important;
    svg {
        color: #6a737d;
        float: left;
        width: 16px;
        margin-top: 3px;
        margin-left: -22px;
    }
}
.user-mention {
    font-weight: 600;
    color: #24292e;
    white-space: nowrap;
}

.user-tab{
    position: sticky;
    top:0;
    z-index: 9;
}
.select-emoji-btn{
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.status-input{
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    z-index: 2;
}
.emoji{
    font-family: Apple Color Emoji,Segoe UI,Segoe UI Emoji,Segoe UI Symbol;
    font-size: 1.2em;
    font-style: normal!important;
    font-weight: 400;
    line-height: 20px;
    vertical-align: middle;
}

.emoji-category-active{
    border-bottom-color: #e36209;
}
</style>