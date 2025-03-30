package it.unife.sample.backend.controller;

import it.unife.sample.backend.model.SampleEntity;
import it.unife.sample.backend.service.SampleEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/sample-entities")
public class SampleEntityController {

    @Autowired
    private SampleEntityService service;

    @GetMapping
    public List<SampleEntity> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SampleEntity> getById(@PathVariable UUID id) {
        Optional<SampleEntity> entity = service.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public SampleEntity create(@RequestBody SampleEntity entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SampleEntity> update(@PathVariable UUID id, @RequestBody SampleEntity entity) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        entity.setId(id);
        return ResponseEntity.ok(service.save(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}