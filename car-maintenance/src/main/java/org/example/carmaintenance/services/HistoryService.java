package org.example.carmaintenance.services;

import org.example.carmaintenance.dtos.responses.ServiceHistoryResponse;

import java.util.List;

public interface HistoryService {
    List<ServiceHistoryResponse> getAllServiceHistories(long carId);
}
