package com.visualizador.Visualizador.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.visualizador.Visualizador.entity.RenewableEnergyConsumption;
import com.visualizador.Visualizador.repo.RenewableEnergyConsumptionRepo;

@RestController
public class RenewableEnergyConsumptionController {

    @Autowired
    private RenewableEnergyConsumptionRepo repo;

    @GetMapping("/renewables-consumption/")
    public String test() {
        return "Test";
    }

    @GetMapping("/renewables-consumption/{country}")
    public List<RenewableEnergyConsumption> getRenewablesConsumption(@PathVariable String country) {
        return repo.findByCountryOrderByYear(country);
    }
    
}
