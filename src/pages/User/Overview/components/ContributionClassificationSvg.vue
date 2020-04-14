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
        <text text-anchor="middle" class="activity-overview-percentage js-highlight-percent-top" dx="125" dy="51.46875">{{codeReviewsContributionPercentStr}}</text>
        <text text-anchor="middle" class="text-small activity-overview-label js-highlight-label-top" dx="125" dy="67.46875">Code review</text>
        <text text-anchor="start" class="activity-overview-percentage js-highlight-percent-right" dy="122.171875" dx="191.515625">{{issuesContributionPercentStr}}</text>
        <text text-anchor="start" class="text-small activity-overview-label js-highlight-label-right" dy="138.171875" dx="182.53125">Issues</text>
        <text text-anchor="middle" class="activity-overview-percentage js-highlight-percent-bottom" dx="125" dy="187.875">{{pullRequestsContributionPercentStr}}</text>
        <text text-anchor="middle" class="text-small activity-overview-label js-highlight-label-bottom" dx="125" dy="203.875">Pull requests</text>
        <text text-anchor="end" class="activity-overview-percentage js-highlight-percent-left" dy="122.171875" dx="51.3515625">{{commitsContributionPercentStr}}</text>
        <text text-anchor="end" class="text-small activity-overview-label js-highlight-label-left" dy="138.171875" dx="65.46875">Commits</text>
      </g>
    </svg>
</template>

<script>
    import styled from 'vue-styled-components'
    
    export default {
        props: {
            issuesContributionCount: {
                type: Number,
                default: 0
            },
            commitsContributionCount: {
                type: Number,
                default: 0
            },
            pullRequestsContributionCount: {
                type: Number,
                default: 0
            },
            codeReviewsContributionCount: {
                type: Number,
                default: 0
            },
        },
        computed: {
            totalContributionCount() {
                return this.issuesContributionCount + this.pullRequestsContributionCount + this.commitsContributionCount + this.codeReviewsContributionCount
            },
            maxIngredientCount() {
                let maxCount = 0
                let countArr = [
                    this.issuesContributionCount,
                    this.commitsContributionCount,
                    this.pullRequestsContributionCount,
                    this.codeReviewsContributionCount
                ]
                countArr.forEach(i => {
                    maxCount = Math.max(i,maxCount)
                })
                return maxCount
            },
            issuesContributionRatio() {
                if(this.issuesContributionCount == 0) return 0.0
                let ratio = this.issuesContributionCount / this.maxIngredientCount
                return ratio > 0.1 ? ratio : 0.1
            },
            pullRequestsContributionRatio() {
                if(this.pullRequestsContributionCount == 0) return 0.0
                let ratio = this.pullRequestsContributionCount / this.maxIngredientCount
                return ratio > 0.1 ? ratio : 0.1
            },
            commitsContributionCountRatio() {
                if(this.commitsContributionCount == 0) return 0.0
                let ratio = this.commitsContributionCount / this.maxIngredientCount
                return ratio > 0.1 ? ratio : 0.1
            },
            codeReviewsContributionCountRatio() {
                if(this.codeReviewsContributionCount == 0) return 0.0
                let ratio = this.codeReviewsContributionCount / this.maxIngredientCount
                return ratio > 0.1 ? ratio : 0.1
            },
            theSvgPathD() {
                return `M125,${this.theSvgLineLocation.firstPointY} L${this.theSvgLineLocation.secondPointX},125 L125,${this.theSvgLineLocation.thirdPointY} L${this.theSvgLineLocation.forthPointX},125 z`
            },
            theSvgLineLocation() {
                let range = 125.0 - 77.46875
                let firstPointY = 125.0 - this.codeReviewsContributionCountRatio * range
                let secondPointX = 125.0 + this.issuesContributionRatio * range
                let thirdPointY = 125.0 + this.pullRequestsContributionRatio * range
                let forthPointX = 125.0 - this.commitsContributionCountRatio * range
                return {
                    firstPointY,
                    secondPointX,
                    thirdPointY,
                    forthPointX,
                }
            },
            issuesContributionPercentStr() {
                return `${((this.issuesContributionCount / this.totalContributionCount) * 100.0).toFixed(0)}%`
            },
            pullRequestsContributionPercentStr() {
                return `${((this.pullRequestsContributionCount / this.totalContributionCount) * 100.0).toFixed(0)}%`
            },
            commitsContributionPercentStr() {
                return `${((this.commitsContributionCount / this.totalContributionCount) * 100.0).toFixed(0)}%`
            },
            codeReviewsContributionPercentStr() {
                return `${((this.codeReviewsContributionCount / this.totalContributionCount) * 100.0).toFixed(0)}%`
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