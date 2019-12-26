import Modal from "./Modal"

export default {
    install: (Vue) => {
        const ModalConstructor = Vue.extend(Modal)
        const modalComponent = new ModalConstructor()
        modalComponent.$mount()
        document.body.appendChild(modalComponent.$el)
        Vue.prototype.$modal = (title,modalContent) => {
            modalComponent.showModal(title,modalContent)
        }
        Vue.modal = (title,modalContent) => {
            modalComponent.showModal(title,modalContent)
        }
    }
}