import { useMutation } from '@tanstack/react-query'
import { apiPost } from '../../../lib/apiClient'
import type { InquiryRequest, InquiryResponse } from '../types/api'

const INQUIRY_TYPE_MAP: Record<string, InquiryRequest['inquiryType']> = {
    '일정 제보': 'schedule',
    '기타 건의': 'other',
}

export function mapInquiryType(label: string): InquiryRequest['inquiryType'] {
    return INQUIRY_TYPE_MAP[label] ?? 'other'
}

export function useSubmitInquiry() {
    return useMutation({
        mutationFn: (request: InquiryRequest) =>
            apiPost<InquiryResponse>('/api/contact/inquiries', request),
    })
}
