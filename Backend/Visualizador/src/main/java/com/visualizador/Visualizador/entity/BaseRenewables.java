package com.visualizador.Visualizador.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class BaseRenewables {

    @Id 
    @Column(name = "Entity")
    protected String country;   // Entity column 
    
    @Column(name = "Code")
    protected String codex;     // code column

    @Id
    @Column(name = "Year")
    protected Integer year;

    /* 
    public BaseRenewables() {
    }

    public BaseRenewables(String country, String codex, Integer year) {
        this.country = country;
        this.codex = codex;
        this.year = year;
    }
    */

    public String getCodex() {
        return codex;
    }
    
    public void setCodex(String codex) {
        this.codex = codex;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

}
