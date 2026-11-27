package org.example.carmaintenance.services.impl;

import org.example.carmaintenance.dtos.responses.ServiceHistoryResponse;
import org.example.carmaintenance.services.HistoryService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
public class HistoryServiceImpl implements HistoryService {

    // We will use mock data instead of real db call
    @Override
    public List<ServiceHistoryResponse> getAllServiceHistories(long carId) {
        LocalDate now = LocalDate.now();
        String location = "Toyota Dealership";

        return Arrays.asList(
          new ServiceHistoryResponse("Tire Rotation", now, location),
                new ServiceHistoryResponse("Brake Inspection", now, location),
                new ServiceHistoryResponse("Oil Change", now, location)
        );
    }
}
