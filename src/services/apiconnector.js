import axios from "axios"

export const axiosInstance = axios.create({})

export const apiConnector = (method, url, bodyData = null, headers = {}, params = null) => {
  return axiosInstance({
    method,
    url,
    data: bodyData,
    headers: {
      ...headers, // only attach if provided
    },
    params,
  })
}
