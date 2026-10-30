package org.example.carmaintenance.controllers;

import org.example.carmaintenance.dtos.requests.CarRequest;
import org.example.carmaintenance.dtos.requests.CarResponse;
import org.example.carmaintenance.services.CarService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/car")
public class CarController {
    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @PostMapping
    public CarResponse saveCar(@RequestBody CarRequest carRequest) {
        return carService.saveCar(carRequest);
    }

    @GetMapping
    public List<CarResponse> getAllCars(@RequestParam long userId) {
        return carService.getAllCars(userId);
    }

    @DeleteMapping
    public void deleteCar(@RequestParam long id) {
        carService.deleteCar(id);
    }

    @PutMapping
    public CarResponse updateCar(@RequestBody CarRequest carRequest) {
        return carService.updateCar(carRequest);
    }
}
