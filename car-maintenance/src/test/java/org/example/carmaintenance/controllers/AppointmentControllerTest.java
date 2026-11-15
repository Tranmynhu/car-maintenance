package org.example.carmaintenance.controllers;

import org.example.carmaintenance.dtos.requests.AppointmentRequest;
import org.example.carmaintenance.dtos.responses.AppointmentResponse;
import org.example.carmaintenance.services.AppointmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
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
public class AppointmentControllerTest {

    private static final String APPOINTMENT_JSON =
            "{\"id\":10,\"carId\":1,\"date\":\"2026-05-01\",\"description\":\"Oil change\"}";

    private static final AppointmentResponse RESPONSE =
            new AppointmentResponse(10L, 1L, "Civic", LocalDate.of(2026, 5, 1), "Oil change");

    @Mock
    private AppointmentService appointmentService;

    @InjectMocks
    private AppointmentController appointmentController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(appointmentController).build();
    }

    @Test
    void saveAppointment_returnsSavedAppointment() throws Exception {
        when(appointmentService.saveAppointment(any(AppointmentRequest.class))).thenReturn(RESPONSE);

        mockMvc.perform(post("/api/appointment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(APPOINTMENT_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.carName").value("Civic"))
                .andExpect(jsonPath("$.description").value("Oil change"));
    }

    @Test
    void getAllAppointments_returnsAppointmentsForUser() throws Exception {
        when(appointmentService.getAllAppointments(5L)).thenReturn(List.of(RESPONSE));

        mockMvc.perform(get("/api/appointment").param("userId", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].carName").value("Civic"));
    }

    @Test
    void updateAppointment_returnsUpdatedAppointment() throws Exception {
        when(appointmentService.updateAppointment(any(AppointmentRequest.class))).thenReturn(RESPONSE);

        mockMvc.perform(put("/api/appointment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(APPOINTMENT_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.date").value("2026-05-01"));
    }

    @Test
    void deleteAppointment_callsService() throws Exception {
        mockMvc.perform(delete("/api/appointment").param("id", "10"))
                .andExpect(status().isOk());

        verify(appointmentService).deleteAppointment(10L);
    }

    @Test
    void getAllAppointments_returnsBadRequestWhenUserIdMissing() throws Exception {
        mockMvc.perform(get("/api/appointment"))
                .andExpect(status().isBadRequest());
    }
}
