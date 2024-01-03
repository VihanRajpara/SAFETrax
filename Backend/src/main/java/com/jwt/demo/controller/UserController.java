package com.jwt.demo.controller;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jwt.demo.entity.Cro;
import com.jwt.demo.entity.CroUpdateRequest;
import com.jwt.demo.entity.Employee;
import com.jwt.demo.entity.Insurances;
import com.jwt.demo.entity.Menu;
import com.jwt.demo.entity.User_SafeTrax;
import com.jwt.demo.jwt.MessageResponse;

@RestController
@RequestMapping("/user")
@CrossOrigin("http://localhost:3000")
public class UserController {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    
    @Qualifier("hrmsJdbcTemplate")
    private  JdbcTemplate hrmsJdbcTemplate;


    // Get all Access menu->submenu->micromenu
    @GetMapping("/all")
    public List<Menu> getAllMenu() {
        StringBuilder sql = new StringBuilder();
        String id ="K8888";
        sql.append(
                "select ac.user_id,ac.mid AS menuid,m.menu,ac.smid AS smenuid,sm.name as small_menu,ac.mmid AS mmenuid,mm.name as micro_menu,mm.project, mm.action,m.menuicon  from accdtl ac "
                        + "inner join menu m on (ac.mid=m.menuid) inner join smenu sm on (ac.smid=sm.smenuid and ac.mid=sm.mid) "
                        + "inner join micromenu mm on (ac.mmid=mm.mmenuid and ac.mid=mm.menuid and ac.smid=mm.smenuid) "
                        + "where ac.user_id='")
                .append(id).append("' GROUP BY mm.mmenuid ORDER BY m.menu, sm.name, mm.name");
        return jdbcTemplate.query(sql.toString(), Menu.rowMapper);

    }

    // Get menu for perticuler perosn id
    @GetMapping("/{id}")
    public List<Menu> getMenu(@PathVariable String id) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(
                "select ac.user_id,ac.mid AS menuid,m.menu,ac.smid AS smenuid,sm.name as small_menu,ac.mmid AS mmenuid,mm.name as micro_menu,mm.project, mm.action,m.menuicon  from accdtl ac "
                        + "inner join menu m on (ac.mid=m.menuid) inner join smenu sm on (ac.smid=sm.smenuid and ac.mid=sm.mid) "
                        + "inner join micromenu mm on (ac.mmid=mm.mmenuid and ac.mid=mm.menuid and ac.smid=mm.smenuid) "
                        + "where ac.user_id='")
                .append(id).append("' GROUP BY mm.mmenuid ORDER BY m.menu, sm.name, mm.name");
        return jdbcTemplate.query(sqlBuilder.toString(), Menu.rowMapper);

    }
    
 // Update employee access
    @PostMapping("/update/{id}")
    public ResponseEntity<?> updateMenus(@PathVariable String id, @RequestBody List<Menu> updatedMenus) {
        // Check if the user_id exists in the database
    	System.out.println(updatedMenus);
    	System.out.println("ID is"+id);


        try {
 
            // Delete existing rows for the given user ID
            String deleteSql = "DELETE FROM accdtl WHERE user_id = ?";
            jdbcTemplate.update(deleteSql, id);  

            // Insert new set of menu IDs with the same user_id
            String insertSql = "INSERT INTO accdtl (user_id, mid, smid, mmid) VALUES (?, ?, ?, ?)";
            for (Menu updatedMenu : updatedMenus) {
                jdbcTemplate.update(
                        insertSql,
                        id,
                        updatedMenu.getMenu_id(),
                        updatedMenu.getSmall_menu_id(),
                        updatedMenu.getMicro_menu_id());
            }

            return ResponseEntity.ok(new MessageResponse("Data updated successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Error updating data"));
        }
    }
    
    
    
    
    
    
    
    

    // API for employess master table for insu page

    // Get all active employees  for menu 
    @GetMapping("/employees")
    public List<Employee> getEmployees() {
        StringBuilder sb = new StringBuilder();
        sb.append("select * from employee_master where DeptCode = 4 and status='Active'");
        return hrmsJdbcTemplate.query(sb.toString(), Employee.rowMapper);
    }

    // Get single employee by memcode
    @GetMapping("/employee/{mecode}")
    public Employee getEmployee(@PathVariable String mecode) {
        StringBuilder sb = new StringBuilder();
        sb.append("select * from employee_master where mecode = '").append(mecode).append("'");
        return hrmsJdbcTemplate.queryForObject(sb.toString(), Employee.rowMapper);
    } 
    
    // get all CRO -> for investment menu
    @GetMapping("/all-cro")
    public List<Employee> getAllCRO() {
        StringBuilder sb = new StringBuilder();
        sb.append("SELECT Mecode, Mename FROM employee_master WHERE DeptCode = 1 AND Status = 'Active';");

        return hrmsJdbcTemplate.query(sb.toString(), Employee.rowMapper2);
    }
    
    @GetMapping("/insurance/all-cro")
    public List<Employee> getINSURANCEAllCRO() {
        StringBuilder sb = new StringBuilder();
        sb.append("SELECT Mecode, Mename FROM employee_master WHERE DeptCode = 2 AND Status = 'Active';");

        return hrmsJdbcTemplate.query(sb.toString(), Employee.rowMapper2);
    }
    
    // get all investment CRO 's employees 
    @GetMapping("/rm")
    public List<Cro> getCRO() {

        StringBuilder sqlQuery = new StringBuilder();   
        sqlQuery.append("SELECT e1.Mecode AS Employee_Code, ")
                .append("e1.Mename AS Employee_Name, ")
                .append("e1.CRO AS Employee_CRO, ")
                .append("e2.Mename AS CRO_Name ")
                .append("FROM employee_master e1 ")
                .append("INNER JOIN employee_master e2 ON e1.CRO = e2.Mecode ")
                .append("WHERE e1.DeptCode=4 and e2.DeptCode=1 and e1.status ='Active'");
        return hrmsJdbcTemplate.query(sqlQuery.toString(),  Cro.rowMapper);
    }

    @PostMapping("/update-cro/{id}")
    public ResponseEntity<?> updateCRO(@PathVariable String id, @RequestBody CroUpdateRequest CRO) {
        String sql = "UPDATE employee_master SET CRO = ? WHERE Mecode = ?";
        System.out.println("Mecode: " + id);
        System.out.println("CRO: " + CRO.CRO());

        int rowsAffected = hrmsJdbcTemplate.update(sql, CRO.CRO(), id);

        if (rowsAffected > 0) {
            return ResponseEntity.ok(new MessageResponse("CRO updated successfully for Employee with Mecode: " + id));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Employee with Mecode: " + id + " not found or CRO not updated."));
        }
    }


    // Exception handler for DataAccessException
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<MessageResponse> handleDataAccessException(DataAccessException ex) {
        return ResponseEntity.badRequest().body(new MessageResponse("Database error: " + ex.getMessage()));
    }

    // Exception handler for SQLException
    @ExceptionHandler(SQLException.class)
    public ResponseEntity<MessageResponse> handleSQLException(SQLException ex) {
        return ResponseEntity.badRequest().body(new MessageResponse("SQL error: " + ex.getMessage()));
    }

}
