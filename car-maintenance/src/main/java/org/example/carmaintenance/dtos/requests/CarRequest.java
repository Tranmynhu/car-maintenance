package org.example.carmaintenance.dtos.requests;

public record CarRequest(Long id, String name, int year, String color, String vin, long userId) {}
