export interface InquiryRequest {
    title: string
    email?: string
    inquiryType: 'schedule' | 'other'
    content: string
}

export interface InquiryResponse {
    status: 'sent'
}
