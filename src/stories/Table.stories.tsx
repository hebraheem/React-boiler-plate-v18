import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Table, {
  TableRecordContext,
  TableRecordProvider,
} from "../reusables/common/Table";
import { TableColumn } from "../types/type";
import React from "react";

const meta: Meta<typeof Table> = {
  title: "Table/table",
  component: Table,
  tags: ["autodocs"],
  argTypes: {
    actionLabel: {
      table: { disable: true },
    },
    actions: {
      table: { disable: true },
    },
    emptyWidth: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const column: TableColumn[] = [
  {
    header: "string",
    key: "text",
    showOnSmallScreen: false,
    sort: true,
    disableCellClick: false,
    align: "left",
    renderTbFn: (data?: any) => <div>{data.test}</div>,
  },
  {
    header: "string two",
    key: "text2",
    showOnSmallScreen: false,
    sort: true,
    disableCellClick: false,
    align: "left",
    renderTbFn: (data?: any) => <div>{data.test2}</div>,
  },
  {
    header: "Action",
    key: "text3",
    showOnSmallScreen: false,
    sort: true,
    disableCellClick: true,
    align: "left",
    renderTbFn: (data?: any) => (
      <div style={{ cursor: "pointer" }} onClick={() => console.log(data)}>
        :
      </div>
    ),
  },
];

const mock = [
  { test: "string", test2: "string again", id: 1 },
  { test: "string r2", test2: "string again r2", id: 2 },
];

export const BasicTable: Story = {
  args: {
    column,
    dataSource: mock,
    loading: false,
  },
};

const TableWithBox = ({ ...args }: any) => {
  // records hold the selected check value(s)
  const { records, changeRecords } = React.useContext(TableRecordContext);

  // to clear record before leaving page
  React.useEffect(() => {
    return () => changeRecords?.([]);
  }, []);

  return (
    <TableRecordProvider>
      <Table {...args} />
    </TableRecordProvider>
  );
};

export const TableWithCheckBox: Story = {
  args: {
    column,
    dataSource: mock,
    loading: false,
    checkbox: true,
    onRowClick: action("handleRowClick"),
  },
  render: (args) => <TableWithBox {...args} />,
};

export const TableMobile: Story = {
  args: {
    column,
    dataSource: mock,
    loading: false,
    checkbox: true,
    renderMobileView(row, col) {
      return <div>{row.key} mobile view</div>;
    },
    onRowClick: action("handleRowClick"),
  },
};
