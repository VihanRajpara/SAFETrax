import { useState, useMemo, useEffect } from "react";
import { SafeHeader } from "../../pageHeader/SafeHeader.jsx";
import { tokens } from "../../theme.js";
import { visuallyHidden } from "@mui/utils";
import PropTypes from "prop-types";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Checkbox,
  useTheme,
  Paper,
  styled,Autocomplete,Button,
  Table,
  Typography,
  Toolbar,
  InputAdornment,
  TableBody,
  TableCell,
  tableCellClasses,
  TableRow,
  TextField,
  TableContainer,
  TableHead,
  TableSortLabel,
} from "@mui/material";
import { investmentteam, Leader } from "../DATA.js";
import axios from "axios";

function useEmployeeData() {
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchingData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/employees');
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchingData();
  }, []);

 

  return data.map((item, index) => createData(index, item.mename, item.cro, item.mecode));

  
}

function createData(id, mename, cro,mecode) {
  return {
    id,
    mename,
    cro,
    mecode
  };
}



// const rows = data.map((item, index) =>
//   createData(index, item.mename, item.cro)
// );

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: true,
    label: "SR No",
  },
  {
    id: "mename",
    numeric: false,
    disablePadding: false,
    label: "Employee Name",
  },
];

function EnhancedTableHead(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: `${colors.blueAccent[600]}`,
      color: theme.palette.common.white,
      fontWeight: "600",
      fontSize: 15,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 15,
    },
  }));
  const StyledTableSortLabel = styled(TableSortLabel)(({ theme, active }) => ({
    fontWeight: active ? "600" : "normal",
    fontSize: active ? "1.1rem" : "1rem",
    color: active ? "white !important" : "white !important",
    "& .MuiTableSortLabel-icon": {
      color: active ? "white !important" : "white",
    },
  }));

  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        <StyledTableCell padding="checkbox" align="center">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
            sx={{
              color: "white !important",
              '&.Mui-checked': {
                color: "white !important",
              },
            }}
          />
        </StyledTableCell>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.id === "id" ? "center" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <StyledTableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </StyledTableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={{
        marginRight: 2
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%",  }}
          color="white"
          variant="h6"
          component="div"
        >
          {numSelected} - selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="white !important"
          variant="subtitle1"
          id="tableTitle"
          component="div"
        >
          0 - selected
        </Typography>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function CROforInsurance() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const rows=useEmployeeData();
  const header = "Insurance CRO ";
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [selected, setSelected] = useState([]);
  const [searchval, setSearchval] = useState("");
  const [user, setUser]=useState(null);
  const [CROS,setCROS] = useState([]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  useEffect(() => {
    const fetchingData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/insurance/all-cro');
        // setData(response.data);
        console.log("/insurance/all-cro",response.data);
        setCROS(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchingData();
  }, []);

  console.log("Select", selected)

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.mecode);
      setSelected(newSelected);
      console.log("new ", newSelected, "Alredy", isSelected)
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleSearch = (e) => {
    setSearchval(e.target.value);
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter(
            (x) =>
              x.mename.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  let visibleRows = useMemo(
    () => stableSort(filterFn.fn(rows), getComparator(order, orderBy)),
    [order, orderBy, searchval,rows]
  );

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: `${colors.blueAccent[600]}`,
      color: theme.palette.common.white,
      fontWeight: "600",
      fontSize: 15,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 15,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <>
      <Paper
        style={{
          border: "1px solid #ced4da",
          borderRadius: "0.25rem",
          marginTop: "0.7rem",
          margin: "0.25rem",
          padding: "1rem",
          textTransform: "uppercase",
          minHeight: "95vh",
          overflowY: "auto",
        }}
      >
        <SafeHeader headerName={header} />

        <Box
          display="flex"
          gap={3}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box
          display="flex"
          gap={2}
          p={2}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <Typography sx={{ fontSize: 18 }}>select CRO : </Typography>
          <Box
            display="flex"
            sx={{ width: 400, height: 36 }}
            backgroundColor={colors.primary[400]}
            borderRadius="1px"
          >
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={CROS}
              value={user}
              onChange={(e, v) => setUser(v)}
              sx={{ width: 400, height: 20 }}
              getOptionLabel={(option) => option.mename}
              renderInput={(params) => <TextField {...params} label="CRO" />}
              renderOption={(props, option) => (
                <li {...props}>
                  <Typography>{`${option.mename}`}</Typography>
                </li>
              )}
            />
          </Box>
          <Button
            variant="contained"
            sx={{ borderRadius: 4 ,bgcolor: `${colors.blueAccent[600]}`}}
            onClick={() => console.log("user", user)}
          >
            GO
          </Button>
        </Box>
          <TableContainer
            component={Paper}
            sx={{ margin: 2, maxWidth: "70%", borderRadius: 2 }}
          >
            <Box display="flex" justifyContent="space-between" sx={{ background: `${colors.blueAccent[600]}` }}>
              <Toolbar >
                <TextField
                  variant="standard"

                  value={searchval}
                  label="Search Employee"
                  sx={{
                    minWidth: 200,
                    width: 400,
                    alignSelf: "center",
                    "& .MuiInputBase-input": {
                      color: "white !important",
                    },
                    "& .MuiInputLabel-root": {
                      color: "white !important",
                      "&:focus": {
                        color: "white !important",
                      },
                    },
                    "& .MuiInput-underline:after,& .MuiInput-underline:before": {
                      borderBottomColor: "white !important",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "white" }} />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleSearch}
                />
              </Toolbar>
              <EnhancedTableToolbar numSelected={selected.length} />
            </Box>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.mecode);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <StyledTableRow
                      hover
                      onClick={(event) => handleClick(event, row.mecode)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <StyledTableCell align="center" padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.id + 1}
                      </StyledTableCell>
                      <StyledTableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        align="left"
                      >
                        {row.mename}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </>
  );
}

export default CROforInsurance;