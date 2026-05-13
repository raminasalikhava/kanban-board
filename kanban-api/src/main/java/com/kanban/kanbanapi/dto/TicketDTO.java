package com.kanban.kanbanapi.dto;

import com.kanban.kanbanapi.entity.Ticket;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketDTO {
    private Long id;
    private String title;
    private String description;
    private String priority;
    private String status;

    public TicketDTO(Ticket ticket) {
        this.id = ticket.getId();
        this.title = ticket.getTitle();
        this.description = ticket.getDescription();
        this.priority = ticket.getPriority().toString().toLowerCase();
        this.status = ticket.getStatus().toString().toLowerCase();
    }

    public Ticket toEntity() {
        Ticket ticket = new Ticket();
        ticket.setId(this.id);
        ticket.setTitle(this.title);
        ticket.setDescription(this.description);
        ticket.setPriority(Ticket.Priority.valueOf(this.priority.toUpperCase()));
        ticket.setStatus(Ticket.Status.valueOf(this.status.toUpperCase()));
        return ticket;
    }
}