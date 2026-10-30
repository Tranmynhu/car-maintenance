package org.example.carmaintenance.services.impl;

import org.example.carmaintenance.dtos.requests.CarRequest;
import org.example.carmaintenance.dtos.requests.CarResponse;
import org.example.carmaintenance.models.Car;
import org.example.carmaintenance.models.User;
import org.example.carmaintenance.repositories.CarRepository;
import org.example.carmaintenance.repositories.UserRepository;
import org.example.carmaintenance.services.CarService;
import org.example.carmaintenance.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.example.carmaintenance.dtos.mappers.CarMapper.mapFromRequest;
import static org.example.carmaintenance.dtos.mappers.CarMapper.mapToCarResponse;
import static org.example.carmaintenance.dtos.mappers.CarMapper.mapToCarResponseList;

@Service
public class CarServiceImpl implements CarService {

    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public CarServiceImpl(CarRepository carRepository,
                          UserRepository userRepository) {
        this.carRepository = carRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CarResponse saveCar(CarRequest carRequest) {
        Car car = mapFromRequest(carRequest);

        User user = userRepository.getReferenceById(carRequest.userId());
        car.setUser(user);

        Car savedCar = carRepository.save(car);

        return mapToCarResponse(savedCar);
    }

    @Override
    public List<CarResponse> getAllCars(long userId) {
        List<Car> cars = carRepository.findByUserId(userId);

        return mapToCarResponseList(cars);
    }

    @Override
    public void deleteCar(long id) {
        carRepository.deleteById(id);
    }

    @Override
    public CarResponse updateCar(CarRequest carRequest) {
        Car car = carRepository.findById(carRequest.id()).orElseThrow();
        car.setName(carRequest.name());
        car.setYear(carRequest.year());
        car.setColor(carRequest.color());
        car.setVin(carRequest.vin());

        Car savedCar = carRepository.save(car);

        return mapToCarResponse(savedCar);
    }
}
