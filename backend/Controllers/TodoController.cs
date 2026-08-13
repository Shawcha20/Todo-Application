using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodoController: ControllerBase
{
    private readonly TodoService _todoService;
    public TodoController(TodoService todoService)
    {
        _todoService=todoService;
    }
    [HttpGet]
    public async Task<IActionResult> GetAllTodos()
    {
        var todos= await _todoService.GetAllTodosList();
        return Ok(todos);
    }
    [HttpPost]
    public async Task<IActionResult>CreateTodo(CreateTodoReq req)
    {
        var todo= await _todoService.CreateTodo(req);
        return Ok(todo);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult>getTodoId(string id)
    {
        if(!ObjectId.TryParse(id, out _))
        {
            return BadRequest("Invalid todo id");
        }
        var todo= await _todoService.getTodoId(id);
        if (todo==null)
        {
            return NotFound();
        }
        return Ok(todo);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult>PutTodo(string id, Updatetodo req)
    {
        if (!ObjectId.TryParse(id, out _))
    {
        return BadRequest("Invalid Todo ID.");
    }

        var todo= await _todoService.updateTodoId(id,req);
        if(todo==null) return NotFound();
        return Ok(todo);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> deleteTodo(string id)
    {
        if(!ObjectId.TryParse(id, out _))
        {
            return BadRequest("invalid todo id");
        }
        var todo=await _todoService.DeleteTodo(id);
        if(!todo) return NotFound();
        return Ok(todo);
    }
}