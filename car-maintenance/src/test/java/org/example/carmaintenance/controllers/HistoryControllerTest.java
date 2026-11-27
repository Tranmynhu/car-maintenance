package org.example.carmaintenance.controllers;

import org.example.carmaintenance.dtos.responses.ServiceHistoryResponse;
import org.example.carmaintenance.services.HistoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class HistoryControllerTest {

    @Mock
    HistoryService historyService;

    @InjectMocks
    HistoryController historyController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(historyController).build();
    }

    @Test
    void getAllServiceHistories_returnsHistoriesForCar() throws Exception {
        when(historyService.getAllServiceHistories(1L)).thenReturn(List.of(
                new ServiceHistoryResponse("Oil Change", LocalDate.of(2026, 1, 15), "Toyota Dealership"),
                new ServiceHistoryResponse("Tire Rotation", LocalDate.of(2025, 10, 2), "Main Street Auto")));

        mockMvc.perform(get("/api/service-history").param("carId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Oil Change"))
                .andExpect(jsonPath("$[0].date").value("2026-01-15"))
                .andExpect(jsonPath("$[0].location").value("Toyota Dealership"))
                .andExpect(jsonPath("$[1].title").value("Tire Rotation"));

        verify(historyService).getAllServiceHistories(1L);
    }

    @Test
    void getAllServiceHistories_returnsEmptyListWhenNoHistory() throws Exception {
        when(historyService.getAllServiceHistories(2L)).thenReturn(List.of());

        mockMvc.perform(get("/api/service-history").param("carId", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void getAllServiceHistories_missingCarId_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/service-history"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(historyService);
    }
}
