package org.example.carmaintenance.dtos.mappers;

import org.example.carmaintenance.dtos.responses.AppointmentResponse;
import org.example.carmaintenance.models.Appointment;
import org.example.carmaintenance.models.Car;

import java.util.List;

// SOLID - Single Responsibility: this class only converts appointments to response DTOs.
public class AppointmentMapper {
    public static AppointmentResponse mapToAppointmentResponse(Appointment appointment) {
        Car car = appointment.getCar();

        return new AppointmentResponse(
                appointment.getId(),
                car.getId(),
                car.getName(),
                appointment.getDate(),
                appointment.getDescription());
    }

    public static List<AppointmentResponse> mapToAppointmentResponseList(List<Appointment> appointments) {
        return appointments.stream()
                .map(AppointmentMapper::mapToAppointmentResponse)
                .toList();
    }
}
