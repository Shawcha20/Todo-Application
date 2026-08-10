using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

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
        var todo= await _todoService.updateTodoId(id,req);
        if(todo==null) return NotFound();
        return Ok(todo);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> deleteTodo(string id)
    {
        var todo=await _todoService.DeleteTodo(id);
        if(todo==null) return NotFound();
        return Ok(todo);
    }
}