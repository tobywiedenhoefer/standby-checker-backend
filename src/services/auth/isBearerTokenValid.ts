import ApiResponse from "@/types/response/ApiResponse"

export default async (token?: string): Promise<ApiResponse<null>> => {
    return {
        success: true,
        payload: null,
    }
}