package org.example.carmaintenance.services;

import org.example.carmaintenance.dtos.requests.AppointmentRequest;
import org.example.carmaintenance.dtos.responses.AppointmentResponse;

import java.util.List;

public interface AppointmentService {
    AppointmentResponse saveAppointment(AppointmentRequest appointmentRequest);

    List<AppointmentResponse> getAllAppointments(long userId);

    void deleteAppointment(long id);

    AppointmentResponse updateAppointment(AppointmentRequest appointmentRequest);
}
