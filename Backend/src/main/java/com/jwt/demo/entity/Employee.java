package com.jwt.demo.entity;


import org.springframework.jdbc.core.RowMapper;

public class Employee {
    private String Mecode;
    private String Mename;
    private String DesigCode;
    private String Status;
    private String DeptCode;
    private String LocCode;
    private String JoiningDate;
    private String CRO;
    private String emailid;
    private String terminationdate;

 
   

    public String getMecode() {
        return Mecode;
    }

    public void setMecode(String mecode) {
        Mecode = mecode;
    }

    public String getMename() {
        return Mename;
    }

    public void setMename(String mename) {
        Mename = mename;
    }

    public String getDesigCode() {
        return DesigCode;
    }

    public void setDesigCode(String desigCode) {
        DesigCode = desigCode;
    }

    public String getStatus() {
        return Status;
    }

    public void setStatus(String status) {
        Status = status;
    }

    public String getDeptCode() {
        return DeptCode;
    }

    public void setDeptCode(String deptCode) {
        DeptCode = deptCode;
    }

    public String getLocCode() {
        return LocCode;
    }

    public void setLocCode(String locCode) {
        LocCode = locCode;
    }

    public String getJoiningDate() {
        return JoiningDate;
    }

    public void setJoiningDate(String joiningDate) {
        JoiningDate = joiningDate;
    }

    public String getCRO() {
        return CRO;
    }

    public void setCRO(String cRO) {
        CRO = cRO;
    }

    public String getEmailid() {
        return emailid;
    }

    public void setEmailid(String emailid) {
        this.emailid = emailid;
    }

    public String getTerminationdate() {
        return terminationdate;
    }

    public void setTerminationdate(String terminationdate) {
        this.terminationdate = terminationdate;
    }

    public Employee(String mecode, String mename, String desigCode, String status, String deptCode, String locCode,
            String joiningDate, String cRO, String emailid, String terminationdate) {
        Mecode = mecode;
        Mename = mename;
        DesigCode = desigCode;
        Status = status;
        DeptCode = deptCode;
        LocCode = locCode;
        this.JoiningDate = joiningDate;
        this.CRO = cRO;
        this.emailid = emailid;
        this.terminationdate = terminationdate;
    }

    public Employee() {
    }

    public static RowMapper<Employee> rowMapper = (rs, rowNum) -> {

        Employee employee = new Employee();
        employee.setMecode(rs.getString("Mecode"));
        employee.setMename(rs.getString("Mename"));
        employee.setDesigCode(rs.getString("DesigCode"));
        employee.setStatus(rs.getString("Status"));
        employee.setDeptCode(rs.getString("DeptCode"));
        employee.setLocCode(rs.getString("LocCode"));
        employee.setJoiningDate(rs.getString("JoiningDate"));
        employee.setCRO(rs.getString("CRO"));
        employee.setEmailid(rs.getString("emailid"));
        employee.setTerminationdate(rs.getString("terminationdate"));

        return employee;
    };

    public static final RowMapper<Employee> rowMapper2 = (rs, rowNum) -> {
        Employee employee = new Employee();
        employee.setMecode(rs.getString("Mecode"));
        employee.setMename(rs.getString("Mename"));
        return employee;
    };




    @Override
    public String toString() {
        return "Employee [Mecode=" + Mecode + ", Mename=" + Mename + ", DesigCode=" + DesigCode + ", Status=" + Status
                + ", DeptCode=" + DeptCode + ", LocCode=" + LocCode + ", JoiningDate=" + JoiningDate + ", CRO=" + CRO
                + ", emailid=" + emailid + ", terminationdate=" + terminationdate + "]";
    }


}
