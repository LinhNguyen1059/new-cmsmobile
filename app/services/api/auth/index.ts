import { GeneralApiProblem, getGeneralApiProblem } from "../apiProblem";
import { i3hostApi } from "../i3hostApi";
import { ApiLoginRequest, ApiLoginResponse } from "./types";

export class AuthService {
  /**
   * Login with i3host
   */
  async i3hostLogin(
    data: ApiLoginRequest,
  ): Promise<{ kind: "ok"; data: ApiLoginResponse } | GeneralApiProblem> {
    const response = await i3hostApi.post<ApiLoginResponse>(`/auth/login`, data);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    try {
      const rawData = response.data;

      return { kind: "ok", data: rawData as ApiLoginResponse };
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return { kind: "bad-data" };
    }
  }
}

export const authService = new AuthService();
