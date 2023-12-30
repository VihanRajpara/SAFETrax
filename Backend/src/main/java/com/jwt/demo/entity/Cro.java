package com.jwt.demo.entity;

import java.sql.ResultSet;

import org.springframework.jdbc.core.RowMapper;

public class Cro {

    private String Employee_Code;
    private String Employee_Name;
    private String Employee_CRO;
    private String CRO_Name;

    

    @Override
    public String toString() {
        return "Cro [Employee_Code=" + Employee_Code + ", Employee_Name=" + Employee_Name + ", Employee_CRO="
                + Employee_CRO + ", CRO_Name=" + CRO_Name + "]";
    }

    public String getCRO_Name() {
        return CRO_Name;
    }

    public void setCRO_Name(String cRO_Name) {
        CRO_Name = cRO_Name;
    }

    public String getEmployee_Code() {
        return Employee_Code;
    }

    public void setEmployee_Code(String employee_Code) {
        Employee_Code = employee_Code;
    }

    public String getEmployee_Name() {
        return Employee_Name;
    }

    public void setEmployee_Name(String employee_Name) {
        Employee_Name = employee_Name;
    }

    public String getEmployee_CRO() {
        return Employee_CRO;
    }

    public void setEmployee_CRO(String employee_CRO) {
        Employee_CRO = employee_CRO;
    }

    public static RowMapper<Cro> rowMapper = (ResultSet rs, int rowNum) -> {
        Cro cro = new Cro();
        cro.setEmployee_Code(rs.getString("Employee_Code"));
        cro.setEmployee_Name(rs.getString("Employee_Name"));
        cro.setEmployee_CRO(rs.getString("Employee_CRO"));
        cro.setCRO_Name(rs.getString("CRO_Name"));
        return cro;
    };
}
