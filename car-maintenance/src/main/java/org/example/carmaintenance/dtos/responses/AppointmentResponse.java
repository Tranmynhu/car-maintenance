package org.example.carmaintenance.dtos.responses;

import java.time.LocalDate;

public record AppointmentResponse(long id, long carId, String carName, LocalDate date, String description) {}
