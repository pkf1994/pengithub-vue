<template>
    <Container class="p-3 Box height-full d-flex flex-column">
        <Name class="mb-2 d-flex flex-items-center">
            <span v-html="thePackage.iconSvg"></span> 
            <router-link  class="text-bold f5 flex-auto no-wrap overflow-hidden" style="text-overflow: ellipsis" :to="thePackage.routerLink">{{thePackage.name}}</router-link>   
            <span class="text-gray overflow-hidden no-wrap f6 flex-shrink-0"  style="text-overflow: ellipsis; max-width: 25%;">{{thePackage.version}}</span>
        </Name>

        <Message class="mb-4 f6 flex-auto">
            <span class="text-gray">{{thePackage.message}}</span>    
        </Message>

        <TheMeta class="d-flex flex-items-center">
            <Repo class="flex-auto overflow-hidden d-flex">
                <span class="f6 link-gray flex-auto no-wrap overflow-hidden" style="text-overflow: ellipsis">
                    <svg class="octicon octicon-repo d-inline-block v-align-bottom mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 2.5C2 1.83696 2.26339 1.20107 2.73223 0.732233C3.20108 0.263392 3.83696 0 4.5 0L13.25 0C13.4489 0 13.6397 0.0790176 13.7803 0.21967C13.921 0.360322 14 0.551088 14 0.75V13.25C14 13.4489 13.921 13.6397 13.7803 13.7803C13.6397 13.921 13.4489 14 13.25 14H10.75C10.5511 14 10.3603 13.921 10.2197 13.7803C10.079 13.6397 10 13.4489 10 13.25C10 13.0511 10.079 12.8603 10.2197 12.7197C10.3603 12.579 10.5511 12.5 10.75 12.5H12.5V10.5H4.5C4.30308 10.5 4.11056 10.5582 3.94657 10.6672C3.78257 10.7762 3.65442 10.9312 3.57816 11.1128C3.50191 11.2943 3.48096 11.4943 3.51793 11.6878C3.5549 11.8812 3.64816 12.0594 3.786 12.2C3.92524 12.3422 4.0023 12.5338 4.00024 12.7328C3.99818 12.9318 3.91716 13.1218 3.775 13.261C3.63285 13.4002 3.4412 13.4773 3.24222 13.4752C3.04325 13.4732 2.85324 13.3922 2.714 13.25C2.25571 12.7829 1.99929 12.1544 2 11.5V2.5ZM12.5 1.5V9H4.5C4.144 9 3.806 9.074 3.5 9.208V2.5C3.5 2.23478 3.60536 1.98043 3.79289 1.79289C3.98043 1.60536 4.23478 1.5 4.5 1.5H12.5ZM5 12.25V15.5C5 15.5464 5.01293 15.5919 5.03734 15.6314C5.06175 15.6709 5.09667 15.7028 5.1382 15.7236C5.17972 15.7444 5.22621 15.7532 5.27245 15.749C5.31869 15.7448 5.36286 15.7279 5.4 15.7L6.85 14.613C6.89328 14.5805 6.94591 14.563 7 14.563C7.05409 14.563 7.10673 14.5805 7.15 14.613L8.6 15.7C8.63714 15.7279 8.68131 15.7448 8.72755 15.749C8.77379 15.7532 8.82028 15.7444 8.8618 15.7236C8.90333 15.7028 8.93826 15.6709 8.96266 15.6314C8.98707 15.5919 9 15.5464 9 15.5V12.25C9 12.1837 8.97366 12.1201 8.92678 12.0732C8.87989 12.0263 8.81631 12 8.75 12H5.25C5.1837 12 5.12011 12.0263 5.07322 12.0732C5.02634 12.1201 5 12.1837 5 12.25Z"></path></svg>
                    <router-link class="link-gray" :to="thePackage.repositoryRouterLink">{{thePackage.repository}}</router-link>
                </span>
            </Repo>

            <Statistic class="ml-3 no-wrap"> 
                <span class="text-gray overflow-hidden no-wrap f6" style="text-overflow: ellipsis;">
                    <svg class="octicon octicon-package-dependencies d-inline-block" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.12199 0.392201C6.66497 0.077274 7.33503 0.0772741 7.87801 0.392201L13.128 3.4372C13.6678 3.75026 14 4.32703 14 4.95101V7.24998C14 7.66419 13.6642 7.99998 13.25 7.99998C12.8358 7.99998 12.5 7.66419 12.5 7.24998V5.67702L7.75 8.43202V14.5L7.75 14.816C7.75 15.5867 6.91495 16.0677 6.24828 15.681L0.871994 12.5628C0.332237 12.2497 0 11.6729 0 11.049V4.95101C0 4.32703 0.332236 3.75026 0.871993 3.4372L6.12199 0.392201ZM7.12543 1.68975L11.7552 4.37499L7.00001 7.13298L2.24485 4.37499L6.87457 1.68975C6.95214 1.64476 7.04786 1.64476 7.12543 1.68975ZM1.5 11.049V5.67702L6.25 8.43202V13.948L1.62457 11.2652C1.54746 11.2205 1.5 11.1381 1.5 11.049ZM13.1718 10.7669C13.4573 10.4668 13.4454 9.99212 13.1453 9.70662C12.8452 9.42112 12.3705 9.43295 12.085 9.73305L9.70662 12.2331C9.43113 12.5226 9.43113 12.9774 9.70662 13.2669L12.085 15.7669C12.3705 16.0671 12.8452 16.0789 13.1453 15.7934C13.4454 15.5079 13.4573 15.0332 13.1718 14.7331L11.9987 13.5H15.25C15.6642 13.5 16 13.1642 16 12.75C16 12.3358 15.6642 12 15.25 12H11.9987L13.1718 10.7669Z"></path></svg>
                    {{thePackage.dependenciesCount}}
                </span>
                <span class="text-gray overflow-hidden no-wrap f6" style="text-overflow: ellipsis;">
                    <svg class="octicon octicon-download d-inline-block v-align-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.46967 10.7803C7.76256 11.0732 8.23744 11.0732 8.53033 10.7803L12.2803 7.03033C12.5732 6.73744 12.5732 6.26256 12.2803 5.96967C11.9874 5.67678 11.5126 5.67678 11.2197 5.96967L8.75 8.43934L8.75 1.75C8.75 1.33579 8.41421 1 8 1C7.58579 1 7.25 1.33579 7.25 1.75L7.25 8.43934L4.78033 5.96967C4.48744 5.67678 4.01256 5.67678 3.71967 5.96967C3.42678 6.26256 3.42678 6.73744 3.71967 7.03033L7.46967 10.7803ZM3.75 13.0001C3.33579 13.0001 3 13.3359 3 13.7501C3 14.1643 3.33579 14.5001 3.75 14.5001H12.25C12.6642 14.5001 13 14.1643 13 13.7501C13 13.3359 12.6642 13.0001 12.25 13.0001H3.75Z"></path></svg>
                    {{thePackage.downloadCount}}
                </span>
            </Statistic>
        </TheMeta>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            thePackage: {
                type: Object,
                required: true
            }
        },
        components: {
            Container: styled.div``,
            Name: styled.div``,
            Message: styled.div``,
            TheMeta: styled.div``,
            Repo: styled.div``,
            Statistic: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
</style>