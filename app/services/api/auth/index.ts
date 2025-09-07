import { GeneralApiProblem, getGeneralApiProblem } from "../apiProblem"
import { i3hostApi } from "../i3hostApi"
import { ApiLoginResponse } from "./types"

export const i3hostLogin = async (): Promise<
  { kind: "ok"; data: ApiLoginResponse } | GeneralApiProblem
> => {
  const response = await i3hostApi.post<ApiLoginResponse>(`/auth/login`, {
    email: "user@example.com",
    password: "password123",
  })

  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

  try {
    const rawData = response.data

    return { kind: "ok", data: rawData as ApiLoginResponse }
  } catch (e) {
    if (__DEV__ && e instanceof Error) {
      console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}
