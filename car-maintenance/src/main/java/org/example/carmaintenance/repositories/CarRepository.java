package org.example.carmaintenance.repositories;

import org.example.carmaintenance.models.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByUserId(long userId);
}
