import { AxiosError } from "axios";

export const handleApiError = (err: AxiosError) => {
  const error = err?.response?.data as any;

  let formatedError = "Something happened when trying to connect to the server";

  if (err?.response?.status === 500) {
    formatedError = "Request failed with status code 500";
  }

  if (error.detail) formatedError = error.detail || error;
  if (!error.detail && typeof error !== "object") formatedError = error;
  if (!error.detail && typeof error === "object") {
    for (const [key, value] of Object.entries(error || {})) {
      formatedError = `${key} ${value}`;
    }
  }
  if (error?.errors) {
    for (const [key, value] of Object.entries(error.errors || {})) {
      // @ts-ignore
      formatedError = `${key}: ${value?.join(", ")}`;
    }
  }
  if (error.message) {
    if (typeof error.message === "object") {
      for (const [key, value] of Object.entries(error.message || {})) {
        formatedError = `${key}: ${value}`;
      }
    } else {
      formatedError = error.message || error;
    }
  }

  return formatedError;
};
