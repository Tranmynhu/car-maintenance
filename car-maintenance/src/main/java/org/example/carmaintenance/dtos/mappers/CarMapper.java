package org.example.carmaintenance.dtos.mappers;

import org.example.carmaintenance.dtos.requests.CarRequest;
import org.example.carmaintenance.dtos.requests.CarResponse;
import org.example.carmaintenance.models.Car;

import java.util.List;

public class CarMapper {
    public static Car mapFromRequest(CarRequest carRequest) {
        Car car = new Car();
        car.setName(carRequest.name());
        car.setColor(carRequest.color());
        car.setYear(carRequest.year());
        car.setVin(carRequest.vin());

        return car;
    }

    public static List<CarResponse> mapToCarResponseList(List<Car> cars) {
        return cars.stream()
                .map(CarMapper::mapToCarResponse)
                .toList();
    }
    
    public static CarResponse mapToCarResponse(Car car) {
        return new CarResponse(car.getId(), car.getName(), car.getYear(), car.getColor(), car.getVin());
    }
}
