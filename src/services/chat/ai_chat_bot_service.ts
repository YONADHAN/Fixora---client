import { axiosInstance } from "@/api/interceptor";
import { CUSTOMER_ROUTES } from "@/utils/constants/api.routes";

export const askAIChatBotByCustomer = async (message: string) => {
    const response = await axiosInstance.post(
        CUSTOMER_ROUTES.ASK_CHATBOT,
        { message },

    )
    return response.data
}

// export const askAIChatBotByVendor = async (message) => {
//     const response = await axiosInstance.post(
//         VENDOR_ROUTES.ASK_CHATBOT,
//         {message},
//     )
//     return response.data
// }