<template>
    <Container class="p-3 Box height-full d-flex flex-column">
        <Name class="mb-2 d-flex flex-items-center">
            <Label class="mr-2" :name="thePackage.packageType" style="margin-left:-4px"></Label>
            <router-link  class="text-bold f5 flex-auto no-wrap overflow-hidden" style="text-overflow: ellipsis" :to="`${thePackage.repository.nameWithOwner}/packages/${thePackage.name}`">{{thePackage.name}}</router-link>   
            <span class="text-gray overflow-hidden no-wrap f6 flex-shrink-0"  style="text-overflow: ellipsis; max-width: 25%;">{{thePackage.latestVersion && thePackage.latestVersion.version}}</span>
        </Name>

        <Message class="mb-2 f6 flex-auto">
            <span class="text-gray">{{thePackage.repository.nameWithOwner}}</span>    
        </Message>

        <Statistic class="ml-3 no-wrap d-flex flex-justify-end"> 
           <!--  <span class="text-gray overflow-hidden no-wrap f6" style="text-overflow: ellipsis;">
                <svg class="octicon octicon-package-dependencies d-inline-block" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.12199 0.392201C6.66497 0.077274 7.33503 0.0772741 7.87801 0.392201L13.128 3.4372C13.6678 3.75026 14 4.32703 14 4.95101V7.24998C14 7.66419 13.6642 7.99998 13.25 7.99998C12.8358 7.99998 12.5 7.66419 12.5 7.24998V5.67702L7.75 8.43202V14.5L7.75 14.816C7.75 15.5867 6.91495 16.0677 6.24828 15.681L0.871994 12.5628C0.332237 12.2497 0 11.6729 0 11.049V4.95101C0 4.32703 0.332236 3.75026 0.871993 3.4372L6.12199 0.392201ZM7.12543 1.68975L11.7552 4.37499L7.00001 7.13298L2.24485 4.37499L6.87457 1.68975C6.95214 1.64476 7.04786 1.64476 7.12543 1.68975ZM1.5 11.049V5.67702L6.25 8.43202V13.948L1.62457 11.2652C1.54746 11.2205 1.5 11.1381 1.5 11.049ZM13.1718 10.7669C13.4573 10.4668 13.4454 9.99212 13.1453 9.70662C12.8452 9.42112 12.3705 9.43295 12.085 9.73305L9.70662 12.2331C9.43113 12.5226 9.43113 12.9774 9.70662 13.2669L12.085 15.7669C12.3705 16.0671 12.8452 16.0789 13.1453 15.7934C13.4454 15.5079 13.4573 15.0332 13.1718 14.7331L11.9987 13.5H15.25C15.6642 13.5 16 13.1642 16 12.75C16 12.3358 15.6642 12 15.25 12H11.9987L13.1718 10.7669Z"></path></svg>
                {{thePackage.dependenciesCount}}
            </span> -->
            <span class="text-gray overflow-hidden no-wrap f6" style="text-overflow: ellipsis;">
                <svg class="octicon octicon-download d-inline-block v-align-bottom" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.46967 10.7803C7.76256 11.0732 8.23744 11.0732 8.53033 10.7803L12.2803 7.03033C12.5732 6.73744 12.5732 6.26256 12.2803 5.96967C11.9874 5.67678 11.5126 5.67678 11.2197 5.96967L8.75 8.43934L8.75 1.75C8.75 1.33579 8.41421 1 8 1C7.58579 1 7.25 1.33579 7.25 1.75L7.25 8.43934L4.78033 5.96967C4.48744 5.67678 4.01256 5.67678 3.71967 5.96967C3.42678 6.26256 3.42678 6.73744 3.71967 7.03033L7.46967 10.7803ZM3.75 13.0001C3.33579 13.0001 3 13.3359 3 13.7501C3 14.1643 3.33579 14.5001 3.75 14.5001H12.25C12.6642 14.5001 13 14.1643 13 13.7501C13 13.3359 12.6642 13.0001 12.25 13.0001H3.75Z"></path></svg>
                {{thePackage.statistics.downloadsTotalCount}}
            </span>
        </Statistic>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Label} from '@/components'
    export default {
        props: {
            thePackage: {
                type: Object,
                required: true
            }
        },
        components: {
            Label,
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