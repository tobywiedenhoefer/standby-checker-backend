type ApiResponse<T> = {
    success: true,
    payload: T
} | {
    success: false,
    errorCode: number,
    errorMessage: string,
}
export default ApiResponse