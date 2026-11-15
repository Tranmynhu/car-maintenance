package org.example.carmaintenance.dtos.requests;

import java.time.LocalDate;

public record AppointmentRequest(Long id, long carId, LocalDate date, String description) {}
