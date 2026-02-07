package com.taskboard;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Response;

@Path("/api/tasks")
public class TaskResource {

    @GET
    public List<Task> list() {
        return Task.listAll();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        Task task = Task.findById(id);
        if (task == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(task).build();
    }

    @POST
    @Transactional
    public Response create(Task task) {
        task.id = null;
        if (task.createdAt == null || task.createdAt.isBlank()) {
            task.createdAt = Instant.now().toString();
        }
        task.persist();
        return Response.status(Response.Status.CREATED).entity(task).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, Task incoming) {
        Task task = Task.findById(id);
        if (task == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        task.title = incoming.title;
        task.category = incoming.category;
        task.description = incoming.description;
        task.completed = incoming.completed;
        task.createdAt = incoming.createdAt;
        return Response.ok(task).build();
    }

    @PATCH
    @Path("/{id}")
    @Transactional
    public Response patch(@PathParam("id") Long id, Map<String, Object> fields) {
        Task task = Task.findById(id);
        if (task == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (fields.containsKey("title")) {
            task.title = (String) fields.get("title");
        }
        if (fields.containsKey("category")) {
            task.category = (String) fields.get("category");
        }
        if (fields.containsKey("description")) {
            task.description = (String) fields.get("description");
        }
        if (fields.containsKey("completed")) {
            task.completed = (Boolean) fields.get("completed");
        }
        if (fields.containsKey("createdAt")) {
            task.createdAt = (String) fields.get("createdAt");
        }
        return Response.ok(task).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        Task task = Task.findById(id);
        if (task == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        task.delete();
        return Response.noContent().build();
    }
}
