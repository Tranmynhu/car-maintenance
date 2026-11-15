package org.example.carmaintenance.repositories;

import org.example.carmaintenance.models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCarUserIdOrderByDateAsc(long userId);
}
