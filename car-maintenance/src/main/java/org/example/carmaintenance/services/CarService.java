package org.example.carmaintenance.services;

import org.example.carmaintenance.dtos.requests.CarRequest;
import org.example.carmaintenance.dtos.requests.CarResponse;

import java.util.List;

public interface CarService {
    CarResponse saveCar(CarRequest carRequest);

    List<CarResponse> getAllCars(long userId);

    void deleteCar(long id);

    CarResponse updateCar(CarRequest carRequest);
}
