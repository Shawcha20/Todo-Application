using backend.Models;
using backend.Settings;
using Microsoft.Extensions.Options;
using Microsoft.VisualBasic;
using MongoDB.Bson;
using MongoDB.Driver;
namespace backend.Services;
public class TodoService
{
    private readonly IMongoCollection<Todo> _todos;

    public TodoService(IOptions<MongoDbSettings> settings)
    {
        var mongoClient= new MongoClient(settings.Value.ConnectionString);
        var mongoDatabase= mongoClient.GetDatabase(settings.Value.DatabaseName);
        _todos=mongoDatabase.GetCollection<Todo>(settings.Value.CollectionName);
    }
    public async Task<List<Todo>> GetAllTodosList()
    {
        var todos= await _todos.Find(_=>true).ToListAsync();
        return todos;
    }
    public async Task<Todo> CreateTodo(CreateTodoReq req)
    {
        var todo= new Todo
        {
            Title= req.title,
            Description=req.description,
            isCompleted=false,
            CreatedAt=DateTime.UtcNow
        };
        await _todos.InsertOneAsync(todo);
        return todo;
    }
    public async Task<Todo?> getTodoId(string id)
    {
        var objectId= ObjectId.Parse(id);
        var todo= await _todos.Find(todo=>todo.ID==objectId).FirstOrDefaultAsync();
        return todo;
    }
    public async Task<Todo> updateTodoId(string id, Updatetodo req)
    {
        var objectId= ObjectId.Parse(id);
        var existingTodo= await _todos.Find(todo=>todo.ID==objectId).FirstOrDefaultAsync();
        if(existingTodo==null) return null;
        var update=Builders<Todo>.Update.Set(todo=>todo.Title,req.title).Set(todo=>todo.Description, req.description).Set(todo=>todo.isCompleted,req.IsCompleted);
        await _todos.UpdateOneAsync(todo=>todo.ID==objectId,update);
        existingTodo.Title=req.title;
        existingTodo.Description=req.description;
        existingTodo.isCompleted=req.IsCompleted;
        return existingTodo;
    }
    public async Task<bool> DeleteTodo(string id)
    {
        var objectid= ObjectId.Parse(id);
        var todo= await _todos.DeleteOneAsync(todo=>todo.ID==objectid);
        return todo.DeletedCount>0;
    }
}