import { useState, useMemo, useEffect } from "react";
import { SafeHeader } from "../../pageHeader/SafeHeader.jsx";
import { tokens } from "../../theme.js";
import { visuallyHidden } from "@mui/utils";
import PropTypes from "prop-types";
import SearchIcon from "@mui/icons-material/Search";
import { useSnackbar } from "../../snackbar/SnackbarContext";

import {
  Box,
  useTheme,
  Paper,
  Autocomplete,
  styled,
  Modal,
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
  Button,
} from "@mui/material";
import { investmentteam, Leader } from "../DATA.js";
import TableSortLabel from "@mui/material/TableSortLabel";
import axios from "axios";
let click = 1;// for reflact change while updating cro 
function useEmployeeData() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchingData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/cro');
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchingData();
  }, [click]);
    return   data.map((item, index) => createData(index, item.employee_Name, item.cro_Name,item.employee_Code));;
}
function createData(id, employee_Name, employee_CRO,employee_Code) {
  return {
    id,
    employee_Name,
    employee_CRO,
    employee_Code
  };
}


// const rows = investmentteam.map((item, index) =>
//   createData(index, item.employee_Name, item.employee_CRO)
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
  // {
  //   id: "employee_Code",
  //   numeric: true,
  //   disablePadding: true,
  //   label: "employee Code",
  // },
  {
    id: "employee_Name",
    numeric: false,
    disablePadding: false,
    label: "Employee Name",
  },
  {
    id: "employee_CRO",
    numeric: false,
    disablePadding: false,
    label: "CRO Name",
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
    fontWeight: active ? '600' : 'normal',
    fontSize: active ? '1.1rem' : '1rem',
    color: active ? 'white !important' : 'white !important',
    '& .MuiTableSortLabel-icon': {
      color: active ? 'white !important' : 'white',
    },
  }));

  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align="center"
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
        <StyledTableCell align="center">Action</StyledTableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function CROforInvestment() {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const rows=useEmployeeData();
  console.log(rows);
  const colors = tokens(theme.palette.mode);
  const header = "Investment CRO ";
  const [user, setuser] = useState({});
  const [newCRO, setNewCRO] = useState(null);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("employee_CRO");
  const [searchval, setSearchval] = useState("");
  const [employeeCodeToUpdate, setEmployeeCodeToUpdate] = useState(null);
  let CRO = data.find((item) => item.mename === user.employee_CRO); 
  const {fetchingData}=useEmployeeData();
  
  
  const { showSnackbar } = useSnackbar();

 
   
  //data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/all-cro');
       
        setData(response.data);
        console.log("CRO DATA",response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  
  // Function to handle updating the CRO for the selected employee
const handleUpdate = () => {
  
  if (employeeCodeToUpdate && newCRO) {
    const requestBody = {
      CRO: newCRO.mecode
    };

    axios.post(`http://localhost:8080/user/update-cro/${employeeCodeToUpdate}`, requestBody)
      .then((response) => {
        // console.log(CRO)
        console.log("Update successful:", response.data);
        showSnackbar("CRO Updated successfully","success")
        handleClose();
        click=click+1;
      })
      .catch((error) => {
        console.error("Error updating CRO:", error);
      });
  } else {
    console.error("Invalid employee code or new CRO value");
  }
};


  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [open, setOpen] = useState(false);


  const handleSearch = (e) => {
    setSearchval(e.target.value);
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.employee_Name.toLowerCase().includes(target.value.toLowerCase()) ||
            x.employee_CRO.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  const handleOpen = (person) => {
    if (person !== user) {
      setuser(person);
      setEmployeeCodeToUpdate(person.employee_Code);
    }
    setOpen(true);
  };
  const handleClose = () => {
    setuser({});
    setOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  
  useEffect(() => {
       
   }, [searchval]);
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
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
  };



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
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Box display="flex" flexDirection="column" gap={3}>
                <Box>
                  <SafeHeader headerName={"Update Employee"} />
                </Box>
                <Box>
                  <TextField
                    sx={{ width: 350 }}
                    InputProps={{
                      readOnly: true,
                    }}
                    id="Read Only"
                    label="Employee Name"
                    value={user.employee_Name}
                  />
                </Box>
                <Box>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={data}
                    value={CRO}
                    onChange={(event, newValue) => {
                      setNewCRO(newValue);
                      console.log(newValue);
                    }}
                    sx={{ width: 350, height: 20, marginBottom: 4 }}
                    getOptionLabel={(option) => option.mename}
                    renderInput={(params) => (
                      <TextField {...params} label="CRO" />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Typography>{`${option.mename}`}</Typography>
                      </li>
                    )}
                  />
                </Box>
                <Box display="flex" justifyContent="center" gap={2}>
                  <Button
                    variant="contained"
                    sx={{ background: `${colors.blueAccent[600]}` }}
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    Close
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>

          <TableContainer component={Paper} sx={{ margin: 2, maxWidth: "70%", borderRadius: 2 }}>
            <Toolbar sx={{ background: `${colors.blueAccent[600]}` }}>
              <TextField
                variant="standard"
                value={searchval}
                label="Search Employee | CRO"
                sx={{
                  width: "100%",
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
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  return (
                    <StyledTableRow
                      hover
                      key={row.id}
                      sx={{ cursor: "pointer" }}
                    >
                      <StyledTableCell align="center">
                        {row.id + 1}
                      </StyledTableCell>
                      {/* <StyledTableCell align="left">
                        {row.employee_Code}
                      </StyledTableCell> */}
                      <StyledTableCell align="left">
                        {row.employee_Name}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.employee_CRO}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          sx={{ background: `${colors.blueAccent[600]}` }}
                          onClick={() => handleOpen(row)}
                        >
                          Update
                        </Button>
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

export default CROforInvestment;
