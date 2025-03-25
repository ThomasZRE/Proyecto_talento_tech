package com.visualizador.Visualizador.controller;

import org.springframework.web.bind.annotation.RestController;

import com.visualizador.Visualizador.entity.RenewableShareEnergy;
import com.visualizador.Visualizador.repo.RenewableShareEnergyRepo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@CrossOrigin(origins = "*")
public class RenewableShareEnergyController {

    @Autowired
    private RenewableShareEnergyRepo repo;

    @GetMapping("/timeline/{country}")
    public List<RenewableShareEnergy> getTimelineData(@PathVariable String country) {
        return repo.findByCountryOrderByYear(country);
    }

    @GetMapping("/test")
    public String test() {
        return "API working";
    }

    @GetMapping("/count")
    public long count() {
        return repo.count();
    }
    
}
