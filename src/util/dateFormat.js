export default {
    getDateDiff:(standardDateString) => {

        let dateTimeStamp = new Date(standardDateString).getTime()
        // 补全为13位
        var arrTimestamp = (dateTimeStamp + '').split('');
        for (var start = 0; start < 13; start++) {
            if (!arrTimestamp[start]) {
                arrTimestamp[start] = '0';
            }
        }
        dateTimeStamp = arrTimestamp.join('') * 1;

        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        //var halfamonth = day * 15;
        var month = day * 30;
        var now = new Date().getTime();
        var diffValue = now - dateTimeStamp;

        // 如果本地时间反而小于变量时间
        if (diffValue < 0) {
            return '不久前';
        }

        // 计算差异时间的量级
        var monthC = diffValue / month;
        var weekC = diffValue / (7 * day);
        var dayC = diffValue / day;
        var hourC = diffValue / hour;
        var minC = diffValue / minute;

        // 数值补0方法
        var zero = function (value) {
            if (value < 10) {
                return '0' + value;
            }
            return value;
        };

        // 使用
        if (monthC > 12) {
            // 超过1年，直接显示年月日
            return (function () {
                var date = new Date(dateTimeStamp);
                return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
            })();
        } else if (monthC >= 1 && monthC < 2) {
            return parseInt(monthC) + " month ago";
        } else if (monthC > 2) {
            return parseInt(monthC) + " months ago";
        } else if (weekC >= 1 && weekC < 2) {
            return parseInt(weekC) + " week ago";
        } else if (weekC > 2) {
            return parseInt(weekC) + " weeks ago";
        } else if (dayC >= 1 && dayC < 2) {
            return parseInt(dayC) + " day ago";
        }  else if (dayC > 2) {
            return parseInt(dayC) + " days ago";
        }else if (hourC >= 1 && hourC < 2) {
            return parseInt(hourC) + " hour ago";
        } else if (hourC >= 1) {
            return "about " + parseInt(hourC) + " hours ago";
        }else if (minC >= 1 && minC < 2) {
            return parseInt(minC) + " minute ago";
        } else if (minC >= 1) {
            return "about " + parseInt(minC) + " minutes ago";
        }
        return '刚刚';
    }
}