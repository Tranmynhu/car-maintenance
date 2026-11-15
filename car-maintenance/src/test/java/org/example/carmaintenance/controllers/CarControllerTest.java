package org.example.carmaintenance.controllers;

import org.example.carmaintenance.dtos.requests.CarRequest;
import org.example.carmaintenance.dtos.requests.CarResponse;
import org.example.carmaintenance.services.CarService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class CarControllerTest {

    private static final String CAR_JSON =
            "{\"id\":1,\"name\":\"Civic\",\"year\":2020,\"color\":\"Blue\",\"vin\":\"VIN123\",\"userId\":5}";

    @Mock
    private CarService carService;

    @InjectMocks
    private CarController carController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(carController).build();
    }

    @Test
    void saveCar_returnsSavedCar() throws Exception {
        when(carService.saveCar(any(CarRequest.class)))
                .thenReturn(new CarResponse(1L, "Civic", 2020, "Blue", "VIN123"));

        mockMvc.perform(post("/api/car")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(CAR_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Civic"))
                .andExpect(jsonPath("$.vin").value("VIN123"));
    }

    @Test
    void getAllCars_returnsCarsForUser() throws Exception {
        when(carService.getAllCars(5L)).thenReturn(List.of(
                new CarResponse(1L, "Civic", 2020, "Blue", "VIN123"),
                new CarResponse(2L, "Accord", 2021, "Red", "VIN456")));

        mockMvc.perform(get("/api/car").param("userId", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Civic"))
                .andExpect(jsonPath("$[1].name").value("Accord"));
    }

    @Test
    void deleteCar_callsService() throws Exception {
        mockMvc.perform(delete("/api/car").param("id", "1"))
                .andExpect(status().isOk());

        verify(carService).deleteCar(1L);
    }

    @Test
    void updateCar_returnsUpdatedCar() throws Exception {
        when(carService.updateCar(any(CarRequest.class)))
                .thenReturn(new CarResponse(1L, "Civic", 2020, "Blue", "VIN123"));

        mockMvc.perform(put("/api/car")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(CAR_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.color").value("Blue"));
    }
}
