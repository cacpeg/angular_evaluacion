export interface MessageResponse {
    code: string;
    text: string;
}

export interface Response<T> {
    ok: boolean
    data: T
    messages?: MessageResponse[]
    idTransaccion: string
}

export interface ErrorResponse {
    ok: boolean
    messages: MessageResponse[]
}
