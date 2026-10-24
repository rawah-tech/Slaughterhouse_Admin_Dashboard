import axios from "axios";

import { environment } from "../config/env";

const apiClient = axios.create({
  baseURL: environment.apiBaseUrl,
  timeout: 15_000,
  withCredentials: true,
});

export default apiClient;
