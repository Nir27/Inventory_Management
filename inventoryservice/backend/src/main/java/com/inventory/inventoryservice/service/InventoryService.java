package com.inventory.inventoryservice.service;

import com.inventory.inventoryservice.model.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface InventoryService {

    Inventory addInventory(Inventory inventory);

    Optional<Inventory> findInventory(Integer inveId);

    void updateInventory(Inventory inventory,Integer inveId);

    Page<Inventory> searchInventory(List<String> brands, List<String> types, String description,Pageable pageable);

   void deleteInventory(List<Integer> inveId);
}
