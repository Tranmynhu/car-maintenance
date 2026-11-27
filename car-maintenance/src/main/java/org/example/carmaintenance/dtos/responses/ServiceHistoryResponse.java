package org.example.carmaintenance.dtos.responses;

import java.time.LocalDate;

public record ServiceHistoryResponse(String title, LocalDate date, String location) {
}
