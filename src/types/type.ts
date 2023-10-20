export type IBasicChild = {
  children: React.ReactElement;
};

export type TableColumn = {
  header: string;
  key: string;
  showOnSmallScreen: boolean;
  sort: boolean;
  disableCellClick: boolean;
  align?: "right" | "left" | "center" | undefined;
  renderTbFn?: (data?: any) => JSX.Element;
};
