package org.example.carmaintenance.services;

import org.example.carmaintenance.dtos.requests.AppointmentRequest;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class AppointmentValidatorTest {

    private final AppointmentValidator validator = new AppointmentValidator();

    @Test
    void validate_acceptsValidRequest() {
        AppointmentRequest request = new AppointmentRequest(null, 1L, LocalDate.of(2026, 5, 1), "Oil change");

        assertDoesNotThrow(() -> validator.validate(request));
    }

    @Test
    void validate_rejectsMissingDate() {
        AppointmentRequest request = new AppointmentRequest(null, 1L, null, "Oil change");

        assertThrows(IllegalArgumentException.class, () -> validator.validate(request));
    }

    @Test
    void validate_rejectsBlankDescription() {
        AppointmentRequest request = new AppointmentRequest(null, 1L, LocalDate.of(2026, 5, 1), "   ");

        assertThrows(IllegalArgumentException.class, () -> validator.validate(request));
    }

    @Test
    void validate_rejectsNullDescription() {
        AppointmentRequest request = new AppointmentRequest(null, 1L, LocalDate.of(2026, 5, 1), null);

        assertThrows(IllegalArgumentException.class, () -> validator.validate(request));
    }
}
