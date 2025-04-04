package com.visualizador.Visualizador.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "02-modern-renewable-energy-consumption")
@IdClass(RenewableEnergyConsumptionId.class)
public class RenewableEnergyConsumption extends BaseRenewables{

    @Column(name = "Solar Generation - TWh")
    private double solarGeneration; // Column solar generation -Twh

    @Column(name = "Wind Generation - TWh")
    private double windGeneration; // Column wind generation -Twh

    @Column(name = "Hydro Generation - TWh")
    private double hydroGeneration; // Column hydro generation -Twh


    public RenewableEnergyConsumption() {
    }

    public RenewableEnergyConsumption(double solarGeneration, double windGeneration, double hydroGeneration) {
        this.solarGeneration = solarGeneration;
        this.windGeneration = windGeneration;
        this.hydroGeneration = hydroGeneration;
    }

    public double getSolarGeneration() {
        return solarGeneration;
    }
    public void setSolarGeneration(double solarGeneration) {
        this.solarGeneration = solarGeneration;
    }

    public double getHydroGeneration() {
        return hydroGeneration;
    }
    
    public void setHydroGeneration(double hydroGeneration) {
        this.hydroGeneration = hydroGeneration;
    }

    public double getWindGeneration() {
        return windGeneration;
    }

    public void setWindGeneration(double windGeneration) {
        this.windGeneration = windGeneration;
    }
}
