export const queryParamsHelper = (queryParams: Record<string, any>) => {
  let queries = "?";
  for (let [key, value] of Object.entries(queryParams || {})) {
    if (!!key && key !== undefined && key !== null && value !== "")
      queries += `${key}=${value}&`;
  }
  return queries?.substring(0, queries?.length - 1);
};

/**
 *
 * @param str string to be truncated
 * @param length amount of characters before truncate
 * @param ellipsis postfix e.g ...
 * @returns
 */
export const truncateText = (str: string, length = 70, ellipsis = "...") => {
  if (!str) {
    return;
  }

  if (str.length <= length) {
    return str;
  }

  return `${str.substring(0, length)}${ellipsis}`;
};

/**
 * csv /file download helper function
 * @param filename string
 * @param textInput any -file basically BE response
 * @param format string e.g "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
 */
export function downloadCsvHelper(
  filename: string,
  textInput: any,
  format: string
) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `${
      format ||
      "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }, ${encodeURIComponent(textInput)}`
  );
  element.setAttribute("download", filename);
  element.setAttribute("target", "_blank");
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * this is an alternative to using eval(object["root1.root2.nth"])
 * it simply split at (.) when available and do a deep lookup to get the corresponding value
 * @param obj Object where the value is to be searched
 * @param str:string
 * @returns:string corresponding object value
 */
export const getObjectProperty = (obj: Record<string, any>, str: string) => {
  const props = str?.split(".");
  let result = obj;
  for (var i = 0; i < props?.length; i++) result = result?.[props?.[i]];
  return result;
};

/**
 *
 * @param obj an object where key is to be searched for
 * @param value a known value for which the key is to be search for
 * @returns string, key that matches the passed value in the object
 */
export const getObjKey = (
  obj: Record<string, any>,
  value: string
): string | undefined => {
  return Object.keys(obj).find((key) => obj[key] === value);
};
