import { useMediaQuery } from "@mui/material";

export const useCustomMediaQuery = () => {
  return {
    isMobile: useMediaQuery("(max-width: 992px)"),
    isMediumScreen: useMediaQuery("(max-width: 1130px)"),
  };
};
