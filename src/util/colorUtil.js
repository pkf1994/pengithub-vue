export default {
    colorRgb: function (str) {
        let colorStr  = str.toLowerCase()
        let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if (colorStr && reg.test(colorStr)) {
            if (colorStr.length === 4) {
                let colorStrNew = "#";
                for (let i=1; i<4; i+=1) {
                    colorStrNew += colorStr.slice(i, i+1).concat(colorStr.slice(i, i+1));
                }
                colorStr = colorStrNew;
            }
            //处理六位的颜色值
            let colorStrChange = [];
            for (let i=1; i<7; i+=2) {
                colorStrChange.push(parseInt("0x"+colorStr.slice(i, i+2)));
            }
            return `rgb(${colorStrChange.join(",")})`;
        }
        return colorStr
    },
    isLight: function (str) {
        let colorStr = this.colorRgb(str)
        let colorNumberArray = colorStr.match(/\d+/g)
        let grayLevel = (colorNumberArray[0] * 0.299) + (colorNumberArray[1] * 0.587) + (colorNumberArray[2] * 0.114)
        return grayLevel >= 192
    }
}