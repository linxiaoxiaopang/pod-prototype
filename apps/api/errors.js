export class ApiError extends Error {
  constructor(code, status, message) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

export const badRequest = (code, message) => new ApiError(code, 400, message)
export const tooLarge = (message) => new ApiError('IMAGE_TOO_LARGE', 413, message)
export const upstreamError = (code, message) => new ApiError(code, 502, message)
