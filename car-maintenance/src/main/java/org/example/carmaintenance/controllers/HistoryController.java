package org.example.carmaintenance.controllers;

import org.example.carmaintenance.dtos.responses.ServiceHistoryResponse;
import org.example.carmaintenance.services.HistoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/service-history")
public class HistoryController {

    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public List<ServiceHistoryResponse> getAllServiceHistories(@RequestParam long carId) {
        return historyService.getAllServiceHistories(carId);
    }
}
