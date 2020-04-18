export default {
    East8ToWest8(date) {
        return new Date(Date.parse(date) - 16 * 60 * 60 * 1000)
    },
    West8ToEast8(date) {
        return new Date(Date.parse(date) + 16 * 60 * 60 * 1000)
    }
}