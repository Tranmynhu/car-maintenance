package org.example.carmaintenance.services.impl;

import org.example.carmaintenance.dtos.requests.AppointmentRequest;
import org.example.carmaintenance.dtos.responses.AppointmentResponse;
import org.example.carmaintenance.models.Appointment;
import org.example.carmaintenance.models.Car;
import org.example.carmaintenance.repositories.AppointmentRepository;
import org.example.carmaintenance.repositories.CarRepository;
import org.example.carmaintenance.services.AppointmentValidator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AppointmentServiceImplTest {

    private static final LocalDate DATE = LocalDate.of(2026, 5, 1);

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private CarRepository carRepository;

    @Mock
    private AppointmentValidator appointmentValidator;

    @InjectMocks
    private AppointmentServiceImpl appointmentService;

    private Car buildCar(long id, String name) {
        Car car = new Car();
        car.setId(id);
        car.setName(name);
        return car;
    }

    private Appointment buildAppointment(long id, Car car, String description) {
        Appointment appointment = new Appointment();
        appointment.setId(id);
        appointment.setCar(car);
        appointment.setDate(DATE);
        appointment.setDescription(description);
        return appointment;
    }

    @Test
    void saveAppointment_savesWithCarAndReturnsResponse() {
        Car car = buildCar(1L, "Civic");
        AppointmentRequest request = new AppointmentRequest(null, 1L, DATE, "Oil change");
        when(carRepository.findById(1L)).thenReturn(Optional.of(car));
        when(appointmentRepository.save(any(Appointment.class)))
                .thenReturn(buildAppointment(10L, car, "Oil change"));

        AppointmentResponse response = appointmentService.saveAppointment(request);

        ArgumentCaptor<Appointment> captor = ArgumentCaptor.forClass(Appointment.class);
        verify(appointmentRepository).save(captor.capture());
        assertSame(car, captor.getValue().getCar());
        assertEquals(DATE, captor.getValue().getDate());
        assertEquals("Oil change", captor.getValue().getDescription());
        assertEquals(10L, response.id());
        assertEquals("Civic", response.carName());
    }

    @Test
    void saveAppointment_doesNotSaveWhenValidationFails() {
        AppointmentRequest request = new AppointmentRequest(null, 1L, null, "Oil change");
        doThrow(new IllegalArgumentException()).when(appointmentValidator).validate(request);

        assertThrows(IllegalArgumentException.class, () -> appointmentService.saveAppointment(request));
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void saveAppointment_throwsWhenCarNotFound() {
        AppointmentRequest request = new AppointmentRequest(null, 99L, DATE, "Oil change");
        when(carRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> appointmentService.saveAppointment(request));
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void getAllAppointments_returnsMappedAppointments() {
        Car car = buildCar(1L, "Civic");
        when(appointmentRepository.findByCarUserIdOrderByDateAsc(5L))
                .thenReturn(List.of(buildAppointment(1L, car, "Oil change"),
                        buildAppointment(2L, car, "Brakes")));

        List<AppointmentResponse> responses = appointmentService.getAllAppointments(5L);

        assertEquals(2, responses.size());
        assertEquals("Oil change", responses.get(0).description());
        assertEquals("Brakes", responses.get(1).description());
    }

    @Test
    void deleteAppointment_deletesById() {
        appointmentService.deleteAppointment(1L);

        verify(appointmentRepository).deleteById(1L);
    }

    @Test
    void updateAppointment_updatesFieldsAndSaves() {
        Car oldCar = buildCar(1L, "Civic");
        Car newCar = buildCar(2L, "Accord");
        Appointment existing = buildAppointment(10L, oldCar, "Oil change");
        AppointmentRequest request = new AppointmentRequest(10L, 2L, LocalDate.of(2026, 6, 1), "Brakes");
        when(appointmentRepository.findById(10L)).thenReturn(Optional.of(existing));
        when(carRepository.findById(2L)).thenReturn(Optional.of(newCar));
        when(appointmentRepository.save(existing)).thenReturn(existing);

        AppointmentResponse response = appointmentService.updateAppointment(request);

        assertEquals("Accord", response.carName());
        assertEquals(LocalDate.of(2026, 6, 1), response.date());
        assertEquals("Brakes", response.description());
    }

    @Test
    void updateAppointment_throwsWhenAppointmentNotFound() {
        AppointmentRequest request = new AppointmentRequest(99L, 1L, DATE, "Oil change");
        when(appointmentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> appointmentService.updateAppointment(request));
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void updateAppointment_doesNotSaveWhenValidationFails() {
        AppointmentRequest request = new AppointmentRequest(10L, 1L, DATE, " ");
        doThrow(new IllegalArgumentException()).when(appointmentValidator).validate(request);

        assertThrows(IllegalArgumentException.class, () -> appointmentService.updateAppointment(request));
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }
}
