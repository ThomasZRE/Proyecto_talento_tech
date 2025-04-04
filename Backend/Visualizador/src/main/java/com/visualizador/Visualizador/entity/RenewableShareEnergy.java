package com.visualizador.Visualizador.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "01-renewable-share-energy")
@IdClass(RenewableShareEnergyId.class)
public class RenewableShareEnergy extends BaseRenewables {

    @Column(name = "Renewables (% equivalent primary energy)")
    private double renewablesPerc;

    public RenewableShareEnergy() {
    }

    public RenewableShareEnergy(double renewablesPerc) {
        this.renewablesPerc = renewablesPerc;
    }

    public double getRenewablesPerc() {
        return renewablesPerc;
    }
    public void setRenewablesPerc(double renewablesPerc) {
        this.renewablesPerc = renewablesPerc;
    }
}
