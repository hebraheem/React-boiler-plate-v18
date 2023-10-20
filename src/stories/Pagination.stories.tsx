import type { Meta, StoryObj } from "@storybook/react";
import Pagination from "../reusables/common/Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Pagination/pagination",
  component: Pagination,
  tags: ["autodocs"],
  argTypes: {
    siblingCount: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const pagination: Story = {
  args: {
    pagination: {
      next: { page: 2, limit: 1 },
      prev: { page: 1, limit: 1 },
      pageTotal: 2,
      totalRecords: 2,
      count: 1,
    },
    currentPage: 1,
    onLimitChange: (limit) => console.log(limit),
    onPageChange: (page) => console.log(page),
  },
};
