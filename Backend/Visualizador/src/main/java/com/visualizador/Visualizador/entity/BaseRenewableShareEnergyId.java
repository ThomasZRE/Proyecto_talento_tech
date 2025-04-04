package com.visualizador.Visualizador.entity;

import java.io.Serializable;
import java.util.Objects;

public class BaseRenewableShareEnergyId implements Serializable{
    private String country;
    private Integer year;

    public BaseRenewableShareEnergyId() {
    }

    public BaseRenewableShareEnergyId(String country, Integer year) {
        this.country = country;
        this.year = year;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        BaseRenewableShareEnergyId that = (BaseRenewableShareEnergyId) o;
        return Objects.equals(country, that.country) && Objects.equals(year, that.year);
    }

    @Override
    public int hashCode() {
        return Objects.hash(country, year);
    }
}
