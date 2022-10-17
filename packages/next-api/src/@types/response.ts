interface IResponse <T> {
    type: 'success' | 'error'
    message?: string
    content?: T
}