import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
} from "react";
import MUITable from "@mui/material/Table";
import Tbody from "@mui/material/TableBody";
import Td from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Thead from "@mui/material/TableHead";
import Tr from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { getObjectProperty } from "../../utils/helperFn";
import { useCustomMediaQuery } from "../../hooks/useCustomMediaQuery";
import { TableColumn } from "../../types/type";

/**
 * This is a custom table component that handles both desktop and mobile view 
 * @param column an array of table metadata
 * @param dataSource returned api value to render on the table
 * @param column.key value that map exactly to the api returned value, i.e if the api return firstName to render this on the table, the column.key must be firstName 
 * @Note for nested values like {state: {id: "..", name: "..."}} to render the state name, the column.key state.name
 * @param renderMobileView is a react node that is only render in mobile view. the consumer componet has full control on this function 
 * @param actions this handle additional table meta its a function that return JSX element just like renderMobile view consumer component also have full control 
 * @params rowStyle: a style object applied to each row of the table 
* <Table
    column={column}
    dataSource={allAdmin?.data}
    loading={isTableLoading}
    onRowClick={(row) => handleRowClick(row)}
    checkbox
    showCheckboxOnHeader
    showCheckboxOnSmallScreen
    actionLabel="Action"
    actions={(row, col) => {
      return <div>drop</div>;
    }}
    renderMobileView={(row, col) => {
      return (
        <Box display="flex" p={2} width="100%">
          <Image
            w="50px"
            h="50px"
            borderRadius="50%"
            mr="10px"
            objectFit="cover"
            src={row?.dp}
            alt="dp"
          />
          <Box>
            <Typography fontWeight={500} fontSize="14px" color="black">
              {row?.firstName} {row?.lastName}
            </Typography>
            <Typography fontSize="12px" color="grey.800">
              {row?.jobTitle}
            </Typography>
            <Badge
              status={row?.status}
              textProp={{ fontSize: "12px" }}
            />
          </Box>
        </Box>
      );
    }}
  />
    *NOTE: checkbox values are stored in the state for easier access and also clear the checkbox value before leave the page
    to get checkbox value
    const {records, changeRecords} = React.useContext(TableRecordContext)
    records hold the selected check value(s)

    to clear record before leaving page
    React.useEffect(()=> {
      return ()=> changeRecords([])
    },[])
 */

type selectedCheckBox = Record<string, any>;
interface ITable {
  dataSource: Record<string, any>[];
  column: TableColumn[];
  onRowClick?: (data: any) => any | void;
  actions?: (row: Record<string, any>, column: TableColumn) => JSX.Element;
  actionLabel?: string;
  showActionOnSmallScreen?: boolean;
  showCheckboxOnSmallScreen?: boolean;
  checkbox?: boolean;
  loading: boolean;
  showCheckboxOnHeader?: boolean;
  emptyWidth?: string;
  emptyMsg?: string;
  rowStyle?: Record<string, any>;
  hasTooltip?: boolean;
  renderMobileView?: (row: Record<string, any>, col?: TableColumn) => ReactNode;
  tableMeta?: {
    size?: "medium" | "small";
    stickyHeader?: boolean;
    classes?: Record<string, any>;
    sx?: any;
    children?: Node;
    component?: any;
  };
}
const Table: FC<ITable> = ({
  dataSource,
  column,
  onRowClick,
  actionLabel,
  actions,
  checkbox,
  loading = false,
  showCheckboxOnHeader = true,
  showActionOnSmallScreen = false,
  showCheckboxOnSmallScreen = false,
  renderMobileView,
  emptyWidth,
  emptyMsg,
  tableMeta = {
    size: "medium",
  },
}: ITable) => {
  const { isMobile } = useCustomMediaQuery();
  const { records: selectedField, changeRecords: setSelectedField } =
    useContext(TableRecordContext);
  const rowCount = dataSource?.length;

  const handleClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: selectedCheckBox
  ) => {
    if (event.target.checked) {
      setSelectedField((prev: any) => [...prev, name]);
    } else {
      const filtered = selectedField.filter(
        (val: selectedCheckBox) => val.id !== name?.id
      );
      setSelectedField(filtered);
    }
  };
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected: Record<string, any> = dataSource;
      setSelectedField(newSelected);
      return;
    }
    setSelectedField([]);
  };

  if (
    actions &&
    actionLabel &&
    !column?.map((c) => c?.key)?.includes("action")
  ) {
    column.push({
      header: actionLabel,
      key: "action",
      showOnSmallScreen: showActionOnSmallScreen,
      sort: false,
      disableCellClick: true,
    });
  }

  if (
    checkbox &&
    showCheckboxOnHeader &&
    !column?.map((c) => c?.key)?.includes("checkbox")
  ) {
    column.unshift({
      header: "checkbox",
      key: "checkbox",
      showOnSmallScreen: showCheckboxOnSmallScreen,
      sort: false,
      disableCellClick: true,
    });
  }

  const getHeaderValue = (header: Partial<TableColumn>) => {
    switch (header?.header) {
      case "action":
        return actionLabel;
      case "checkbox":
        return (
          <Checkbox
            onChange={(e: any) => handleSelectAllClick(e)}
            checked={rowCount === selectedField?.length && !!rowCount}
          />
        );
      default:
        return header?.header;
    }
  };

  const renderTableHead = () => {
    if (isMobile && renderMobileView) return;
    return (
      <Thead>
        <Tr>
          {column?.map((cmn) => {
            return <Td key={cmn?.key}>{getHeaderValue(cmn)}</Td>;
          })}
        </Tr>
      </Thead>
    );
  };

  const getTableBodyValue = (
    row: Record<string, any>,
    column: TableColumn
  ): any => {
    switch (!!row) {
      case !!column?.renderTbFn:
        return column?.renderTbFn?.(row);
      case !!row[column?.key]:
        return getObjectProperty(row, column?.key);
      case !!checkbox:
        return (
          <Checkbox
            onChange={(e: any) => handleClick(e, row)}
            checked={selectedField
              ?.map((s: Record<string, any>) => s?.id)
              ?.includes(row?.id)}
          />
        );
      case !!actions:
        return actions?.(row, column);
      default:
        break;
    }
  };

  function hiInTheMiddle() {
    const array = Array.from(column, (x) => " ");
    array[Math.floor((array.length - 1) / 2)] = emptyMsg || "No result found";
    return array;
  }

  const renderTableBody = () => {
    if (loading) {
      return (
        <Box position="fixed" width={emptyWidth || "100vw"} height="45vh">
          loading...;
        </Box>
      );
    }

    if (!dataSource?.length) {
      return (
        <Tbody>
          <tr>
            {hiInTheMiddle()?.map((hi) => {
              return (
                <td>
                  <Typography fontSize="24px" fontWeight="bold">
                    {hi}
                  </Typography>
                </td>
              );
            })}
          </tr>
        </Tbody>
      );
    }

    return (
      <Tbody>
        {dataSource?.map((row: Record<string, any>, index: number) => (
          <React.Fragment key={index}>
            <Tr role="button" key={index} onClick={() => onRowClick?.(row)}>
              {column?.map((cm: TableColumn) => {
                return (
                  <Td
                    key={cm?.header}
                    align={cm?.align}
                    onClick={(e: any) => {
                      if (cm?.disableCellClick) {
                        e.stopPropagation();
                      }
                    }}
                  >
                    {getTableBodyValue(row, cm)}
                  </Td>
                );
              })}
            </Tr>
          </React.Fragment>
        ))}
      </Tbody>
    );
  };

  if (isMobile && renderMobileView && dataSource) {
    const mobileColumn = column?.filter((c) => !c.showOnSmallScreen);
    let copyDataSource = JSON.parse(JSON.stringify(dataSource));
    // eslint-disable-next-line
    copyDataSource = copyDataSource?.map((ds: any, i: number) => {
      return { ...ds, [mobileColumn[i]?.key]: undefined };
    });

    if (isMobile && !dataSource?.length) {
      return (
        <Box my={5} textAlign="center" m="auto">
          <Divider />
          <Typography fontSize="20px" fontWeight="bold">
            {"No result found"}
          </Typography>
        </Box>
      );
    }

    return (
      <Box width="100%">
        {dataSource?.map((row: Record<string, any>, index: number) => (
          <Box
            width="100%"
            key={index}
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
          >
            {checkbox && showCheckboxOnSmallScreen ? (
              <input
                type="checkbox"
                onChange={(e) => handleClick(e, row)}
                checked={selectedField
                  ?.map((s: Record<string, any>) => s?.id)
                  ?.includes(row?.id)}
              />
            ) : null}
            <Box key={index} onClick={() => onRowClick?.(row)} width="100%">
              {renderMobileView(row)}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={1}>
      <MUITable
        size={tableMeta.size}
        stickyHeader={tableMeta.stickyHeader}
        sx={tableMeta.sx}
      >
        {renderTableHead()}
        {renderTableBody()}
      </MUITable>
    </TableContainer>
  );
};

export default React.memo(Table);

type tableContextProp = {
  records: selectedCheckBox;
  changeRecords: (val: selectedCheckBox) => void;
};

// @ts-ignore
export const TableRecordContext = createContext<tableContextProp>({});

export const TableRecordProvider = ({ children }: any) => {
  const [records, setRecords] = useState<selectedCheckBox>([]);

  const handleChangeRecord = (records: any) => {
    setRecords(records);
  };

  return (
    <TableRecordContext.Provider
      value={{ records, changeRecords: handleChangeRecord }}
    >
      {children}
    </TableRecordContext.Provider>
  );
};
