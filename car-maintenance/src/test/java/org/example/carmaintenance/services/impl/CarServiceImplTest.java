package org.example.carmaintenance.services.impl;

import org.example.carmaintenance.dtos.requests.CarRequest;
import org.example.carmaintenance.dtos.requests.CarResponse;
import org.example.carmaintenance.models.Car;
import org.example.carmaintenance.models.User;
import org.example.carmaintenance.repositories.AppointmentRepository;
import org.example.carmaintenance.repositories.CarRepository;
import org.example.carmaintenance.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CarServiceImplTest {

    @Mock
    private CarRepository carRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @InjectMocks
    private CarServiceImpl carService;

    private Car buildCar(long id, String name) {
        Car car = new Car();
        car.setId(id);
        car.setName(name);
        car.setYear(2020);
        car.setColor("Blue");
        car.setVin("VIN" + id);
        return car;
    }

    @Test
    void saveCar_attachesUserAndReturnsResponse() {
        CarRequest request = new CarRequest(null, "Civic", 2020, "Blue", "VIN1", 5L);
        User user = new User();
        when(userRepository.getReferenceById(5L)).thenReturn(user);
        when(carRepository.save(any(Car.class))).thenReturn(buildCar(1L, "Civic"));

        CarResponse response = carService.saveCar(request);

        ArgumentCaptor<Car> captor = ArgumentCaptor.forClass(Car.class);
        verify(carRepository).save(captor.capture());
        assertSame(user, captor.getValue().getUser());
        assertEquals("Civic", captor.getValue().getName());
        assertEquals(1L, response.id());
        assertEquals("Civic", response.name());
    }

    @Test
    void getAllCars_returnsMappedCars() {
        when(carRepository.findByUserId(5L))
                .thenReturn(List.of(buildCar(1L, "Civic"), buildCar(2L, "Accord")));

        List<CarResponse> responses = carService.getAllCars(5L);

        assertEquals(2, responses.size());
        assertEquals("Civic", responses.get(0).name());
        assertEquals("Accord", responses.get(1).name());
    }

    @Test
    void getAllCars_returnsEmptyListWhenNoCars() {
        when(carRepository.findByUserId(5L)).thenReturn(List.of());

        assertEquals(0, carService.getAllCars(5L).size());
    }

    @Test
    void deleteCar_deletesAppointmentsBeforeCar() {
        carService.deleteCar(1L);

        InOrder inOrder = inOrder(appointmentRepository, carRepository);
        inOrder.verify(appointmentRepository).deleteByCarId(1L);
        inOrder.verify(carRepository).deleteById(1L);
    }

    @Test
    void updateCar_updatesFieldsAndSaves() {
        Car existing = buildCar(1L, "Civic");
        CarRequest request = new CarRequest(1L, "Accord", 2022, "Red", "NEWVIN", 5L);
        when(carRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(carRepository.save(existing)).thenReturn(existing);

        CarResponse response = carService.updateCar(request);

        assertEquals("Accord", response.name());
        assertEquals(2022, response.year());
        assertEquals("Red", response.color());
        assertEquals("NEWVIN", response.vin());
    }

    @Test
    void updateCar_throwsWhenCarNotFound() {
        CarRequest request = new CarRequest(99L, "Accord", 2022, "Red", "NEWVIN", 5L);
        when(carRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> carService.updateCar(request));
        verify(carRepository, never()).save(any(Car.class));
    }
}
