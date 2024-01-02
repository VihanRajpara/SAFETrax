package com.jwt.demo.entity;

import org.springframework.jdbc.core.RowMapper;

public class Menu {
	private String menu_id;
	private String menu;
	private String small_menu_id;
	private String small_menu;
	private String micro_menu_id;
	private String micro_menu;

	public String getMenu_id() {
		return menu_id;
	}

	public void setMenu_id(String menu_id) {
		this.menu_id = menu_id;
	}

	public String getSmall_menu_id() {
		return small_menu_id;
	}

	public void setSmall_menu_id(String small_menu_id) {
		this.small_menu_id = small_menu_id;
	}

	public String getMicro_menu_id() {
		return micro_menu_id;
	}

	public void setMicro_menu_id(String micro_menu_id) {
		this.micro_menu_id = micro_menu_id;
	}

	public String getMenu() {
		return menu;
	}

	public void setMenu(String menu) {
		this.menu = menu;
	}

	public String getSmall_menu() {
		return small_menu;
	}

	public void setSmall_menu(String small_menu) {
		this.small_menu = small_menu;
	}

	public String getMicro_menu() {
		return micro_menu;
	}

	public void setMicro_menu(String micro_menu) {
		this.micro_menu = micro_menu;
	}

	public static RowMapper<Menu> rowMapper = (rs, rowNum) -> {
		Menu menu = new Menu();
		menu.setMenu_id(rs.getString("menuid"));
		menu.setMenu(rs.getString("menu"));
		menu.setSmall_menu_id(rs.getString("smenuid"));
		menu.setSmall_menu(rs.getString("small_menu"));
		menu.setMicro_menu_id(rs.getString("mmenuid"));
		menu.setMicro_menu(rs.getString("micro_menu"));
		return menu;
	};

	@Override
	public String toString() {
		return "Menu [menu_id=" + menu_id + ", menu=" + menu + ", small_menu_id=" + small_menu_id + ", small_menu="
				+ small_menu + ", micro_menu_id=" + micro_menu_id + ", micro_menu=" + micro_menu + "]\n";
	}
	
}
