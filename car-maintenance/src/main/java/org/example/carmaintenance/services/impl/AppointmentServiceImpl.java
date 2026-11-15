package org.example.carmaintenance.services.impl;

import org.example.carmaintenance.dtos.requests.AppointmentRequest;
import org.example.carmaintenance.dtos.responses.AppointmentResponse;
import org.example.carmaintenance.models.Appointment;
import org.example.carmaintenance.models.Car;
import org.example.carmaintenance.repositories.AppointmentRepository;
import org.example.carmaintenance.repositories.CarRepository;
import org.example.carmaintenance.services.AppointmentService;
import org.example.carmaintenance.services.AppointmentValidator;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.example.carmaintenance.dtos.mappers.AppointmentMapper.mapToAppointmentResponse;
import static org.example.carmaintenance.dtos.mappers.AppointmentMapper.mapToAppointmentResponseList;

// SOLID - Single Responsibility: validation and mapping live in AppointmentValidator and
// AppointmentMapper; this class only coordinates the repositories.
// SOLID - Dependency Inversion: the repositories and validator are received through the
// constructor instead of being created here, so tests can replace them with mocks.
@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final CarRepository carRepository;
    private final AppointmentValidator appointmentValidator;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  CarRepository carRepository,
                                  AppointmentValidator appointmentValidator) {
        this.appointmentRepository = appointmentRepository;
        this.carRepository = carRepository;
        this.appointmentValidator = appointmentValidator;
    }

    @Override
    public AppointmentResponse saveAppointment(AppointmentRequest appointmentRequest) {
        appointmentValidator.validate(appointmentRequest);

        Car car = carRepository.findById(appointmentRequest.carId()).orElseThrow();

        Appointment appointment = new Appointment();
        appointment.setCar(car);
        appointment.setDate(appointmentRequest.date());
        appointment.setDescription(appointmentRequest.description());

        return mapToAppointmentResponse(appointmentRepository.save(appointment));
    }

    @Override
    public List<AppointmentResponse> getAllAppointments(long userId) {
        return mapToAppointmentResponseList(appointmentRepository.findByCarUserIdOrderByDateAsc(userId));
    }

    @Override
    public void deleteAppointment(long id) {
        appointmentRepository.deleteById(id);
    }

    @Override
    public AppointmentResponse updateAppointment(AppointmentRequest appointmentRequest) {
        appointmentValidator.validate(appointmentRequest);

        Appointment appointment = appointmentRepository.findById(appointmentRequest.id()).orElseThrow();
        Car car = carRepository.findById(appointmentRequest.carId()).orElseThrow();

        appointment.setCar(car);
        appointment.setDate(appointmentRequest.date());
        appointment.setDescription(appointmentRequest.description());

        return mapToAppointmentResponse(appointmentRepository.save(appointment));
    }
}
