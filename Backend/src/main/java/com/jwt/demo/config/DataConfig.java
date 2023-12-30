package com.jwt.demo.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DataConfig {

    @Primary
    @Bean(name = "accessDataSource")
    public DataSource accessDataSource(){
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/acldb");
        config.setUsername("root");
        config.setPassword("vihan");
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        return new HikariDataSource(config);
    }

    @Primary
    @Bean(name = "accessJdbcTemplate")
    public JdbcTemplate accessJdbcTemplate(@Qualifier("accessDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    @Bean(name = "hrmsDataSource")
    public DataSource hrmsDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/hrms");
        config.setUsername("root");
        config.setPassword("vihan");
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");

        return new HikariDataSource(config);
    }

    @Bean(name = "hrmsJdbcTemplate")
    public JdbcTemplate hrmsJdbcTemplate(@Qualifier("hrmsDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
