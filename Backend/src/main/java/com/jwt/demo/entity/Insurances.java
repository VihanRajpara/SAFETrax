package com.jwt.demo.entity;

import org.springframework.jdbc.core.RowMapper;

public class Insurances {
private String user_id;
private String mid;
private String menu;
private String smid;
private String small_menu;
private String mmid;
private String micro_menu;
private String project;
private String action;
private String menuicon;
public String getUser_id() {
    return user_id;
}
public void setUser_id(String user_id) {
    this.user_id = user_id;
}
public String getMid() {
    return mid;
}
public void setMid(String mid) {
    this.mid = mid;
}
public String getMenu() {
    return menu;
}
public void setMenu(String menu) {
    this.menu = menu;
}
public String getSmid() {
    return smid;
}
public void setSmid(String smid) {
    this.smid = smid;
}
public String getSmall_menu() {
    return small_menu;
}
public void setSmall_menu(String small_menu) {
    this.small_menu = small_menu;
}
public String getMmid() {
    return mmid;
}
public void setMmid(String mmid) {
    this.mmid = mmid;
}
public String getMicro_menu() {
    return micro_menu;
}
public void setMicro_menu(String micro_menu) {
    this.micro_menu = micro_menu;
}
public String getProject() {
    return project;
}
public void setProject(String project) {
    this.project = project;
}
public String getAction() {
    return action;
}
public void setAction(String action) {
    this.action = action;
}
public String getMenuicon() {
    return menuicon;
}
public void setMenuicon(String menuicon) {
    this.menuicon = menuicon;
}
public Insurances(String user_id, String mid, String menu, String smid, String small_menu, String mmid,
        String micro_menu, String project, String action, String menuicon) {
    this.user_id = user_id;
    this.mid = mid;
    this.menu = menu;
    this.smid = smid;
    this.small_menu = small_menu;
    this.mmid = mmid;
    this.micro_menu = micro_menu;
    this.project = project;
    this.action = action;
    this.menuicon = menuicon;
}
public Insurances() {
}
   
  public static RowMapper<Insurances> rowMapper = (rs, rowNum) -> {

           Insurances insurances = new Insurances();
           insurances.setUser_id(rs.getString("user_id"));
           insurances.setMid(rs.getString("mid"));
           insurances.setMenu(rs.getString("menu"));
           insurances.setSmid(rs.getString("smid"));
           insurances.setSmall_menu(rs.getString("small_menu"));
           insurances.setMmid(rs.getString("mmid"));
           insurances.setMicro_menu(rs.getString("micro_menu"));
           insurances.setProject(rs.getString("project"));
           insurances.setAction(rs.getString("action"));
           insurances.setMenuicon(rs.getString("menuicon"));
           return insurances;
	    };
    
}
