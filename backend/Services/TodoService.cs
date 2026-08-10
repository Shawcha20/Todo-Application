using backend.Models;
using backend.Settings;
using Microsoft.Extensions.Options;
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
    public async Task<List<Todo>> GetAllTodos()
    {
        var todos= await _todos.Find(_=>true).ToListAsync();
        return todos;
    }
}