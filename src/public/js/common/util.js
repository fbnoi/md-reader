export default class util {
    static ready(fn) {
        document.addEventListener('DOMContentLoaded', () => fn());
    }
}
