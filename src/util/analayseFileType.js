import {LANGUAGE_LIST,PROSE_LIST,DATA_LIST} from "../constant/fileType";

export default function (fileName) {
    let fileTypeAndColor
    let indexOfLastDot = fileName.lastIndexOf(".")
    if(indexOfLastDot !== -1) {
        let extensions = fileName.substring(indexOfLastDot)
        let multiList = LANGUAGE_LIST.concat(PROSE_LIST).concat(DATA_LIST)
        multiList.forEach(item => {
            if(item.extensions.indexOf(extensions) !== -1) {
                fileTypeAndColor = {
                    type: item.language || item.data ||item.prose,
                    color: item.color || "#ccc"
                }
            }
        })
    }
    return fileTypeAndColor || {
        type: 'Text',
        color: '#ccc'
    }
}