package com.visualizador.Visualizador.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.visualizador.Visualizador.entity.RenewableEnergyConsumption;
import com.visualizador.Visualizador.entity.RenewableEnergyConsumptionId;

public interface RenewableEnergyConsumptionRepo extends JpaRepository<RenewableEnergyConsumption, RenewableEnergyConsumptionId> { 
    List<RenewableEnergyConsumption> findByCountryOrderByYear(String country);
}
