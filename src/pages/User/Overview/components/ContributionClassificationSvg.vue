<template>
    <svg class="mx-auto d-block" xmlns="http://www.w3.org/2000/svg" width="196" height="167">
      <g transform="translate(-18.265625, -40.796875)">
        <path class="js-highlight-blob" stroke-linejoin="round" fill="#7bc96f" stroke="#7bc96f" stroke-width="7" :d="theSvgPathD"></path>
        <line stroke-width="2" class="js-highlight-x-axis activity-overview-axis " x1="77.46875" y1="125" x2="172.53125" y2="125"></line>
        <line stroke-width="2" class="js-highlight-y-axis activity-overview-axis " x1="125" y1="77.46875" x2="125" y2="172.53125"></line>
        <ellipse class="activity-overview-point js-highlight-top-ellipse " rx="3" ry="3" stroke-width="2" fill="white" cx="125" :cy="theSvgLineLocation.firstPointY"></ellipse>
        <ellipse class="activity-overview-point js-highlight-right-ellipse " rx="3" ry="3" stroke-width="2" fill="white" :cx="theSvgLineLocation.secondPointX" cy="125"></ellipse>
        <ellipse class="activity-overview-point js-highlight-bottom-ellipse " rx="3" ry="3" stroke-width="2" fill="white" cx="125" :cy="theSvgLineLocation.thirdPointY"></ellipse>
        <ellipse class="activity-overview-point js-highlight-left-ellipse " rx="3" ry="3" stroke-width="2" fill="white" :cx="theSvgLineLocation.forthPointX" cy="125"></ellipse>
        <text text-anchor="middle" class="activity-overview-percentage js-highlight-percent-top" dx="125" dy="51.46875">{{codeReviewsContributionPercent}}%</text>
        <text text-anchor="middle" class="text-small activity-overview-label js-highlight-label-top" dx="125" dy="67.46875">Code review</text>
        <text text-anchor="start" class="activity-overview-percentage js-highlight-percent-right" dy="122.171875" dx="191.515625">{{issuesContributionPercent}}%</text>
        <text text-anchor="start" class="text-small activity-overview-label js-highlight-label-right" dy="138.171875" dx="182.53125">Issues</text>
        <text text-anchor="middle" class="activity-overview-percentage js-highlight-percent-bottom" dx="125" dy="187.875">{{pullRequestsContributionPercent}}%</text>
        <text text-anchor="middle" class="text-small activity-overview-label js-highlight-label-bottom" dx="125" dy="203.875">Pull requests</text>
        <text text-anchor="end" class="activity-overview-percentage js-highlight-percent-left" dy="122.171875" dx="51.3515625">{{commitsContributionPercent}}%</text>
        <text text-anchor="end" class="text-small activity-overview-label js-highlight-label-left" dy="138.171875" dx="65.46875">Commits</text>
      </g>
    </svg>
</template>

<script>
    import styled from 'vue-styled-components'
    
    export default {
        props: {
            issuesContributionPercent: {
                type: Number,
                default: 0
            },
            commitsContributionPercent: {
                type: Number,
                default: 0
            },
            pullRequestsContributionPercent: {
                type: Number,
                default: 0
            },
            codeReviewsContributionPercent: {
                type: Number,
                default: 0
            },
        },
        computed: {
            theSvgPathD() {
                return `M125,${this.theSvgLineLocation.firstPointY} L${this.theSvgLineLocation.secondPointX},125 L125,${this.theSvgLineLocation.thirdPointY} L${this.theSvgLineLocation.forthPointX},125 z`
            },
            theSvgLineLocation() {
                let maxPercent = 0
                let countArr = [
                    this.issuesContributionPercent,
                    this.commitsContributionPercent,
                    this.pullRequestsContributionPercent,
                    this.codeReviewsContributionPercent
                ]
                countArr.forEach(i => {
                    maxPercent = Math.max(i,maxPercent)
                })
                let range = 125.0 - 77.46875
                let firstPointY = 125.0 - (this.codeReviewsContributionPercent / maxPercent) * range
                let secondPointX = 125.0 + (this.issuesContributionPercent / maxPercent) * range
                let thirdPointY = 125.0 + (this.pullRequestsContributionPercent / maxPercent) * range
                let forthPointX = 125.0 - (this.commitsContributionPercent / maxPercent) * range
                return {
                    firstPointY,
                    secondPointX,
                    thirdPointY,
                    forthPointX,
                }
            },
        },
        created() {
                
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped>
.overview-point {
    stroke: #6cb267;
}

.activity-overview-axis, .activity-overview-point {
    stroke: #6cb267;
}

.activity-overview-percentage {
    font-size: 10px;
    fill: #959da5;
}
.activity-overview-label {
    fill: #586069;
}
</style>