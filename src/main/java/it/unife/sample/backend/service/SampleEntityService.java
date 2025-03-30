package it.unife.sample.backend.service;

import it.unife.sample.backend.model.SampleEntity;
import it.unife.sample.backend.repository.SampleEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SampleEntityService {

    @Autowired
    private SampleEntityRepository repository;

    public List<SampleEntity> findAll() {
        return repository.findAll();
    }

    public Optional<SampleEntity> findById(UUID id) {
        return repository.findById(id);
    }

    public SampleEntity save(SampleEntity entity) {
        return repository.save(entity);
    }

    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}