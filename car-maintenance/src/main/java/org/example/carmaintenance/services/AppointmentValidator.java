package org.example.carmaintenance.services;

import org.apache.commons.lang3.StringUtils;
import org.example.carmaintenance.dtos.requests.AppointmentRequest;
import org.springframework.stereotype.Component;

// SOLID - Single Responsibility: this class only validates appointment requests.
// The service no longer contains validation rules, so they change in one place.
@Component
public class AppointmentValidator {

    public void validate(AppointmentRequest appointmentRequest) {
        if (appointmentRequest.date() == null) {
            throw new IllegalArgumentException("Date cannot be empty");
        }

        if (StringUtils.isBlank(appointmentRequest.description())) {
            throw new IllegalArgumentException("Service description cannot be empty");
        }
    }
}
