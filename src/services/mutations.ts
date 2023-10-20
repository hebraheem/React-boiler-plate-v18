import { useMutation } from "react-query";

// export const exampleUsage = (
//   successFn?: (data?: any) => void,
//   errorFn?: (err?: any) => void
// ) => {
// //   const { errorToast, successToast } = useCustomToast();
//   const { mutate, isLoading } = useMutation(serviceFn, {
//     onError: (err) => {
//       errorToast(handleApiError(err));
//       if (errorFn) errorFn(err);
//     },
//     onSuccess: (res) => {
//       successToast(res?.message || "status updated successfully");
//       if (successFn) successFn(res);
//     },
//   });

//   return { mutate, isLoading };
// };
