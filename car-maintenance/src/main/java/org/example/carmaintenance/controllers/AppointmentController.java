package org.example.carmaintenance.controllers;

import org.example.carmaintenance.dtos.requests.AppointmentRequest;
import org.example.carmaintenance.dtos.responses.AppointmentResponse;
import org.example.carmaintenance.services.AppointmentService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// SOLID - Dependency Inversion: depends on the AppointmentService interface, not its implementation.
@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public AppointmentResponse saveAppointment(@RequestBody AppointmentRequest appointmentRequest) {
        return appointmentService.saveAppointment(appointmentRequest);
    }

    @GetMapping
    public List<AppointmentResponse> getAllAppointments(@RequestParam long userId) {
        return appointmentService.getAllAppointments(userId);
    }

    @PutMapping
    public AppointmentResponse updateAppointment(@RequestBody AppointmentRequest appointmentRequest) {
        return appointmentService.updateAppointment(appointmentRequest);
    }

    @DeleteMapping
    public void deleteAppointment(@RequestParam long id) {
        appointmentService.deleteAppointment(id);
    }
}
