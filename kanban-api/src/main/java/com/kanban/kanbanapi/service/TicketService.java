package com.kanban.kanbanapi.service;

import com.kanban.kanbanapi.dto.ColumnDTO;
import com.kanban.kanbanapi.dto.TicketDTO;
import com.kanban.kanbanapi.entity.Ticket;
import com.kanban.kanbanapi.repository.TicketRepository;
import java.util.ArrayList;
import java.util.Arrays;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {
    @Autowired
    private TicketRepository ticketRepository;

    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll().stream()
            .map(TicketDTO::new)
            .collect(Collectors.toList());
    }

    public TicketDTO getTicketById(Long id) {
        return ticketRepository.findById(id)
            .map(TicketDTO::new)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public TicketDTO createTicket(TicketDTO ticketDTO) {
        Ticket ticket = ticketDTO.toEntity();
        ticket.setId(null); // Let DB generate ID
        Ticket saved = ticketRepository.save(ticket);
        return new TicketDTO(saved);
    }

    public TicketDTO updateTicket(Long id, TicketDTO ticketDTO) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setTitle(ticketDTO.getTitle());
        ticket.setDescription(ticketDTO.getDescription());
        ticket.setPriority(Ticket.Priority.valueOf(ticketDTO.getPriority().toUpperCase()));
        ticket.setStatus(Ticket.Status.valueOf(ticketDTO.getStatus().toUpperCase()));

        Ticket updated = ticketRepository.save(ticket);
        return new TicketDTO(updated);
    }

    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }

    public List<TicketDTO> getTicketsByStatus(String status) {
        Ticket.Status enumStatus = Ticket.Status.valueOf(status.toUpperCase());
        return ticketRepository.findByStatus(enumStatus).stream()
            .map(TicketDTO::new)
            .collect(Collectors.toList());
    }

    public List<ColumnDTO> getColumns(){
        List<ColumnDTO> columns = new ArrayList<>();
        for (Ticket.Status status : Ticket.Status.values()) {
            String statusId = status.toString().toLowerCase();
            String title =  Arrays.stream(status.toString().split("_"))
                .map(word -> word.substring(0, 1).toUpperCase()
                             + word.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));

            columns.add(new ColumnDTO(statusId, title));
        }
        return columns;
    }
}