using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace backend.Models;

public class Todo
{
    [BsonId]
    public ObjectId ID{get; set;}
    public string Title{ get; set;}= string.Empty;
    public string? Description{get;set;}
    public bool isCompleted{get;set;}
    public DateTime CreatedAt{get;set;}
}