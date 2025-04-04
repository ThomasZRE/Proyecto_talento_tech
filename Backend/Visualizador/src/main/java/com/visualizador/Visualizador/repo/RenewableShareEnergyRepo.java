package com.visualizador.Visualizador.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.visualizador.Visualizador.entity.RenewableShareEnergy;
import com.visualizador.Visualizador.entity.RenewableShareEnergyId;

public interface RenewableShareEnergyRepo extends JpaRepository<RenewableShareEnergy, RenewableShareEnergyId> { 
    List<RenewableShareEnergy> findByCountryOrderByYear(String country);
}
