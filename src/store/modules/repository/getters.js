export default {
    activeBranchList: state => {
        let activeBranchList = []
        if(state.code.data.refs) {
            state.code.data.refs.nodes.forEach(item => {
                let lastCommitDate = new Date(item.target.history.nodes[0].committedDate)
                if(Date.parse(new Date()) - Date.parse(lastCommitDate) < 90 * 24 * 3600000 ) {
                    activeBranchList.push(item)
                }
            })
        }
        return activeBranchList
    },
    sortedContents: state => {
        let sortedContents = state.code.codeFile.data
        sortedContents.sort((a,b) => {
            let aIndex = a.type === 'tree' ? 1 : 0
            let bIndex = b.type === 'tree' ? 1 : 0
            return bIndex - aIndex
        })
        return sortedContents
    },
    fileDetailRows: state => {
        let rows = state.code.codeFile.fileDetail.data && state.code.codeFile.fileDetail.data.split(/\n/)
        return rows || []
    }
}