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

}